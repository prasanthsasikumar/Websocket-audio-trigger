const WebSocket = require('ws');
const player = require('play-sound')(opts = {});
const os = require('os');

// Configuration
const PORT = 3000;
const AUDIO_FILE = './audio.mp3'; // Place your MP3 file here

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log('='.repeat(60));
console.log('🎵 Audio Trigger Server Started');
console.log('='.repeat(60));
console.log(`Local IP: ${getLocalIP()}`);
console.log(`Port: ${PORT}`);
console.log(`Audio File: ${AUDIO_FILE}`);
console.log('='.repeat(60));
console.log('Waiting for connections...\n');

wss.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`✅ Client connected from: ${clientIP}`);
    
    // Send welcome message
    ws.send(JSON.stringify({ 
        type: 'connected', 
        message: 'Connected to audio trigger server' 
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`📨 Received: ${data.type} from ${clientIP}`);
            
            if (data.type === 'trigger') {
                console.log('🎵 Playing audio...');
                
                // Play the audio file
                player.play(AUDIO_FILE, (err) => {
                    if (err) {
                        console.error('❌ Error playing audio:', err.message);
                        ws.send(JSON.stringify({ 
                            type: 'error', 
                            message: `Failed to play audio: ${err.message}` 
                        }));
                    } else {
                        console.log('✅ Audio playback completed');
                        ws.send(JSON.stringify({ 
                            type: 'success', 
                            message: 'Audio played successfully' 
                        }));
                    }
                });
            }
        } catch (err) {
            console.error('❌ Error processing message:', err.message);
        }
    });

    ws.on('close', () => {
        console.log(`❌ Client disconnected: ${clientIP}\n`);
    });

    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error.message);
    });
});

wss.on('error', (error) => {
    console.error('❌ Server error:', error.message);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...');
    wss.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
