import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/useAuth'; // Assuming this provides currentUser
import Navbar from '../../Components/layout/navbar';
import SearchBar from './searchBar';
import UserList from './userList';
import ChatArea from './chatArea';
import '../../Styles/Messaging/chatList.css';

const ParentComponent = () => {
    const [friends, setFriends] = useState([]); // State for user's friends, expecting an array of names
    const [activeUser, setActiveUser] = useState(null); // State for the active user in the chat
    const [searchInput, setSearchInput] = useState('');
    const { isLoggedIn, currentUser, handleLogout } = useAuth();
    const filteredFriends = friends.filter(friendName =>
        friendName.toLowerCase().includes(searchInput.toLowerCase())
    );

    useEffect(() => {
        // Fetch the friend list for the current user
        if (currentUser) {
            fetch(`${process.env.REACT_APP_API_URL}/friends/${currentUser}`) // Correct the URL
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(friendNames => { // Assuming the backend returns an array of friend names directly
                    setFriends(friendNames); // Update the friends state with fetched data
                    if (friendNames.length > 0) {
                        setActiveUser(friendNames[0]); // Optionally set the first friend as the active chat
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }, [currentUser]); // Dependency array now includes currentUser to refetch when it changes

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="app-container">
                <div className="sidebar">
                    <SearchBar onSearchChange={setSearchInput} />
                    {/* Pass the filtered friends list */}
                    <UserList users={filteredFriends.map(friendName => ({ name: friendName }))}
                              onUserSelect={user => setActiveUser(user.name)} />
                </div>
                <ChatArea activeChat={activeUser} />
            </div>
        </div>
    );
};

export default ParentComponent;
