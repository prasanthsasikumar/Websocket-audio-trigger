# WebSocket Audio Trigger - Web Version

🎵 Trigger audio playback across the internet using web pages! Click a button on one page to play audio on another.

## 🌐 Two Deployment Options

### Option A: Web Pages (Recommended)
- **Deploy HTML pages** to Vercel/Netlify (free)
- **Deploy WebSocket server** to Render/Railway (free tier available)
- Access from anywhere on the internet
- Beautiful UI with visualizations

### Option B: Local CLI (Original)
- Direct PC-to-PC connection
- Terminal-based
- See README.md for CLI setup

---

## 🚀 Quick Start - Web Version

### Step 1: Deploy WebSocket Relay Server

The relay server needs to be deployed to a service that supports WebSocket connections.

#### **Deploy to Render (Recommended - Free)**

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (or deploy manually)
4. Settings:
   - **Name**: audio-trigger-relay
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run relay`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Wait for deployment (2-3 minutes)
7. **Copy your service URL**: `https://audio-trigger-relay-xxxx.onrender.com`
8. **Convert to WebSocket URL**: `wss://audio-trigger-relay-xxxx.onrender.com`

#### **Alternative: Deploy to Railway**

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Railway auto-detects Node.js and deploys
5. Get your URL from the deployment
6. Convert HTTP to WSS: `wss://your-app.railway.app`

### Step 2: Deploy Web Pages

#### **Deploy to Netlify (Easiest)**

1. Create account at [netlify.com](https://netlify.com)
2. Drag & drop these files to Netlify:
   - `trigger.html`
   - `player.html`
3. Netlify gives you URLs like:
   - `https://your-site.netlify.app/trigger.html`
   - `https://your-site.netlify.app/player.html`

#### **Alternative: Deploy to Vercel**

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Access your pages at the provided URLs

#### **Or: Use GitHub Pages**

1. Push `trigger.html` and `player.html` to GitHub
2. Enable GitHub Pages in repository settings
3. Access at `https://yourusername.github.io/repo-name/trigger.html`

### Step 3: Configure and Use

1. **Open Player Page** on PC 1:
   - Go to `https://your-site.netlify.app/player.html`
   - Enter your WebSocket server URL (from Step 1)
   - Click "Connect"
   - Upload an MP3/audio file
   - Leave this page open

2. **Open Trigger Page** on PC 2 (or phone/tablet):
   - Go to `https://your-site.netlify.app/trigger.html`
   - Enter the same WebSocket server URL
   - Click "Connect"

3. **Click the TRIGGER button** on PC 2 → audio plays on PC 1! 🎉

---

## 🧪 Testing Locally

Before deploying, test everything on your laptop:

### 1. Start the relay server:
```bash
npm install
npm run relay
```

### 2. Open the pages in your browser:
- Open `player.html` in one browser tab
- Open `trigger.html` in another tab
- Both should say "Connected"

### 3. Test:
- Enter `ws://localhost:3000` in both pages
- Click Connect
- Upload audio in player
- Click trigger button
- Audio should play!

---

## 📁 File Structure

```
web-version/
├── relay-server.js    # WebSocket relay server (deploy to Render/Railway)
├── player.html        # Audio player page (deploy to Netlify/Vercel)
├── trigger.html       # Trigger button page (deploy to Netlify/Vercel)
├── package.json       # Dependencies
└── DEPLOY.md         # This file

cli-version/ (original)
├── server.js          # CLI audio player
├── client.js          # CLI trigger
└── README.md          # CLI instructions
```

---

## 🔧 Configuration

### WebSocket Server URLs

**Local testing:**
- `ws://localhost:3000`

**Production (after deployment):**
- Render: `wss://your-app.onrender.com`
- Railway: `wss://your-app.railway.app`
- Heroku: `wss://your-app.herokuapp.com`

⚠️ **Important**: Use `wss://` (secure) for HTTPS sites, `ws://` for HTTP/localhost

### Ports

The relay server uses port 3000 by default. Services like Render/Railway will automatically assign a port via `process.env.PORT`.

---

## 🎮 Features

### Player Page (player.html)
- ✅ Upload any audio file (MP3, WAV, OGG, etc.)
- ✅ Volume control with slider
- ✅ Visual audio playback indicator
- ✅ Shows connected trigger clients
- ✅ Tracks number of times triggered
- ✅ Auto-reconnects if disconnected
- ✅ Saves settings in browser

### Trigger Page (trigger.html)
- ✅ Big, beautiful trigger button
- ✅ Keyboard support (Space bar)
- ✅ Shows connected players
- ✅ Visual feedback on trigger
- ✅ Auto-reconnects if disconnected
- ✅ Works on mobile devices

### Relay Server (relay-server.js)
- ✅ Handles multiple players and triggers
- ✅ Broadcasts to all connected clients
- ✅ Status updates in real-time
- ✅ Health check endpoint
- ✅ Auto-restart on crash
- ✅ Lightweight and fast

---

## 💡 Use Cases

- 🎓 **Classroom**: Teacher triggers sounds on student computers
- 🎮 **Gaming**: Remote sound effects for online games
- 🎪 **Events**: Synchronized audio cues across devices
- 🔔 **Notifications**: Alert system across multiple devices
- 🎭 **Theater**: Remote audio cue system
- 🏠 **Home**: Doorbell that plays on any device

---

## 🐛 Troubleshooting

### "Connection failed"
- ✅ Check WebSocket URL is correct
- ✅ Ensure relay server is running
- ✅ Use `wss://` for HTTPS sites, `ws://` for localhost
- ✅ Check firewall settings

### "No audio playing"
- ✅ Upload an audio file in player page
- ✅ Check volume is not muted
- ✅ Try a different audio file
- ✅ Check browser console for errors

### "Connected but trigger doesn't work"
- ✅ Ensure both pages are connected to same server
- ✅ Check browser console for errors
- ✅ Try refreshing both pages
- ✅ Check relay server logs

### Free tier limitations
- **Render**: Server sleeps after 15 min inactivity (takes 30s to wake)
- **Railway**: 500 hours/month free tier
- **Netlify**: 100GB bandwidth/month

---

## 🔒 Security Notes

- No authentication built-in (anyone with the URL can trigger)
- Consider adding password protection for production use
- Free tier servers may have downtime
- Audio files are not uploaded to server (client-side only)

---

## 📊 Monitoring

Check your relay server health:
- Visit `https://your-server.onrender.com/health`
- Should return "OK"

---

## 🎯 Next Steps

1. **Deploy the relay server** to Render/Railway
2. **Deploy HTML pages** to Netlify/Vercel  
3. **Test with two devices**
4. **Share the URLs** with others!

Need help? Check the console logs in your browser (F12) and relay server logs on Render/Railway dashboard.

Enjoy triggering audio remotely! 🎵✨
