const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 3000;

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('WebSocket Audio Relay Server Running');
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

const clients = {
    players: new Set(),
    triggers: new Set()
};

console.log('='.repeat(60));
console.log('🔄 WebSocket Relay Server Started');
console.log('='.repeat(60));
console.log(`Port: ${PORT}`);
console.log('='.repeat(60));

wss.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`🔌 New connection from: ${clientIP}`);
    
    let clientType = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // Register client type
            if (data.type === 'register') {
                clientType = data.role; // 'player' or 'trigger'
                
                if (clientType === 'player') {
                    clients.players.add(ws);
                    console.log(`🎵 Audio player registered (${clients.players.size} total)`);
                } else if (clientType === 'trigger') {
                    clients.triggers.add(ws);
                    console.log(`🎹 Trigger client registered (${clients.triggers.size} total)`);
                }
                
                ws.send(JSON.stringify({ 
                    type: 'registered', 
                    role: clientType,
                    message: `Registered as ${clientType}` 
                }));
                
                // Broadcast connection counts
                broadcastStatus();
            }
            
            // Relay trigger to all players
            else if (data.type === 'trigger') {
                console.log(`📨 Trigger received, relaying to ${clients.players.size} player(s)`);
                
                clients.players.forEach(player => {
                    if (player.readyState === WebSocket.OPEN) {
                        player.send(JSON.stringify({
                            type: 'trigger',
                            timestamp: data.timestamp || new Date().toISOString()
                        }));
                    }
                });
                
                // Confirm to sender
                ws.send(JSON.stringify({ 
                    type: 'success', 
                    message: `Triggered ${clients.players.size} player(s)` 
                }));
            }
            
            // Player acknowledgment
            else if (data.type === 'played') {
                console.log(`✅ Audio played on player`);
                
                // Notify all trigger clients
                clients.triggers.forEach(trigger => {
                    if (trigger.readyState === WebSocket.OPEN) {
                        trigger.send(JSON.stringify({
                            type: 'played',
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
        if (clientType === 'player') {
            clients.players.delete(ws);
            console.log(`❌ Player disconnected (${clients.players.size} remaining)`);
        } else if (clientType === 'trigger') {
            clients.triggers.delete(ws);
            console.log(`❌ Trigger disconnected (${clients.triggers.size} remaining)`);
        }
        broadcastStatus();
    });

    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error.message);
    });
});

function broadcastStatus() {
    const status = {
        type: 'status',
        players: clients.players.size,
        triggers: clients.triggers.size
    };
    
    const statusMessage = JSON.stringify(status);
    
    [...clients.players, ...clients.triggers].forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(statusMessage);
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log('Ready to relay audio triggers!\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...');
    wss.close(() => {
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
});
