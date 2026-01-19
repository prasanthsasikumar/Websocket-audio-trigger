# WebSocket Audio Trigger

Trigger MP3 audio playback across two PCs on the same network using a keypress.

## 🎯 How It Works

- **PC 1 (Server)**: Runs the WebSocket server and plays audio when triggered
- **PC 2 (Client)**: Sends trigger commands via keypress to play audio on PC 1

## 📋 Prerequisites

- Node.js installed on both PCs
- Both PCs connected to the same network
- An MP3 file to play

## 🚀 Setup Instructions

### Step 1: Install Dependencies (Both PCs)

```bash
npm install
```

### Step 2: Setup Server PC (Audio Player)

1. **Place your MP3 file** in the project folder and name it `audio.mp3`
   - Or edit `server.js` line 7 to point to your audio file

2. **Find the server's IP address**:
   - macOS/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig`
   - Look for the IP starting with 192.168.x.x or 10.x.x.x

3. **Start the server**:
   ```bash
   npm run server
   ```

4. **Note the IP address** displayed - you'll need this for the client

### Step 3: Setup Client PC (Trigger Sender)

1. **Edit `client.js`** line 6:
   ```javascript
   const SERVER_IP = '192.168.1.100'; // Replace with your server's IP
   ```

2. **Start the client**:
   ```bash
   npm run client
   ```

## 🎮 Usage

Once both are running:

- **Press SPACE** on the client PC to trigger audio on the server PC
- **Press Q** to quit the client

## 🔧 Troubleshooting

### Connection Refused
- Make sure the server is running first
- Verify you're using the correct IP address
- Check if firewall is blocking port 8080

### No Audio Playing
- Verify `audio.mp3` exists in the server folder
- Check audio system permissions
- On macOS, you may need to install `ffmpeg`: `brew install ffmpeg`
- On Linux: `sudo apt-get install alsa-utils`

### Can't Find IP Address
- Run `npm run server` - it will display the local IP
- Make sure both PCs are on the same network

## 🔥 Advanced Usage

### Custom Port
Edit both files:
- `server.js` line 6: `const PORT = 8080;`
- `client.js` line 7: `const SERVER_PORT = 8080;`

### Different Audio File
Edit `server.js` line 7:
```javascript
const AUDIO_FILE = './path/to/your/file.mp3';
```

### Multiple Clients
Multiple PCs can connect to the same server and all can trigger the audio!

## 📝 Notes

- The server will auto-restart if it crashes
- The client will auto-reconnect if disconnected
- Audio playback is asynchronous - multiple triggers will queue

## 🛠️ System Requirements

### Audio Players
The system will try to use available audio players:
- macOS: `afplay` (built-in)
- Windows: `mplayer`, `mpg123`, `mpg321`, or `play`
- Linux: `mpg123`, `mpg321`, `play`, `aplay`, or `alsa`

If you don't have a player, install one:
- macOS: Built-in, no action needed
- Windows: `choco install mpg123`
- Linux: `sudo apt-get install mpg123`
