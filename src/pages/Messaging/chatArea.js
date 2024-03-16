import React, { useEffect, useState } from 'react';
import MessageInput from './messageInput';
import { useAuth } from '../../services/useAuth'; // Correct path for your useAuth hook

const ChatArea = ({ activeChat }) => {
    const [messages, setMessages] = useState([]);
    const { currentUser } = useAuth(); // This should give you the logged-in user's identifier

    useEffect(() => {
        if (currentUser && activeChat) {
            // Construct the URL with query parameters for senderId and receiverId
            const url = `${process.env.REACT_APP_API_URL}/messages?senderId=${currentUser}&receiverId=${activeChat}`;

            fetch(url)
                .then(response => response.json())
                .then(setMessages)
                .catch(console.error);
        }
    }, [currentUser, activeChat]); // Refetch messages when currentUser or activeChat changes

    return (
        <div className="chat-area">
            <div className="chat-messages">
                {messages.map((msg) => (
                    <p key={msg._id}>{msg.text}</p> // Using _id for a unique key
                ))}
            </div>
            <MessageInput activeChat={activeChat} />
        </div>
    );
};

export default ChatArea;
