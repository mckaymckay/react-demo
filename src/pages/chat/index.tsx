import React, { useState } from 'react'
import useWebSocket from '../../hooks/useWebSocket'
import './index.css'
import { useNotifier } from '../../hooks/useNotification'
import { messageNotification } from '../../utils/notifier'

const Chat = () => {
    const [inputMessage, setInputMessage] = useState('');
    const { isConnected, messages, sendMessage, error } = useWebSocket('ws://192.168.31.112:8080?oa=mckay');



    useNotifier()
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

    const handleClick = () => {
        if (!("Notification" in window)) {
            console.log("此浏览器不支持通知。");
            return;
        }
        Notification.requestPermission().then((permission) => {
            console.log('33-Notification', permission)
        });
    }

    const handleMessageNotification = () => {
        messageNotification()
    }

    return (
        <div className="chat-container">
            <button onClick={handleClick}>启用通知</button>
            <button onClick={handleMessageNotification}>新消息通知</button>

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
