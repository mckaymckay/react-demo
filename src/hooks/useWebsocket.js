import { useEffect, useRef, useState, useCallback } from 'react';

const Valid_message_type = ['chat', 'welcome', 'error', 'pong'];

const useWebSocket = (url) => {
    const ws = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    // 心跳检测相关
    const pingInterval = useRef(null);
    const missedPongs = useRef(0);

    const PING_INTERVAL = 3000; // 3秒发送一次ping
    const MAX_MISSED_PONGS = 3;  // 最大允许丢失的pong次数

    // 停止心跳检测
    const stopHeartbeat = useCallback(() => {
        if (pingInterval.current) {
            clearInterval(pingInterval.current);
            pingInterval.current = null;
        }
        missedPongs.current = 0;
    }, []);

    // WebSocket连接函数（先声明）
    const connectWebSocket = useCallback(() => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
            setError(null);
            // 开始心跳检测
            missedPongs.current = 0;
            pingInterval.current = setInterval(() => {
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    // 每次发送ping前，丢失计数+1
                    missedPongs.current += 1;

                    if (missedPongs.current > MAX_MISSED_PONGS) {
                        console.log('Too many missed pongs, reconnecting...');
                        stopHeartbeat();
                        if (ws.current) {
                            ws.current.close();
                        }
                        setIsConnected(false);
                        connectWebSocket(); // 直接调用重连
                        return;
                    }

                    ws.current.send(JSON.stringify({ type: 'ping' }));
                    console.log(`Sent ping, missed count: ${missedPongs.current}`);
                }
            }, PING_INTERVAL);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
            stopHeartbeat();
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError(error);
        };

        ws.current.onmessage = (event) => {
            try {
                const content = JSON.parse(event.data);

                if (content.type === 'pong') {
                    // 收到pong，重置计数
                    missedPongs.current = 0;
                    console.log('Received pong, reset missed count');
                    return;
                }

                if (Valid_message_type.includes(content.type)) {
                    setMessages((prev) => [...prev, content]);
                }
            } catch (err) {
                console.error('Failed to parse message:', err);
            }
        };
    }, [url, stopHeartbeat]);

    // 建立连接
    useEffect(() => {
        connectWebSocket();

        return () => {
            stopHeartbeat();
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [connectWebSocket, stopHeartbeat]);

    // 发送消息
    const sendMessage = useCallback((message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
    }, []);

    return { isConnected, messages, sendMessage, error };
};

export default useWebSocket;