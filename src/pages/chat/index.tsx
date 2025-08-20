import React, { use, useEffect, useState } from 'react'
import useWebSocket from '../../hooks/useWebSocket'
import './index.css'
// import { useNotifier } from '../../hooks/useNotification'


const Chat = () => {
    const [inputMessage, setInputMessage] = useState('');
    const { isConnected, messages, sendMessage, error } = useWebSocket('ws://localhost:8080');

    audioUrl

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            sendMessage({
                type: 'chat',
                content: inputMessage,
                timestamp: Date.now()
            });
            setInputMessage('');
        }
    };

    return (
        <div className="chat-container">
            {/* 连接状态 */}
            <div className="status-bar">
                {isConnected ? (
                    <span className="status-connected">Connected</span>
                ) : (
                    <span className="status-disconnected">Disconnected</span>
                )}
            </div>

            {/* 消息列表 */}
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <span className="timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="content">{msg.content}</span>
                    </div>
                ))}
            </div>

            {/* 输入框 */}
            <form onSubmit={handleSubmit} className="input-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                />
                <button type="submit" disabled={!isConnected}>
                    Send
                </button>
            </form>

            {/* 错误提示 */}
            {error && (
                <div className="error-message">
                    Connection error: {error.message}
                </div>
            )}
        </div>
    );
};

export default Chat;
