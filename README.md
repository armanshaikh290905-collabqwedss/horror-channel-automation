# 👻 Horror Channel Automation System

Automated script generation for **faceless narrated horror YouTube channel**. Generates:
- 1 Long-form script (10-15 min)
- 2 YouTube Shorts scripts (per story)

Every story, every day via Groq API + Railway deployment.

---

## What It Does

✅ **Daily Script Generation** - 9 AM automatic generation  
✅ **Adaptive Narration** - Tone matches story type (Dramatic, Calm, Intense, Mysterious, Conversational)  
✅ **Story Queue** - Manage 10+ story ideas  
✅ **Web Dashboard** - Add/manage stories, generate on-demand  
✅ **Email Delivery** - Scripts sent daily (optional)  
✅ **Research Mode** - Auto-generates original stories when queue empty  
✅ **100% Free** - Groq API free tier + Railway free tier  

---

## Quick Start (5 Minutes)

### 1. Get Your Groq API Key
- Go to **console.groq.com**
- Sign up (free)
- Create API key
- Copy it

### 2. Fork/Clone This Repository
```bash
git clone https://github.com/YOUR_USERNAME/horror-channel-automation.git
cd horror-channel-automation
npm install
```

### 3. Set Up Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```
GROQ_API_KEY=your_key_here
PORT=3000
```

### 4. Run Locally (Optional Testing)
```bash
npm start
```
Visit: `http://localhost:3000`

### 5. Deploy to Railway
1. Push to GitHub
2. Go to **railway.app**
3. Connect GitHub repo
4. Set `GROQ_API_KEY` variable
5. Deploy!

**Done!** Your dashboard is live 🚀

---

## How It Works

### Architecture
```
Web Dashboard (HTML/CSS/JS)
         ↓
  Express Server (Node.js)
         ↓
   Groq API (LLM)
         ↓
Generated Scripts (JSON)
         ↓
Email / Web Display
```

### Daily Flow
```
9:00 AM
  ↓
Check story queue
  ↓
Find unused story
  ↓
Send to Groq API
  ↓
Get 3 scripts (long-form + 2 shorts)
  ↓
Save to database
  ↓
Email to you
  ↓
Done! (Repeat tomorrow)
```

---

## Features

### Story Management
- Add unlimited story ideas
- Mark as used/unused
- Track story sources (Creepypasta, Japanese, Paranormal, Original)
- Reset all when queue empty

### Script Generation
- **Long-Form Script** (10-15 min)
  - Full hook → escalation → climax → resolution
  - Adaptive narration tone
  - Production tips included

- **Hook Short** (20-35 sec)
  - Designed to go viral
  - Creates curiosity
  - Calls-to-action

- **Climax Short** (25-40 sec)
  - Peak moment
  - Drives engagement
  - Makes people want full video

### Dashboard Features
- 📊 Status cards (stories, scripts, mode)
- 📚 Story management UI
- ✨ On-demand generation
- 📄 View all generated scripts
- ⚙️ System monitoring

---

## File Structure

```
├── server.js                    # Main Express app
├── package.json                 # Dependencies
├── systemPrompt.txt             # All 9 playbooks (system prompt)
├── railway.json                 # Railway config
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore
├── README.md                    # This file
├── RAILWAY_DEPLOYMENT.md        # Deployment guide
└── public/
    └── index.html              # Web dashboard
```

---

## API Endpoints

### Stories
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Add new story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

### Generation
- `POST /api/generate` - Generate scripts for story
- `GET /api/scripts` - Get generated scripts (latest 10)

### System
- `GET /api/status` - Channel status
- `POST /api/reset` - Reset all stories

---

## The 9 Playbooks (Embedded in systemPrompt.txt)

1. **Channel Blueprint** - Positioning, audience, goals
2. **Style Guide** - Brand voice, tones, audio production
3. **Story Curation** - Sourcing, adapting, creating stories
4. **Japanese/Mystical** - Folklore, cultural respect, structure
5. **Long-Form Template** - 10-15 min video structure
6. **Shorts Template** - 20-40 sec script structure
7. **Narration Tone Guide** - 5 adaptive tones
8. **Retention Playbook** - Pacing, engagement, drops
9. **YouTube SEO** - Keywords, titles, thumbnails

All embedded in AI system prompt for consistent quality.

---

## Content Strategy

**Story Mix** (Monthly):
- 40% AI Original Stories
- 25% Japanese/Mystical Adaptations
- 20% Reddit/Public Domain Stories
- 15% Paranormal/True Cases

**Narration Tones**:
- **Dramatic** - Creepypasta, action-oriented
- **Calm** - Japanese, mystical, meditative
- **Intense** - Psychological, unreliable narrator
- **Mysterious** - Paranormal, documentary-style
- **Conversational** - Character-driven, memoir

**Video Format**:
- Faceless (no visuals, pure narration)
- Black screen with ambient music
- Text-only shorts with narration

---

## Deployment

### Railway (Recommended)
**Simplest Option - 5 minutes to live**

1. Push to GitHub
2. Connect Railway to your repo
3. Set environment variables
4. Done!

See `RAILWAY_DEPLOYMENT.md` for full guide.

### Local Development
```bash
npm install
npm start
```

Visit `http://localhost:3000`

### Environment Variables Needed
```
GROQ_API_KEY          # Required - Your Groq API key
EMAIL_USER            # Optional - Gmail for daily emails
EMAIL_PASSWORD        # Optional - Gmail app password
EMAIL_RECIPIENT       # Optional - Where to send scripts
PORT                  # Optional - Default 3000
```

---

## Usage

### Via Web Dashboard
1. Visit your app URL
2. Go to "📚 Story Ideas"
3. Add 10-15 story ideas (title, type, description)
4. Go to "✨ Generate Scripts"
5. Click "Generate" on any unused story
6. View results in "📄 Generated Scripts"

### Automatic (9 AM Daily)
- System auto-generates next unused story
- Sends to email (if configured)
- Marks as used
- When queue empty → Research Mode (generates original)

### On-Demand
- Click "Generate" anytime
- Get scripts immediately
- No waiting required

---

## Costs

### Free Forever
- **Groq API**: Free tier (plenty for your needs)
- **Railway**: Free tier + $5 credit/month

### Your Estimated Cost
- 2-3 generations/week = $0-2/month (usually free)
- Email setup = $0 (uses Gmail)

---

## Getting Help

### Common Issues

**App won't start**
- Check Railway logs
- Verify GROQ_API_KEY is set
- Ensure package.json dependencies installed

**Generation fails**
- Verify API key at console.groq.com
- Check Groq rate limits
- Look at Railway logs

**Email not sending**
- Verify Gmail 2FA enabled
- Check app password (16 chars)
- Confirm EMAIL_USER variable set

### Resources
- Railway Docs: railway.app/docs
- Groq API: console.groq.com/docs
- Node.js: nodejs.org/docs

---

## Next Steps

1. ✅ **Deploy on Railway**
   - Follow RAILWAY_DEPLOYMENT.md

2. ✅ **Add Story Ideas**
   - Use web dashboard
   - Add 10-15 to start

3. ✅ **Test Generation**
   - Generate 1-2 scripts
   - Review quality
   - Adjust if needed

4. ✅ **Record Narration**
   - Use TTS tool (Google, ElevenLabs, etc)
   - Or hire narrator
   - Download scripts from dashboard

5. ✅ **Upload to YouTube**
   - Post long-form videos
   - Post Shorts
   - Build channel

---

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI**: Groq API (Mixtral 8x7B)
- **Deployment**: Railway
- **Database**: In-memory (easily upgradeable)
- **Email**: Nodemailer + Gmail SMTP

---

## Future Enhancements

**Possible Additions:**
- Persistent database (MongoDB)
- Video upload integration
- TTS narration service
- Analytics dashboard
- Playlist management
- YouTube API integration
- Automated uploads

**For Now:** Focus on script generation → manual upload → grow channel

---

## License

MIT - Free to use and modify

---

## Feedback

Want to improve? 
- Star this repo
- Fork and enhance
- Submit issues
- Share results!

---

**Ready?** Go to `RAILWAY_DEPLOYMENT.md` and deploy! 🚀👻

Your horror channel automation is about to launch.
