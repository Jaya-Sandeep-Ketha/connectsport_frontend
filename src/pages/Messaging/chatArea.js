import React, { useEffect, useState } from 'react';
import MessageInput from './messageInput';
import { useAuth } from '../../services/useAuth'; // Correct path for your useAuth hook

const ChatArea = ({ activeChat }) => {
    const [messages, setMessages] = useState([]);
    const { currentUser } = useAuth(); // Assuming currentUser holds the current user's username

    useEffect(() => {
        if (currentUser && activeChat) {
            // Fetch messages
            const url = `${process.env.REACT_APP_API_URL}/messages?senderId=${currentUser}&receiverId=${activeChat}`;
            fetch(url)
                .then(response => response.json())
                .then(setMessages)
                .catch(console.error);
        }
    }, [currentUser, activeChat]);

    return (
        <div className="chat-area">
            <div className="active-chat-header">
                Chatting with: <strong>{activeChat}</strong>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.senderId === currentUser ? 'sent' : 'received'}`}>
                        <p><strong>{msg.senderId}:</strong> {msg.text}</p>
                    </div>
                ))}
            </div>
            <MessageInput activeChat={activeChat} onMessageSend={(newMessage) => setMessages([...messages, newMessage])} />
        </div>
    );
};

export default ChatArea;

