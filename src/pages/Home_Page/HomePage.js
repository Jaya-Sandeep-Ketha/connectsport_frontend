import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/common/navbar"; // Ensure correct import path
import PostList from "./postList"; // Ensure correct import path
import PostForm from "./postForm"; // Ensure correct import path
import SearchComponent from "../../Components/common/searchComponent";

function HomePage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(""); // Add this line
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("userName"))?.name
  );
  const isLoggedIn = !!localStorage.getItem("token");
  const [posts, setPosts] = useState([]);
  const [showPollForm, setShowPollForm] = useState(false);

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust according to your auth method
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data); // Assuming the backend returns an array of posts
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setCurrentUser(null);
    navigate("/login");
  };

  const addNewPost = async (content, imageFile, tag) => {
    console.log("Received for posting:", { content, imageFile, tag });
    const formData = new FormData();
    //    formData.append("content", content);
    formData.append("content", content.toString()); // Convert to string to ensure no object is passed
    formData.append("tag", tag); // 'tag' should already be a string based on your form
    formData.append("author", currentUser || "Anonymous"); // Ensure this is correctly set based on your state
    if (imageFile) {
      formData.append("image", imageFile); // Only add if image is selected
    }

    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure this is correct
          // Do not set 'Content-Type' here, let the browser set it
        },
        body: formData,
      });
      if (response.ok) {
        const newPost = await response.json();
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Add this function inside your HomePage component
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust according to your auth method
        },
      });
      if (response.ok) {
        // Filter out the post from the current state
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const addNewPoll = (poll) => {
    // Here, you should ideally send the poll to your backend
    // For simplicity, I'm just adding it directly to the 'posts' state
    const newPoll = {
      id: posts.length, // Note: Ensure you generate unique IDs based on your backend logic
      type: "poll",
      content: poll.question,
      options: poll.options.map((option) => ({ option, votes: 0 })),
    };
    setPosts((prevPosts) => [...prevPosts, newPoll]);
    setShowPollForm(false);
  };

  // This function should stay in HomePage if you're managing polls here
  const handleVote = (pollId, selectedOption) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === pollId && post.type === "poll"
          ? {
              ...post,
              options: post.options.map((option) =>
                option.option === selectedOption
                  ? { ...option, votes: option.votes + 1 }
                  : option
              ),
            }
          : post
      )
    );
  };

  return (
    <div className="container-fluid">
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput} // Pass setSearchInput as a prop
      />
      {searchInput && <SearchComponent />}
      <div className="row">
        <div className="col-md-3">{/* Left sidebar content */}</div>
        <div className="col-md-6">
          <PostForm onPostSubmit={addNewPost} onPollSubmit={addNewPoll} />
          <PostList
            posts={posts}
            currentUser={currentUser}
            onDeletePost={deletePost}
            onVote={handleVote}
          />
        </div>
        <div className="col-md-3">{/* Right sidebar content */}</div>
      </div>
    </div>
  );
}

export default HomePage;
