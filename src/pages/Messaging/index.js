import React, { useState } from 'react';
import Navbar from '../../Components/layout/navbar';
import SearchBar from './searchBar';
import UserList from './userList';
import ChatArea from './chatArea';
import '../../Styles/Messaging/chatList.css';

// Sample data for demonstration
const users = [
  { id: 1, name: 'User Name 1', messages: ['Message 1', 'Message 2'] },
  { id: 2, name: 'User Name 2', messages: ['Message 3', 'Message 4'] },
];

function App() {
  const [activeUser, setActiveUser] = useState(users[0]); // Default to the first user for demo
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="container-fluid">
      <Navbar onSearchChange={setSearchInput} />
      <div className="app-container">
        <div className="sidebar">
          <SearchBar onSearchChange={setSearchInput} />
          <UserList users={users} onUserSelect={setActiveUser} />
        </div>
        <ChatArea activeChat={activeUser} />
      </div>
    </div>
  );
}

export default App;
