// GroupManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupManagement = ({ groupId, onClose }) => {
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Fetch group members
  useEffect(() => {
    axios.get(`/api/groups/${groupId}/members`)
      .then(response => setMembers(response.data))
      .catch(error => console.error('Fetch members failed:', error));

    // Assuming you have an endpoint to fetch all users
    axios.get(`/api/users`)
      .then(response => setAllUsers(response.data))
      .catch(error => console.error('Fetch users failed:', error));
  }, [groupId]);

  const handleAddMember = () => {
    axios.post(`/api/groups/${groupId}/addMember`, { userId: selectedUserId })
      .then(() => {
        // Refresh members list
        axios.get(`/api/groups/${groupId}/members`)
          .then(response => setMembers(response.data))
          .catch(error => console.error('Fetch members failed:', error));
      })
      .catch(error => console.error('Add member failed:', error));
  };

  const handleRemoveMember = (userId) => {
    axios.post(`/api/groups/${groupId}/removeMember`, { userId })
      .then(() => {
        // Refresh members list
        axios.get(`/api/groups/${groupId}/members`)
          .then(response => setMembers(response.data))
          .catch(error => console.error('Fetch members failed:', error));
      })
      .catch(error => console.error('Remove member failed:', error));
  };

  return (
    <div className="group-management">
      <button onClick={onClose}>X</button>
      <h2>Manage Group Members</h2>
      <select onChange={e => setSelectedUserId(e.target.value)} value={selectedUserId}>
        <option value="">Select User</option>
        {allUsers.filter(user => !members.some(member => member.id === user.id)).map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
      <button onClick={handleAddMember}>Add Member</button>
      <ul>
        {members.map(member => (
          <li key={member.id}>{member.name} <button onClick={() => handleRemoveMember(member.id)}>Remove</button></li>
        ))}
      </ul>
    </div>
  );
};

export default GroupManagement;
