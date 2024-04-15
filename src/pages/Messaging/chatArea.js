import React, { useEffect, useState } from 'react';
import MessageInput from './messageInput';
import { useAuth } from '../../services/useAuth';

const ChatArea = ({ activeChat, viewMode }) => {
    const [messages, setMessages] = useState([]);
    const { currentUser } = useAuth();
    const fetchInterval = 5000; // Fetch every 5000 milliseconds (5 seconds)

    useEffect(() => {
        const fetchMessages = () => {
            if (currentUser && activeChat) {
                const url = viewMode === 'groups'
                    ? `${process.env.REACT_APP_API_URL}/groups/${activeChat}/messages`
                    : `${process.env.REACT_APP_API_URL}/messages?senderId=${currentUser}&receiverId=${activeChat}`;

                fetch(url)
                    .then(response => response.json())
                    .then((data) => {
                        setMessages(data);
                    })
                    .catch(console.error);
            }
        };

        // Initialize message fetching and set up the interval
        fetchMessages();
        const intervalId = setInterval(fetchMessages, fetchInterval);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [currentUser, activeChat, viewMode]); // Dependencies for effect


    const chatHeader = viewMode === 'groups' 
        ? `Group: ${activeChat}` 
        : `Chatting with: ${activeChat}`;
    
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
