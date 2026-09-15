# Deploying to Render (Free Tier)

## Steps
1. Push this repo to GitHub (make sure `.env.local` is in `.gitignore`)
2. Go to https://render.com and sign in
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Render will auto-detect `render.yaml` settings
6. In the "Environment Variables" section on Render dashboard, add:
   - Key: `NVIDIA_API_KEY`
   - Value: your actual `nvapi-xxxx...` key
7. Click "Deploy"

## Notes
- Free tier spins down after 15 min inactivity (first request may be slow)
- Do NOT use GitHub Pages — it cannot run Next.js API routes
- Your chatbot URL will be: https://lawrence-portfolio-chatbot.onrender.com
