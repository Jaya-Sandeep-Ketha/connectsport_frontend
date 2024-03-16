import React, { useState } from 'react';
import { useAuth } from '../../services/useAuth'; // Correct path for your useAuth hook

const MessageInput = ({ activeChat }) => {
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth(); // Assuming useAuth correctly provides currentUser

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting message:', message); // Log the message being sent

    if (!currentUser || !activeChat) {
      console.error('No active user or chat selected');
      return; // Exit if either is missing
    }

    console.log(`Sending message from ${currentUser} to ${activeChat}`); // Log sender and receiver IDs
    fetch(`${process.env.REACT_APP_API_URL}/${currentUser}/messages`, { // URL updated to use currentUser
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: currentUser, // Sender ID from currentUser obtained through useAuth
        receiverId: activeChat, // Receiver ID from activeChat, removed erroneous period
        text: message, // Text of the message
      }),
    })
    .then(response => {
      console.log('Response status:', response.status); // Log response status
      return response.json();
    })
    .then(data => {
      console.log('Message sent:', data); // Log the response data
      setMessage(''); // Clear the message input field after sending
    })
    .catch(error => console.error('Error sending message:', error)); // Log any errors
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
