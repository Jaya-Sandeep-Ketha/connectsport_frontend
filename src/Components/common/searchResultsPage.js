// SearchResultsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ProfileModal from "../features/profileModel";
import Navbar from "../../Components/layout/navbar";
import { useAuth } from "../../services/useAuth";
import "../../Styles/HomePage/search.css";
import SearchComponent from "../../Components/common/searchComponent";

const SearchResultsPage = () => {
  const { search } = useLocation();
  const [results, setResults] = useState({ users: [], pages: [], posts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      console.log("Fetching search results");
      setIsLoading(true);
      try {
        console.log(`Request URL: /search${search}`);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/search${search}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Search results received:", data);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [search]);

  if (isLoading) {
    return <div>Loading search results...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  // Function to handle the profile click, which opens the modal
  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null); // Clear the selected user
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
    <div className="search-results-page">
      <h2>Search Results</h2>
      <section>
        <h3>Users</h3>
        {results.users.length > 0 ? (
          <ul>
            {results.users.map((user) => (
              <li key={user._id}>
                <a
                  href="#!"
                  className="user-link"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default anchor link behavior
                    handleProfileClick(user);
                  }}
                >
                  {user.firstName} {user.lastName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">No user results found.</p>
        )}
      </section>
      <section>
        <h3>Pages</h3>
        {results.pages.length > 0 ? (
          <ul className="results-list">
            {results.pages.map((page) => (
              <li key={page._id} className="result-item">
                <Link to={`/pages/${page._id}`}>{page.title}</Link>{" "}
                {/* Adjust URL as needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">No page results found.</p>
        )}
      </section>
      <section>
        <h3>Posts</h3>
        {results.posts.length > 0 ? (
          <div>
            {results.posts.map((post) => (
              <div key={post._id} className="post-item mb-3">
                <p className="user-id">User ID: {post.userId}</p>
                <p>{post.content}</p>
                {post.image && post.image.url && (
                  <img src={post.image.url} alt="Post" className="img-fluid" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No post results found.</p>
        )}
      </section>
      {showProfileModal && selectedUser && (
        <ProfileModal userId={selectedUser._id} onClose={handleCloseModal} />
      )}
    </div>
    </div>
  );
};

export default SearchResultsPage;
