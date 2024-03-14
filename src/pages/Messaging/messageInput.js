import React, { useState } from 'react';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending message: ", message); // Placeholder for send message logic
    setMessage('');
  };
  /*
    const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: activeUser.id, // The ID of the current user sending the message
        receiverId: activeChat.id, // The ID of the user receiving the message
        text: message, // The message text
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Message sent:', data);
      setMessage('');
      // Update the chat with the new message here
    })
    .catch(error => console.error('Error sending message:', error));
    };
  */

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
