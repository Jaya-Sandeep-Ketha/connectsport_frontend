import React, { useState } from 'react';
import { useAuth } from '../../services/useAuth';

const MessageInput = ({ activeChat, viewMode, onMessageSend }) => {
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`[MessageInput] Submitting message: '${message}' from ${currentUser} to ${activeChat} in ${viewMode} mode`);
    
    if (!currentUser || !activeChat) {
      console.error('[MessageInput] No active user or chat selected');
      return;
    }

    const url = viewMode === 'groups'
      ? `${process.env.REACT_APP_API_URL}/groups/${activeChat}/messages`
      : `${process.env.REACT_APP_API_URL}/${currentUser}/messages`;
    console.log(`[MessageInput] Sending message to URL: ${url}`);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: currentUser,
        receiverId: viewMode !== 'groups' ? activeChat : undefined,
        text: message,
        groupId: viewMode === 'groups' ? activeChat : undefined,
      }),
    })
    .then(response => {
      console.log(`[MessageInput] Response status: ${response.status}`);
      if (!response.ok) throw new Error(`Failed to send message: ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      console.log('[MessageInput] Message sent:', data);
      onMessageSend(data);
      setMessage(''); // Clear the message input field after sending
    })
    .catch(error => console.error('[MessageInput] Error sending message:', error));
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
