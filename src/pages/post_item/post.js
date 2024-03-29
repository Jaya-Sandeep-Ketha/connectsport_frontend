import React, { useState } from 'react';
import SocialButtons from '../../Components/common/socialButtons';
import { useAuth } from "../../services/useAuth"; // Ensure the path is correct

function Post({ _id, author, content, image, deletePost, likesCount, updatePostLikes }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState('');
  const { isLoggedIn, currentUser } = useAuth(); // Now using currentUser from useAuth

  // Handles the increment or decrement of likes
  const handleLike = async () => {
    console.log(`Like is clicked for ${_id}`);
    try {
      const response = await fetch(`http://localhost:3000/${currentUser}/posts/${_id}/like`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update like status');
      }
      const updatedPost = await response.json();
      updatePostLikes(updatedPost); // This function should handle updating the likes count in the parent component's state
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      text: commentText,
      commenter: currentUser ? currentUser.name : 'Anonymous', // Assuming currentUser has a name property
    };
  
    console.log(`Adding comment for post ${_id}`);
  
    try {
      const response = await fetch(`http://localhost:3000/${currentUser}/posts/${_id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      const updatedPost = await response.json();
      // Assuming the backend returns the updated post data including the new comment,
      setComments(updatedPost.comments); // Assuming updatedPost.comments contains the updated list of comments
      setCommentText('');
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };
  

  return (
    <div style={postStyle}>
      <div className="post-header">
        <h4>{author}</h4>
        <button onClick={() => setShowOptions(!showOptions)} style={optionButtonStyle}>...</button>
        {showOptions && (
          <div className="post-options" style={optionsStyle}>
            <button onClick={() => deletePost(_id)} style={deleteButtonStyle}>Delete</button>
          </div>
        )}
      </div>
      {image && image.url && (
        <img src={image.url} alt="Post" style={imageStyle} />
      )}
      <p>{content}</p>
      <SocialButtons 
        onLike={handleLike} 
        likesCount={likesCount}
        onCommentToggle={() => setShowComments(!showComments)} 
        commentsCount={comments.length}
      />
      {showComments && (
        <div>
          {comments.map((comment, index) => (
            <p key={index}><strong>{comment.commenter}:</strong> {comment.text}</p>
          ))}
          <form onSubmit={handleCommentSubmit} style={formStyle}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Comment</button>
          </form>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}


const postStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: '#f9f9f9', // Light background for the post
};

const imageStyle = {
  maxWidth: '100%',
  height: 'auto',
  marginTop: '10px',
};

const formStyle = {
  display: 'flex',
  marginTop: '10px',
};

const inputStyle = {
  flexGrow: 1, // Make input take up the available space
  marginRight: '8px', // Spacing between input and button
  padding: '8px',
  border: '1px solid #ddd', // Lighter border for the input
  borderRadius: '20px', // Rounded corners for the input
};

const buttonStyle = {
  padding: '8px 16px',
  background: '#007bff', // Bootstrap primary button color
  color: 'white',
  border: 'none',
  borderRadius: '20px', // Rounded corners for the button
  cursor: 'pointer',
};

const optionButtonStyle = {
  // Style for your option button
  cursor: 'pointer',
  float: 'right', // Position the button to the right
  border: 'none',
  background: 'none',
};

const optionsStyle = {
  // Style for the options dropdown
  position: 'absolute',
  right: '10px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '5px',
};

const deleteButtonStyle = {
  // Style for your delete button within the dropdown
  background: 'none',
  border: 'none',
  color: 'red',
  cursor: 'pointer',
};
export default Post;
