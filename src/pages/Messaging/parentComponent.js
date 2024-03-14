import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/layout/navbar';
import SearchBar from './searchBar';
import UserList from './userList';
import ChatArea from './chatArea';
import '../../Styles/Messaging/chatList.css';

const ParentComponent = () => {
  const [users, setUsers] = useState([]); // State for users
  const [activeUser, setActiveUser] = useState(null); // State for the active user in the chat
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    // Fetch users from the API
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // Update the users state with fetched data
        if (data && data.length > 0) {
          setActiveUser(data[0]); // Set the first user as the active user
        }
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []); // Empty dependency array means this effect runs once on component mount

  return (
    <div className="container-fluid">
      <Navbar onSearchChange={setSearchInput} />
      <div className="app-container">
        <div className="sidebar">
          <SearchBar onSearchChange={setSearchInput} />
          {/* Pass the users state as a prop to UserList */}
          <UserList users={users} onUserSelect={setActiveUser} />
        </div>
        {/* Pass the activeUser state as a prop to ChatArea */}
        <ChatArea activeChat={activeUser} />
      </div>
    </div>
  );
};

export default ParentComponent;
