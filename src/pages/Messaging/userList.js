import React from 'react';

const UserList = ({ users, onUserSelect }) => (
  <div className="user-list">
    {users.map((user) => (
      <div key={user.userId} onClick={() => onUserSelect(user)} className="user-item">
        <p><strong>{user.name}</strong></p>
        {/* Safely accessing the last message, if there are any messages */}
        <p>{user.messages && user.messages.length > 0 ? user.messages[user.messages.length - 1] : 'No messages'}</p>
      </div>
    ))}
  </div>
);

export default UserList;
