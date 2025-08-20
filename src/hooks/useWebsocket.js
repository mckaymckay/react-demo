import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (url) => {
    const ws = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    const Valid_message_type = ['chat', 'welcome', 'error'];

    // 建立连接
    useEffect(() => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError(error);
        };

        ws.current.onmessage = (event) => {
            const content = JSON.parse(event.data);
            if (Valid_message_type.includes(content.type)) {
                setMessages((prev) => [...prev, content]);
            }
        };

        // 清理函数
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [url]);

    // 发送消息
    const sendMessage = useCallback((message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
    }, []);

    return { isConnected, messages, sendMessage, error };
};

export default useWebSocket;