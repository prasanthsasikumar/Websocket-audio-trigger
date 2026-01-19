const WebSocket = require('ws');
const readline = require('readline');

// Configuration - CHANGE THIS TO THE SERVER'S IP ADDRESS
const SERVER_IP = 'localhost'; // Replace with the actual server IP
const SERVER_PORT = 3000;

let ws;
let isConnected = false;

// Setup keyboard input
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

function connectToServer() {
    console.log('='.repeat(60));
    console.log('🎹 Audio Trigger Client');
    console.log('='.repeat(60));
    console.log(`Connecting to: ws://${SERVER_IP}:${SERVER_PORT}`);
    
    ws = new WebSocket(`ws://${SERVER_IP}:${SERVER_PORT}`);

    ws.on('open', () => {
        isConnected = true;
        console.log('✅ Connected to server!');
        console.log('='.repeat(60));
        console.log('Press SPACE to trigger audio');
        console.log('Press Q to quit');
        console.log('='.repeat(60));
    });

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            if (message.type === 'success') {
                console.log('✅', message.message);
            } else if (message.type === 'error') {
                console.error('❌', message.message);
            } else if (message.type === 'connected') {
                console.log('📡', message.message);
            }
        } catch (err) {
            console.log('📨 Server:', data.toString());
        }
    });

    ws.on('close', () => {
        isConnected = false;
        console.log('\n❌ Disconnected from server');
        console.log('Attempting to reconnect in 3 seconds...');
        setTimeout(connectToServer, 3000);
    });

    ws.on('error', (error) => {
        console.error('❌ Connection error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the server is running on the other PC');
        }
    });
}

function sendTrigger() {
    if (isConnected && ws.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ 
            type: 'trigger',
            timestamp: new Date().toISOString()
        });
        ws.send(message);
        console.log('🎵 Trigger sent!');
    } else {
        console.log('⚠️  Not connected to server');
    }
}

// Handle keyboard input
process.stdin.on('keypress', (str, key) => {
    if (key.name === 'space') {
        sendTrigger();
    } else if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
        console.log('\n\n👋 Goodbye!');
        if (ws) {
            ws.close();
        }
        process.exit(0);
    }
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n👋 Goodbye!');
    if (ws) {
        ws.close();
    }
    process.exit(0);
});

// Start connection
connectToServer();
