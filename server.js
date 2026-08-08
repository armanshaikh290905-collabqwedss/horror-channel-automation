import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory storage
let storyIdeas = [
  { id: 1, title: 'The Abandoned Apartment', type: 'Creepypasta', description: 'Woman moves into apartment, strange knocking', used: false },
  { id: 2, title: 'Okiku Legend', type: 'Japanese', description: 'Ten Plates - classic yūrei tale', used: false },
  { id: 3, title: 'The Thing in the Walls', type: 'Creepypasta', description: 'Paranoid narrator discovers something alive in walls', used: false },
  { id: 4, title: 'Shrine Curse', type: 'Japanese', description: 'Tourist ignores shrine warning, faces consequences', used: false },
  { id: 5, title: 'Reddit NoSleep Classic', type: 'Paranormal', description: 'Reddit user documenting paranormal activity', used: false },
];

let generatedScripts = [];
let researchMode = false;

// Load system prompt (all 9 playbooks)
let systemPrompt = '';
try {
  systemPrompt = fs.readFileSync(path.join(__dirname, 'systemPrompt.txt'), 'utf-8');
} catch (err) {
  console.warn('systemPrompt.txt not found, using inline prompt');
  systemPrompt = getInlineSystemPrompt();
}

function getInlineSystemPrompt() {
  return `You are an AI script writer for a horror YouTube channel. Your job is to generate THREE scripts from ONE horror story:
1. A long-form script (10-15 minutes)
2. A Hook Short script (20-35 seconds) 
3. A Climax Short script (25-40 seconds)

Follow these principles:
- Faceless narrated horror stories
- Target USA/UK audience
- Mix of Creepypasta, Japanese/Mystical, Paranormal, Psychological, True Cases, Original stories
- Adaptive narration tones: Dramatic (Creepypasta), Calm (Japanese), Intense (Psychological), Mysterious (Paranormal), Conversational (Character-driven)
- Emphasis on atmosphere over gore, psychology over jump scares
- Include sensory details and make protagonists relatable
- Maintain audience retention through pacing and escalation

OUTPUT FORMAT:
Return valid JSON with this exact structure:
{
  "storyTitle": "Story Title",
  "storyType": "Creepypasta|Japanese|Paranormal|Psychological|Original",
  "narratorTone": "Dramatic|Calm|Intense|Mysterious|Conversational",
  "longForm": {
    "title": "Script title for long-form",
    "duration": "10-15 minutes",
    "narration": "Full narration script (1000-1500 words)..."
  },
  "hookShort": {
    "title": "Hook Short Title",
    "duration": "20-35 seconds",
    "narration": "Hook short script (50-100 words)..."
  },
  "climaxShort": {
    "title": "Climax Short Title", 
    "duration": "25-40 seconds",
    "narration": "Climax short script (60-120 words)..."
  },
  "contentWarnings": "List any content warnings",
  "tips": "Production and delivery tips"
}`;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes

// GET /api/stories - Get all story ideas
app.get('/api/stories', (req, res) => {
  res.json(storyIdeas);
});

// POST /api/stories - Add new story idea
app.post('/api/stories', (req, res) => {
  const { title, type, description } = req.body;
  if (!title || !type) return res.status(400).json({ error: 'Missing required fields' });
  
  const newStory = {
    id: Math.max(...storyIdeas.map(s => s.id), 0) + 1,
    title,
    type,
    description,
    used: false
  };
  storyIdeas.push(newStory);
  res.json(newStory);
});

// PUT /api/stories/:id - Update story
app.put('/api/stories/:id', (req, res) => {
  const story = storyIdeas.find(s => s.id == req.params.id);
  if (!story) return res.status(404).json({ error: 'Story not found' });
  
  Object.assign(story, req.body);
  res.json(story);
});

// DELETE /api/stories/:id - Delete story
app.delete('/api/stories/:id', (req, res) => {
  storyIdeas = storyIdeas.filter(s => s.id != req.params.id);
  res.json({ success: true });
});

// POST /api/generate - Generate scripts for a story
app.post('/api/generate', async (req, res) => {
  try {
    const { storyId } = req.body;
    const story = storyIdeas.find(s => s.id == storyId);
    
    if (!story) return res.status(404).json({ error: 'Story not found' });
    
    const prompt = `Generate horror scripts for this story:
Title: ${story.title}
Type: ${story.type}
Description: ${story.description}

Create the three scripts following the format specified.`;

    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      system: systemPrompt
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse JSON from response
    let scripts;
    try {
      // Find JSON in response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scripts = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseErr) {
      return res.status(500).json({ 
        error: 'Failed to parse AI response', 
        details: parseErr.message,
        rawResponse: content 
      });
    }

    // Mark story as used
    story.used = true;

    // Save generated scripts
    const scriptRecord = {
      id: Date.now(),
      storyId,
      generatedAt: new Date().toISOString(),
      ...scripts
    };
    generatedScripts.push(scriptRecord);

    // Send email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await sendScriptEmail(scriptRecord);
    }

    res.json(scriptRecord);
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/scripts - Get all generated scripts
app.get('/api/scripts', (req, res) => {
  res.json(generatedScripts.slice(-10).reverse()); // Latest 10
});

// GET /api/status - Get channel status
app.get('/api/status', (req, res) => {
  const unusedStories = storyIdeas.filter(s => !s.used).length;
  res.json({
    totalStories: storyIdeas.length,
    usedStories: storyIdeas.filter(s => s.used).length,
    unusedStories,
    generatedScripts: generatedScripts.length,
    researchMode,
    nextScheduledGeneration: getNextScheduleTime()
  });
});

// POST /api/reset - Reset all used stories
app.post('/api/reset', (req, res) => {
  storyIdeas.forEach(s => s.used = false);
  researchMode = false;
  res.json({ success: true, message: 'All stories reset' });
});

// Email sender function
async function sendScriptEmail(scriptRecord) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const emailContent = `
<h2>Horror Channel Scripts Generated</h2>
<p><strong>Story:</strong> ${scriptRecord.storyTitle}</p>
<p><strong>Type:</strong> ${scriptRecord.storyType}</p>
<p><strong>Narrator Tone:</strong> ${scriptRecord.narratorTone}</p>

<h3>Long-Form Script (${scriptRecord.longForm.duration})</h3>
<p><strong>Title:</strong> ${scriptRecord.longForm.title}</p>
<pre>${scriptRecord.longForm.narration}</pre>

<h3>Hook Short (${scriptRecord.hookShort.duration})</h3>
<p><strong>Title:</strong> ${scriptRecord.hookShort.title}</p>
<pre>${scriptRecord.hookShort.narration}</pre>

<h3>Climax Short (${scriptRecord.climaxShort.duration})</h3>
<p><strong>Title:</strong> ${scriptRecord.climaxShort.title}</p>
<pre>${scriptRecord.climaxShort.narration}</pre>

<h3>Content Warnings</h3>
<p>${scriptRecord.contentWarnings}</p>

<h3>Production Tips</h3>
<p>${scriptRecord.tips}</p>

<p>Generated: ${scriptRecord.generatedAt}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: `Horror Scripts: ${scriptRecord.storyTitle}`,
      html: emailContent
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email error:', error);
  }
}

// Daily generation schedule (9 AM)
function scheduleDaily() {
  schedule.scheduleJob('0 9 * * *', async () => {
    console.log('Running scheduled generation...');
    
    const unusedStory = storyIdeas.find(s => !s.used);
    if (unusedStory) {
      try {
        await generateScripts(unusedStory.id);
        console.log(`Generated scripts for: ${unusedStory.title}`);
      } catch (error) {
        console.error('Scheduled generation error:', error);
      }
    } else if (!researchMode) {
      researchMode = true;
      console.log('No more stories in queue. Entering research mode.');
      // In research mode, AI could generate original stories
    }
  });
}

// Helper to generate scripts programmatically
async function generateScripts(storyId) {
  const story = storyIdeas.find(s => s.id === storyId);
  if (!story) throw new Error('Story not found');

  const prompt = `Generate horror scripts for this story:
Title: ${story.title}
Type: ${story.type}
Description: ${story.description}`;

  const message = await groq.messages.create({
    model: 'mixtral-8x7b-32768',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
    system: systemPrompt
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const scripts = JSON.parse(jsonMatch[0]);
  
  story.used = true;
  
  const scriptRecord = {
    id: Date.now(),
    storyId,
    generatedAt: new Date().toISOString(),
    ...scripts
  };
  
  generatedScripts.push(scriptRecord);
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    await sendScriptEmail(scriptRecord);
  }
  
  return scriptRecord;
}

// Get next scheduled generation time
function getNextScheduleTime() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(9, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.toISOString();
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Horror Channel Automation running on http://localhost:${PORT}`);
  scheduleDaily();
  console.log(`Daily generation scheduled for 9:00 AM`);
});
