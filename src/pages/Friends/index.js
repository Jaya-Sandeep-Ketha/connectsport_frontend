import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/Friends/friendspage.css';

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Fetch the list of friends and friend requests
        const fetchFriends = async () => {
            try {
                const res = await axios.get('/api/friends', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setFriends(res.data.friends);
                setRequests(res.data.requests);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching friends');
            }
        };

        fetchFriends();
    }, []);

    const handleAddFriend = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/friends/request', { email }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setEmail('');
            // Refresh the friends list or update the UI accordingly
        } catch (error) {
            setError(error.response?.data?.msg || 'Error sending friend request');
        }
    };

    const handleAcceptFriendRequest = async (requesterId) => {
        try {
            await axios.post('/api/friends/accept', { requesterId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh the friends list or update the UI accordingly
        } catch (error) {
            setError(error.response?.data?.msg || 'Error accepting friend request');
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await axios.delete(`/api/friends/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh the friends list or update the UI accordingly
        } catch (error) {
            setError(error.response?.data?.msg || 'Error removing friend');
        }
    };

    return (
        <div>
            <h1>My Friends</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleAddFriend}>
                <input 
                    type="text" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter friend's email" 
                />
                <button type="submit">Add Friend</button>
            </form>
            <div>
                <h2>Friend Requests</h2>
                <ul>
                    {requests.map(request => (
                        <li key={request._id}>
                            {request.firstName} {request.lastName}
                            <button onClick={() => handleAcceptFriendRequest(request._id)}>Accept</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Friends List</h2>
                <ul>
                    {friends.map(friend => (
                        <li key={friend._id}>
                            {friend.firstName} {friend.lastName}
                            <button onClick={() => handleRemoveFriend(friend._id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FriendsPage;
