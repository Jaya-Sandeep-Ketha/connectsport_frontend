import React, { useState, useEffect } from "react";
import SocialButtons from "../../Components/common/socialButtons";
import { useAuth } from "../../services/useAuth"; // Ensure the path is correct

function Post({
  _id,
  author,
  content,
  image,
  deletePost,
  likesCount,
  onCommentAdded,
  comments = [],
  updatePostLikes,
  shared,
}) {
  const [localComments, setLocalComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn, currentUser } = useAuth(); // Now using currentUser from useAuth

  // useEffect(() => {
  //   setLocalComments(comments);
  // }, [comments]);
  useEffect(() => {
    // Only update if there is a real change to avoid infinite loops
    if (JSON.stringify(localComments) !== JSON.stringify(comments)) {
      setLocalComments(comments || []);
    }
  }, [comments]); // Ensure comments is correctly passed as a prop

  // Handles the increment or decrement of likes
  const handleLike = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/${currentUser}/posts/${_id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update like status");
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
      content: commentText,
      commenter: currentUser ? currentUser : "Anonymous", // Assuming currentUser has a name property
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/${currentUser}/posts/${_id}/comment`,
        {
          method: "PUT", // Use 'POST' if your API expects it
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newComment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const updatedPost = await response.json();
      onCommentAdded(updatedPost);
      setCommentText(""); // Clear the input field
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  const sharePost = async () => {
    // Log the current user object to ensure it's correctly obtained
    console.log("Current user: ", currentUser);

    // Assuming `currentUser` has a `username` property you want to use in the URL
    const username = currentUser;
    console.log("Username for sharing: ", username); // This will confirm you're getting the right username

    const url = `${process.env.REACT_APP_API_URL}/${username}/posts/${_id}/share`;
    console.log("Constructed URL for sharing: ", url); // Check the constructed URL is as expected

    try {
      console.log("Attempting to share post with ID: ", _id); // Confirm the ID of the post being shared

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to share the post. Status: ${response.status}`);
      }

      console.log("Share response: ", await response.json()); // Log the response from the server
      alert("Post shared successfully!");
    } catch (error) {
      console.error("Error sharing the post: ", error.message);
      alert("Error sharing the post");
    }
  };

  return (
    <div style={postStyle}>
      {shared && shared.length > 0 && (
        <p style={{ marginBottom: "10px", color: "#555" }}>
          {shared[0].userId} shared this post.
        </p>
      )}
      <div className="post-header">
        <h4>{author}</h4>
        <p>{content}</p>
        {/* <button onClick={() => setShowOptions(!showOptions)} style={optionButtonStyle}>...</button>
        {showOptions && (
          <div style={optionsStyle}>
            <button onClick={() => deletePost(_id)} style={deleteButtonStyle}>Delete</button>
          </div>
        )} */}
      </div>
      {image && image.url && (
        <img src={image.url} alt="Post" style={imageStyle} />
      )}
      <SocialButtons
        onLike={handleLike}
        likesCount={likesCount}
        onCommentToggle={() => setShowComments(!showComments)}
        commentsCount={comments.length}
        onShare={() => sharePost(_id)}
      />
      {showComments && (
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: "10px",
            borderTop: "1px solid #ccc",
          }}
        >
          {comments.map((comment, index) => (
            <p key={index}>
              <strong>{comment.commenter}:</strong> {comment.content}
            </p>
          ))}
          <form onSubmit={handleCommentSubmit} style={formStyle}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Comment
            </button>
          </form>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const postStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "#f9f9f9", // Light background for the post
};

const imageStyle = {
  maxWidth: "100%",
  height: "auto",
  marginTop: "10px",
};

const formStyle = {
  display: "flex",
  marginTop: "10px",
};

const inputStyle = {
  flexGrow: 1, // Make input take up the available space
  marginRight: "8px", // Spacing between input and button
  padding: "8px",
  border: "1px solid #ddd", // Lighter border for the input
  borderRadius: "20px", // Rounded corners for the input
};

const buttonStyle = {
  padding: "8px 16px",
  background: "#007bff", // Bootstrap primary button color
  color: "white",
  border: "none",
  borderRadius: "20px", // Rounded corners for the button
  cursor: "pointer",
};

const optionButtonStyle = {
  // Style for your option button
  cursor: "pointer",
  float: "right", // Position the button to the right
  border: "none",
  background: "none",
};

const optionsStyle = {
  // Style for the options dropdown
  position: "absolute",
  right: "10px",
  backgroundColor: "#f9f9f9",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "5px",
};

const deleteButtonStyle = {
  // Style for your delete button within the dropdown
  background: "none",
  border: "none",
  color: "red",
  cursor: "pointer",
};

export default Post;
