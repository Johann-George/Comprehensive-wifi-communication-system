// Previous imports remain the same
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');


class StreamingTracker {
    constructor() {
        this.wss = new WebSocket.Server({ port: 8001 });
        this.clients = new Map(); // Store client connections and their data
        this.setupWebSocket();
        this.startStatsInterval();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            const clientId = uuidv4();
            this.clients.set(clientId, {
                ws,
                latency: 0,
                lastSeen: Date.now()
            });

            // Send client their ID
            ws.send(JSON.stringify({
                type: 'clientId',
                clientId
            }));

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    if (data.type === 'latency') {
                        const client = this.clients.get(data.clientId);
                        if (client) {
                            client.latency = data.latency;
                            client.lastSeen = Date.now();
                        }
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            });

            ws.on('close', () => {
                this.clients.delete(clientId);
                this.broadcastStats();
            });
        });

        console.log('[WebSocket] Server listening on port 8001');
    }

    getStats() {
        // Clean up stale connections (no updates in 10 seconds)
        const now = Date.now();
        for (const [clientId, client] of this.clients.entries()) {
            if (now - client.lastSeen > 10000) {
                this.clients.delete(clientId);
            }
        }

        const activeUsers = this.clients.size;
        let totalLatency = 0;

        for (const client of this.clients.values()) {
            totalLatency += client.latency;
        }

        const averageLatency = activeUsers > 0 ? totalLatency / activeUsers : 0;

        return {
            activeUsers,
            averageLatency
        };
    }

    broadcastStats() {
        const stats = this.getStats();
        const message = JSON.stringify({
            type: 'stats',
            ...stats
        });

        for (const client of this.clients.values()) {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(message);
            }
        }

        // Log to console
        console.log('\n[Stats] Current viewers:', stats.activeUsers);
        console.log('[Stats] Average latency:', stats.averageLatency.toFixed(2), 'ms');
    }

    startStatsInterval() {
        setInterval(() => this.broadcastStats(), 1000);
    }
}

class StreamingServer {
    constructor() {
        // Same initialization as before
        this.mediaRoot = path.join(__dirname, 'media');
        this.streamingDir = path.join(this.mediaRoot, 'live', 'test');
        fs.mkdirSync(this.streamingDir, { recursive: true });
        this.ffmpegProcess = null;
        this.app = express();
        this.setupExpress();
        this.startFFmpeg();

        this.tracker = new StreamingTracker();
    }

    setupExpress() {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        // Serve our HTML player
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'LiveServer.html'));
        });

        // Serve media files
        this.app.use('/live', express.static(path.join(this.mediaRoot, 'live')));
        this.app.use(express.static(__dirname + '/'));

        this.app.listen(8000, () => {
            console.log('[HTTP] Server listening on port 8000');
            console.log('[HTTP] Player available at http://localhost:8000');
        });

        this.startChatbotUI();
    }

    startChatbotUI() {
        const chatbotApp = express();
    
        chatbotApp.use(express.json());
    
        chatbotApp.use(express.static(path.join(__dirname, 'public')));

        chatbotApp.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'chatbot-ui.html'));
        });
        
        chatbotApp.listen(5000, () => {
            console.log('[Chatbot UI] Server listening on port 5000');
            console.log('[Chatbot UI] Available at http://localhost:5000');
        });
    }
  
    startFFmpeg() {
        const ffmpegPath = 'C:\\Users\\johan\\Downloads\\ffmpeg\\ffmpeg\\bin\\ffmpeg.exe';
        const args = [
            '-listen', '1',
            '-i', 'rtmp://127.0.0.1:1935/live/test',
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-f', 'hls',
            '-hls_time', '2',
            '-hls_list_size', '3',
            '-hls_flags', 'delete_segments+append_list',
            '-hls_segment_filename', path.join(this.streamingDir, '%d.ts'),
            path.join(this.streamingDir, 'index.m3u8')
        ];

        this.ffmpegProcess = spawn(ffmpegPath, args);

        this.ffmpegProcess.stdout.on('data', (data) => {
            console.log('[FFmpeg]', data.toString().trim());
        });

        this.ffmpegProcess.stderr.on('data', (data) => {
            const message = data.toString().trim();
            if (message && !message.includes('API-NEW-ERA')) {
                console.log('[FFmpeg]', message);
            }
        });

        this.ffmpegProcess.on('close', (code) => {
            console.log('[FFmpeg] Process closed with code:', code);
            setTimeout(() => this.startFFmpeg(), 1000);
        });
    }

    startMonitoring() {
        setInterval(() => {
            try {
                if (fs.existsSync(this.streamingDir)) {
                    const files = fs.readdirSync(this.streamingDir);
                    if (files.length > 0) {
                        console.log('\nStreaming files:');
                        files.forEach(file => {
                            try {
                                const filePath = path.join(this.streamingDir, file);
                                if (fs.existsSync(filePath)) {
                                    const stats = fs.statSync(filePath);
                                    console.log(`- ${file}: ${stats.size} bytes`);
                                    
                                    if (file === 'index.m3u8') {
                                        const content = fs.readFileSync(filePath, 'utf8');
                                        console.log('Playlist content:\n', content);
                                    }
                                }
                            } catch (err) {
                                // Ignore file errors as segments may be deleted
                            }
                        });
                    }
                }
            } catch (err) {
                console.log('[Monitor] Error:', err.message);
            }
        }, 5000);
    }
}

const server = new StreamingServer();
server.startMonitoring();

process.on('SIGINT', () => {
    if (server.ffmpegProcess) {
        server.ffmpegProcess.kill();
    }
    process.exit();
});