import React, { useState } from 'react';
import axios from 'axios';
import '../../Styles/Messaging/createGroupForm.css'; // Ensure this CSS file exists and is styled correctly

const CreateGroupForm = ({ friends, onClose, onCreate }) => { // Added onCreate prop here
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState('');

  const handleFriendToggle = friendId => {
    setSelectedFriends(prevSelected =>
      prevSelected.includes(friendId) ? prevSelected.filter(id => id !== friendId) : [...prevSelected, friendId]
    );
  };

  const handleSubmit = event => {
    event.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/groups`, {
      name: groupName,
      members: selectedFriends
    })
    .then(response => {
      // Use the onCreate prop to lift the state up
      onCreate(response.data); // This assumes onCreate is properly handled in the parent component
      console.log('Group created successfully:', response.data);
      setGroupName('');
      setSelectedFriends([]);
      onClose(); // Close the form
    })
    .catch(error => {
      console.error('Error creating group:', error);
    });
  };

  return (
    <div className="create-group-form-container">
      <form onSubmit={handleSubmit} className="create-group-form">
        <div className="form-header">
          <button type="button" onClick={onClose} className="close-btn">X</button>
          <h2>Create New Group</h2>
        </div>
        <label>
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            required
          />
        </label>
        <fieldset>
          <legend>Select Friends</legend>
          {friends.map(friend => (
            <label key={friend.userId}>
              <input
                type="checkbox"
                checked={selectedFriends.includes(friend.userId)}
                onChange={() => handleFriendToggle(friend.userId)}
              />
              {friend.name}
            </label>
          ))}
        </fieldset>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroupForm;
