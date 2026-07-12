"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseManager = void 0;
class SSEManager {
    constructor() {
        this.clients = new Map();
    }
    addClient(clientId, res, userId) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
        this.clients.set(clientId, { res, userId });
        // Keep alive ping every 30 seconds
        const keepAlive = setInterval(() => {
            if (this.clients.has(clientId)) {
                res.write(': ping\n\n');
            }
            else {
                clearInterval(keepAlive);
            }
        }, 30000);
        console.log(`SSE client connected: ${clientId} (total: ${this.clients.size})`);
    }
    removeClient(clientId) {
        this.clients.delete(clientId);
        console.log(`SSE client disconnected: ${clientId} (total: ${this.clients.size})`);
    }
    broadcast(event, data) {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        this.clients.forEach(({ res }, clientId) => {
            try {
                res.write(payload);
            }
            catch (err) {
                console.error(`Error broadcasting to client ${clientId}:`, err);
                this.clients.delete(clientId);
            }
        });
    }
    sendToUser(userId, event, data) {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        this.clients.forEach(({ res, userId: clientUserId }, clientId) => {
            if (clientUserId === userId) {
                try {
                    res.write(payload);
                }
                catch (err) {
                    console.error(`Error sending to user ${userId} client ${clientId}:`, err);
                    this.clients.delete(clientId);
                }
            }
        });
    }
    getClientCount() {
        return this.clients.size;
    }
}
exports.sseManager = new SSEManager();
