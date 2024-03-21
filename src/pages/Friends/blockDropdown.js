import React from 'react';

const BlockDropdown = () => {
    const friends = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        // Add more friends as needed
    ];

    return (
        <div className="mt-3 custom-container dropdown">
            <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="blockDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Block a friend
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="blockDropdown">
                {friends.map(friend => (
                    <li key={friend.id}><button className="dropdown-item" type="button">{friend.name}</button></li>
                ))}
            </ul>
        </div>
    );
};

export default BlockDropdown;
