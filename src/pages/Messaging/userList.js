import React from 'react';

const UserList = ({ users, onUserSelect }) => (
  <div className="user-list">
    {users.map((user) => (
      <div key={user.id} onClick={() => onUserSelect(user)} className="user-item">
        <p><strong>{user.name}</strong></p>
        <p>{user.messages[user.messages.length - 1]}</p>
      </div>
    ))}
  </div>
);

export default UserList;
