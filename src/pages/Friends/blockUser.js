import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/useAuth";
import "../../Styles/Friends/blockUser.css";

const BlockUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { currentUser } = useAuth();
  const [refetchTrigger, setRefetchTrigger] = useState(false); // Refetch trigger

  // Fetch search results whenever searchTerm changes or a user is blocked
  useEffect(() => {
    if (searchTerm) {
      fetch(`${process.env.REACT_APP_API_URL}/search?searchTerm=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const resultsWithFullName = data.map((user) => ({
              ...user,
              fullName: `${user.firstName} ${user.lastName}`,
            }));
            setSearchResults(resultsWithFullName);
          } else {
            console.error("Expected an array for search results, received:", data);
            setSearchResults([]);
          }
        })
        .catch((error) => console.error("Error searching users:", error));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, refetchTrigger]); // Include refetchTrigger as a dependency

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleBlock = (targetUserId) => {
    fetch(`${process.env.REACT_APP_API_URL}/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: currentUser, targetUserId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setRefetchTrigger(!refetchTrigger); // Toggle to trigger a refetch
      })
      .catch((error) => console.error("Error blocking user:", error));
  };

  return (
    <div className="block-user-container">
      <input
        className="search-input"
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search users to block"
      />
      <div className="results-container">
        {searchResults.map((user) => (
          <div key={user.userId} className="result-item">
            {user.fullName}
            <button
              className="block-button"
              onClick={() => handleBlock(user.userId)}
            >
              Block
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockUser;
