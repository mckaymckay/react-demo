// server.js
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { URL } from 'url';
import process from 'process';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });



// 心跳检测间隔
const HEARTBEAT_INTERVAL = 30000;

class WebSocketHandler {
    constructor() {
        // 存储所有连接的客户端
        // key: clientId, value: { ws, isAlive, lastHeartbeat }
        this.clients = new Map();
    }

    // 处理新连接
    handleConnection(ws, req) {
        const clientId = this.getClientId(req);

        // 存储客户端信息
        this.clients.set(clientId, {
            ws,
            isAlive: true,
            lastHeartbeat: Date.now()
        });

        console.log(`Client connected: ${clientId}`);

        // 设置心跳检测
        this.setupHeartbeat(ws, clientId);

        // 设置消息处理
        this.setupMessageHandler(ws, clientId);

        // 设置关闭处理
        this.setupCloseHandler(ws, clientId);

        // 发送欢迎消息
        this.sendWelcomeMessage(ws, clientId);
    }

    // 获取客户端ID
    getClientId(req) {
        const params = new URL(req.url, 'ws://localhost').searchParams;
        return params.get('clientId') || Date.now().toString();
    }

    // 设置心跳检测
    setupHeartbeat(ws, clientId) {
        ws.on('pong', () => {
            const client = this.clients.get(clientId);
            if (client) {
                client.isAlive = true;
                client.lastHeartbeat = Date.now();
            }
        });
    }

    // 设置消息处理
    setupMessageHandler(ws, clientId = '100') {
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                await this.handleMessage(clientId, data);
            } catch (error) {
                console.error('Message handling error:', error);
                this.sendError(ws, 'Invalid message format');
            }
        });
    }

    // 处理消息
    async handleMessage(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client) return;
        switch (data.type) {
            case 'chat':
                await this.handleChatMessage(clientId, data);
                break;
            case 'heartbeat':
                await this.handleHeartbeat(clientId);
                break;
            default:
                this.sendError(client.ws, 'Unknown message type');
        }
    }

    // 处理聊天消息
    async handleChatMessage(clientId, data) {
        console.log(98, clientId, data)

        // 广播消息给其他客户端
        this.broadcast({
            type: 'chat',
            senderId: clientId,
            content: data.content,
            timestamp: Date.now()
        }) // 排除发送者

        // 确认消息已收到
        const client = this.clients.get(clientId);
        if (client) {
            client.ws.send(JSON.stringify({
                type: 'ack',
                messageId: data.messageId,
                timestamp: Date.now()
            }));
        }
    }

    // 设置关闭处理
    setupCloseHandler(ws, clientId) {
        ws.on('close', () => {
            console.log(`Client disconnected: ${clientId}`);
            this.clients.delete(clientId);
            this.broadcastUserList();
        });
    }
    // 发送欢迎消息
    sendWelcomeMessage(ws, clientId) {
        ws.send(JSON.stringify({
            type: 'welcome',
            content: `Welcome, client ${clientId}!`,
            timestamp: Date.now()
        }));
    }

    // 发送错误消息
    sendError(ws, message) {
        ws.send(JSON.stringify({
            type: 'error',
            content: message,
            timestamp: Date.now()
        }));
    }

    // 广播消息，excludeClientId排除指定客户端
    broadcast(message, excludeClientId = null) {
        this.clients.forEach((client, clientId) => {
            if (clientId !== excludeClientId && client.ws.readyState === 1) {
                client.ws.send(JSON.stringify(message));
            }
        });
    }

    // 开始心跳检测
    startHeartbeat() {
        setInterval(() => {
            this.clients.forEach((client, clientId) => {
                if (!client.isAlive) {
                    console.log(`Client ${clientId} timed out`);
                    client.ws.terminate();
                    this.clients.delete(clientId);
                    return;
                }

                client.isAlive = false;
                client.ws.ping();
            });
        }, HEARTBEAT_INTERVAL);
    }
}

// 创建 WebSocket 处理器实例
const wsHandler = new WebSocketHandler();

// 处理新的 WebSocket 连接
wss.on('connection', (ws, req) => {
    wsHandler.handleConnection(ws, req);
});

// 启动心跳检测
wsHandler.startHeartbeat();

// 错误处理
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// 启动服务器
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
