import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../Styles/Messaging/manageGroup.css"

const GroupManagement = ({ groupId, onClose }) => {
  const [members, setMembers] = useState([]);
  const [nonMembers, setNonMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Fetch both group members and non-member users
  useEffect(() => {
    fetchGroupMembers();
    fetchNonMemberUsers();
  }, [groupId]); // Rerun when groupId changes

  const fetchGroupMembers = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/groups/${groupId}/members`)
      .then(response => {
        setMembers(response.data);
      })
      .catch(error => console.error('Fetch members failed:', error));
  };

  const fetchNonMemberUsers = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`)
      .then(response => {
        setNonMembers(response.data); // Assuming this fetches all users
      })
      .catch(error => console.error('Fetch users failed:', error));
  };

  const handleAddMember = () => {
    if (!selectedUserId) {
      setFeedbackMessage("Please select a user to add.");
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/groups/${groupId}/addMember`, { userId: selectedUserId })
      .then(() => {
        setFeedbackMessage(`User added successfully.`);
        fetchGroupMembers(); // Refresh the members list
        fetchNonMemberUsers(); // Refresh the non-members list
        setSelectedUserId(''); // Reset the selected user
      })
      .catch(error => {
        console.error('Add member failed:', error);
        setFeedbackMessage(`Failed to add user.`);
      });
  };

  const handleRemoveMember = (userId) => {
    console.log("Attempting to remove member", { groupId, userId });
    axios.post(`${process.env.REACT_APP_API_URL}/groups/${groupId}/removeMember`, { userId })  
      .then(() => {
        setFeedbackMessage(`User removed successfully.`);
        fetchGroupMembers(); // Refresh the members list
        fetchNonMemberUsers(); // Also refresh non-member users in case you want to re-add
      })
      .catch(error => {
        console.error('Remove member failed:', error);
        setFeedbackMessage(`Failed to remove user.`);
      });
  };

  return (
    <div className="group-management">
      <button onClick={onClose}>X</button>
      <h2>Manage Group Members</h2>
      <div>{feedbackMessage}</div>
      <select onChange={e => setSelectedUserId(e.target.value)} value={selectedUserId}>
        <option value="">Select User</option>
        {nonMembers.filter(user => !members.find(member => member.id === user.id)).map(user => (
          <option key={user.name} value={user.name}>{user.name}</option>
        ))}
      </select>
      <button onClick={handleAddMember}>Add Member</button>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
      <ul>
    {members.map(member => (
      <li key={member.id}>
        {member.name} {/* Make sure 'name' matches the field in your member objects */}
        <button onClick={() => handleRemoveMember(member.id)}>Remove</button>
      </li>
    ))}
  </ul>
      </div>
    </div>
  );
};

export default GroupManagement;
