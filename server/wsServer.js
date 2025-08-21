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
const HEARTBEAT_INTERVAL = 10000;

class WebSocketHandler {
    constructor() {
        // 存储所有连接的客户端
        // key: clientId, value: { ws, isAlive, lastHeartbeat, userId, sessionId }
        this.clients = new Map();

        // 存储用户会话映射 - 新增
        // key: userId, value: { clientId, sessionId, timestamp }
        this.userSessions = new Map();
    }

    // 处理新连接
    handleConnection(ws, req) {
        const clientId = this.getClientId(req);
        const userId = this.getUserId(req);
        const sessionId = this.getSessionId(req);

        console.log(`Client connecting: ${clientId}, User: ${userId}, Session: ${sessionId}`);

        // 检查是否已有该用户的连接 - 新增逻辑
        if (this.userSessions.has(userId)) {
            const existingSession = this.userSessions.get(userId);
            const existingClient = this.clients.get(existingSession.clientId);


            // 如果是不同的会话，断开旧连接
            if (existingSession.sessionId !== sessionId && existingClient) {
                console.log(`User ${userId} new session ${sessionId}, disconnecting old session ${existingSession.sessionId}`);

                // 通知旧连接被强制断开
                if (existingClient.ws.readyState === 1) {
                    existingClient.ws.send(JSON.stringify({
                        type: 'force_disconnect',
                        reason: 'new_session_connected',
                        content: '另一个浏览器已连接，当前连接将断开',
                        timestamp: Date.now()
                    }));

                    // 延迟关闭，确保消息发送完成
                    setTimeout(() => {
                        // 生效
                        existingClient.ws.close(1000, 'New session connected');
                    }, 100);
                }

                // 清理旧客户端
                this.clients.delete(existingSession.clientId);
            }
        }

        // 存储客户端信息
        this.clients.set(clientId, {
            ws,
            isAlive: true,
            lastHeartbeat: Date.now(),
            userId,
            sessionId
        });

        // 更新用户会话映射 - 新增
        this.userSessions.set(userId, {
            clientId,
            sessionId,
            timestamp: Date.now()
        });

        console.log(`Client connected: ${clientId}, User: ${userId}`);

        // 设置心跳检测
        this.setupHeartbeat(ws, clientId);

        // 设置消息处理
        this.setupMessageHandler(ws, clientId);

        // 设置关闭处理
        this.setupCloseHandler(ws, clientId);

        // 发送欢迎消息
        this.sendWelcomeMessage(ws, clientId, userId);
    }

    // 获取客户端ID
    getClientId(req) {
        const params = new URL(req.url, 'ws://localhost').searchParams;
        return params.get('clientId') || Date.now().toString();
    }

    // 获取用户ID - 新增
    getUserId(req) {
        const params = new URL(req.url, 'ws://localhost').searchParams;
        return params.get('oa') || 'anonymous';
    }

    // 获取会话ID - 新增
    getSessionId(req) {
        const params = new URL(req.url, 'ws://localhost').searchParams;
        return params.get('sessionId') || Date.now().toString();
    }

    // 设置心跳检测,server发给浏览器的ping-pong
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
    setupMessageHandler(ws, clientId) {
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

    // 处理消息，能收到客户端发来的ping
    async handleMessage(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client) return;

        switch (data.type) {
            case 'chat':
                await this.handleChatMessage(clientId, data);
                break;
            case 'ping':
                await this.handleHeartbeat(clientId);
                break;
            default:
                this.sendError(client.ws, 'Unknown message type');
        }
    }

    // 处理聊天消息
    async handleChatMessage(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client) return;

        console.log(`Chat from ${clientId} (User: ${client.userId}):`, data.content);

        // 广播消息给其他客户端
        this.broadcast({
            type: 'chat',
            senderId: clientId,
            userId: client.userId,
            content: data.content,
            timestamp: Date.now()
        });

        // 确认消息已收到
        client.ws.send(JSON.stringify({
            type: 'ack',
            messageId: data.messageId,
            timestamp: Date.now()
        }));
    }

    async handleHeartbeat(clientId) {
        const client = this.clients.get(clientId);
        if (!client) return;

        // 回复pong给发送ping的客户端
        client.ws.send(JSON.stringify({
            type: 'pong',
            content: '我收到了你的ping',
            timestamp: Date.now()
        }));
    }

    // 设置关闭处理
    setupCloseHandler(ws, clientId) {
        ws.on('close', () => {
            console.log(`Client disconnected: ${clientId}`);

            const client = this.clients.get(clientId);
            if (client && client.userId) {
                // 只有当前会话才删除用户会话记录 - 修改
                const userSession = this.userSessions.get(client.userId);
                if (userSession && userSession.clientId === clientId) {
                    this.userSessions.delete(client.userId);
                    console.log(`User ${client.userId} session ${client.sessionId} disconnected`);
                }
            }

            this.clients.delete(clientId);
        });
    }

    // 发送欢迎消息
    sendWelcomeMessage(ws, clientId, userId) {
        ws.send(JSON.stringify({
            type: 'welcome',
            content: `Welcome, ${userId}! (Client: ${clientId})`,
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

                    // 清理用户会话映射 - 新增
                    if (client.userId) {
                        const userSession = this.userSessions.get(client.userId);
                        if (userSession && userSession.clientId === clientId) {
                            this.userSessions.delete(client.userId);
                        }
                    }
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
