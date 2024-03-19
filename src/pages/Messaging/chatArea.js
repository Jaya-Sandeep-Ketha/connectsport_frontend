import React, { useEffect, useState } from 'react';
import MessageInput from './messageInput';
import { useAuth } from '../../services/useAuth';

const ChatArea = ({ activeChat, viewMode }) => {
    const [messages, setMessages] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        console.log("[ChatArea] Props:", { activeChat, viewMode });
        console.log(`[ChatArea] currentUser: ${currentUser}, activeChat: ${activeChat}, viewMode: ${viewMode}`);
        if (currentUser && activeChat) {
            const url = viewMode === 'groups'
                ? `${process.env.REACT_APP_API_URL}/groups/${activeChat}/messages`
                : `${process.env.REACT_APP_API_URL}/messages?senderId=${currentUser}&receiverId=${activeChat}`;
            console.log(`[ChatArea] Fetching messages from URL: ${url}`);

            fetch(url)
                .then(response => response.json())
                .then((data) => {
                    console.log('[ChatArea] Fetched messages:', data);
                    setMessages(data);
                })
                .catch(console.error);
        }
    }, [currentUser, activeChat, viewMode]);

    const chatHeader = viewMode === 'groups' 
        ? `Group: ${activeChat}` 
        : `Chatting with: ${activeChat}`;
    console.log(`[ChatArea] chatHeader: ${chatHeader}`);

    return (
        <div className="chat-area">
            <div className="active-chat-header">{chatHeader}</div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.senderId === currentUser ? 'sent' : 'received'}`}>
                        <p><strong>{msg.senderId}:</strong> {msg.text}</p>
                    </div>
                ))}
            </div>
            <MessageInput activeChat={activeChat} viewMode={viewMode} onMessageSend={(newMessage) => setMessages([...messages, newMessage])} />
        </div>
    );
};

export default ChatArea;
