import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/useAuth'; // Assuming this provides currentUser
import Navbar from '../../Components/layout/navbar';
import SearchBar from './searchBar';
import UserList from './userList';
import ChatArea from './chatArea';
import '../../Styles/Messaging/chatList.css';

const ParentComponent = () => {
    const [friends, setFriends] = useState([]); // State now expects an array of friend objects, not just names
    const [activeUser, setActiveUser] = useState(null); // State for the active user in the chat
    const [searchInput, setSearchInput] = useState('');
    const { currentUser } = useAuth(); // Destructured only necessary auth details

    useEffect(() => {
        if (currentUser) {
            fetch(`${process.env.REACT_APP_API_URL}/friends/${currentUser}`)
                .then(response => response.json())
                .then(friendsData => {
                    // Assuming friendsData is structured as [{userId, name, lastMessage: {text, read}}]
                    setFriends(friendsData.map(friend => ({
                        ...friend,
                        userId: friend.userId,
                        name: friend.name, // Ensure this matches your data structure
                        lastMessage: friend.lastMessage ? friend.lastMessage.text : 'No messages',
                        readStatus: friend.lastMessage ? (friend.lastMessage.read ? 'Read' : 'Delivered') : ''
                    })));
                    if (friendsData.length > 0) {
                        setActiveUser(friendsData[0]); // Adjusted to pass the first friend object
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }, [currentUser]);
    const filteredFriends = friends.filter(friend =>
      friend.userId && friend.userId.toLowerCase().includes(searchInput.toLowerCase())
  );
  

  return (
    <div className="container-fluid">
        <Navbar />
        <div className="app-container">
            <div className="sidebar">
                <SearchBar onSearchChange={setSearchInput} />
                <UserList users={filteredFriends} onUserSelect={setActiveUser} /> {/* Pass the entire user object */}
            </div>
            {activeUser && <ChatArea activeChat={activeUser.userId} />} {/* Ensure we pass userId to ChatArea */}
        </div>
    </div>
);
};

export default ParentComponent;
