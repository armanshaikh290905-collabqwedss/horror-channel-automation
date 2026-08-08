# Railway Deployment Guide - Horror Channel Automation

## Quick Start (5 minutes)

### Step 1: Prepare Your Files
You have all these files ready:
- `server.js` - Main Node.js app
- `package.json` - Dependencies
- `systemPrompt.txt` - All 9 playbooks embedded
- `public/index.html` - Web dashboard
- `.env.example` - Environment template

### Step 2: Create GitHub Repository
1. Go to github.com and create a new repository (name: `horror-channel-automation`)
2. Clone it locally: `git clone https://github.com/YOUR_USERNAME/horror-channel-automation.git`
3. Copy all files into this folder
4. Push to GitHub:
```bash
cd horror-channel-automation
git add .
git commit -m "Initial horror channel automation setup"
git push origin main
```

### Step 3: Deploy on Railway
1. Go to **railway.app**
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account
5. Select your `horror-channel-automation` repository
6. Click **"Deploy"**

### Step 4: Configure Environment Variables
In Railway Dashboard:
1. Go to your project
2. Click **"Variables"** tab
3. Add these:
   - `GROQ_API_KEY` = Your Groq API key
   - `EMAIL_USER` = Your Gmail (optional)
   - `EMAIL_PASSWORD` = Your Gmail app password (optional)
   - `EMAIL_RECIPIENT` = Where to send scripts (optional)
   - `PORT` = 3000 (or leave blank, Railway assigns)

### Step 5: Access Your Dashboard
- Railway will give you a public URL
- Visit it: `https://your-app.railway.app`
- Dashboard is live! 🎉

---

## Getting Your Groq API Key

1. Go to **console.groq.com**
2. Sign up (free)
3. Go to **"API Keys"**
4. Create new key
5. Copy and paste into Railway as `GROQ_API_KEY`

---

## Email Setup (Optional)

### Gmail Configuration
1. Enable 2-factor authentication on your Gmail
2. Go to myaccount.google.com
3. Click **"Security"** (left sidebar)
4. Find **"App passwords"**
5. Select "Mail" and "Windows Computer"
6. Google generates a 16-character password
7. Use this as `EMAIL_PASSWORD` in Railway

### Variables in Railway:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_RECIPIENT=your_email@gmail.com
```

---

## Managing Your Channel on Railway

### Dashboard Access
- Your app URL: `https://your-app.railway.app`
- Add story ideas via web form
- Generate scripts on-demand
- View all generated scripts

### Daily Automation (9 AM)
- Runs automatically every day at 9 AM
- Generates next unused story
- Emails script to EMAIL_RECIPIENT
- Marks story as used

### Monitoring
- Railway Dashboard shows:
  - Logs (what's happening)
  - Deployments (version history)
  - Analytics (usage stats)
  - Variables (your secrets)

---

## File Structure

```
horror-channel-automation/
├── server.js                 # Main app
├── package.json              # Dependencies
├── systemPrompt.txt          # All 9 playbooks
├── railway.json              # Railway config
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
└── public/
    └── index.html            # Web dashboard
```

---

## Troubleshooting

### App Won't Start
1. Check Railway logs (click "Logs" tab)
2. Verify `GROQ_API_KEY` is set correctly
3. Check `package.json` has correct dependencies

### Generation Fails
1. Verify API key is valid at console.groq.com
2. Check Groq API status (not rate limited)
3. Look at Railway logs for error message

### Email Not Sending
1. Verify Gmail 2FA is enabled
2. Verify app password (16 chars) is correct
3. Check EMAIL_USER has valid Gmail account

---

## Updating Your App

### To Update Code
1. Make changes locally
2. Push to GitHub: `git add . && git commit -m "message" && git push`
3. Railway auto-deploys! (takes 1-2 minutes)

### To Update Playbooks
1. Edit `systemPrompt.txt`
2. Commit and push
3. App redeploys with new prompts

### To Reset Everything
1. Go to Railway Dashboard
2. Click project settings
3. Click "Redeploy"
4. Choose "Redeploy Latest" or specific commit

---

## Costs

**Free tier includes:**
- 5 GB bandwidth/month
- $5 credit/month (usually covers everything)
- Unlimited projects
- Unlimited deployments

**Your app should cost:** $0-2/month
- Groq API: Free tier (plenty for your needs)
- Railway: Minimal usage cost

---

## Next Steps After Deployment

1. **Add Story Ideas** (10-15 to start)
   - Mix of Creepypasta, Japanese, Paranormal, Original
   - Use web dashboard

2. **Test Generation**
   - Click "Generate Scripts" in dashboard
   - Verify output quality
   - Adjust systemPrompt.txt if needed

3. **Set Up Email** (optional but nice)
   - Configure Gmail app password
   - Add variables in Railway
   - Get daily emails at 9 AM

4. **Record Narration**
   - Download generated scripts
   - Use TTS tool or hire narrator
   - Upload to YouTube

5. **Scale**
   - Add 20+ story ideas
   - Run 2-3 generations per week
   - Post to YouTube schedule

---

## Quick Commands (If Using CLI)

### Install Railway CLI
```bash
npm i -g @railway/cli
```

### Login
```bash
railway login
```

### Deploy
```bash
railway up
```

### View Logs
```bash
railway logs
```

### Add Variable
```bash
railway variables set GROQ_API_KEY your_key_here
```

---

## Support

- **Railway Docs:** railway.app/docs
- **Groq API Docs:** console.groq.com/docs
- **Discord:** Ask in Railway community

---

**Your horror channel automation is now live on Railway!** 👻🚀

Next: Add story ideas and start generating scripts!
