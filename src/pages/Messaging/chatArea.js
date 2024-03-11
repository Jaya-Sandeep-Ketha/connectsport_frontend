import React from 'react';
import MessageInput from './messageInput';

const ChatArea = ({ activeChat }) => (
  <div className="chat-area">
    <div className="chat-messages">
      {activeChat.messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
    <MessageInput />
  </div>
);

export default ChatArea;
