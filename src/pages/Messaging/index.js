import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/useAuth"; // Assuming this provides currentUser
import Navbar from "../../Components/layout/navbar";
import SearchBar from "./searchBar";
import UserList from "./userList";
import GroupList from "./groupList";
import ChatArea from "./chatArea";
import CreateGroupForm from "./createGroupForm";
import "../../Styles/Messaging/chatList.css";

const ParentComponent = () => {
  const [viewMode, setViewMode] = useState("people");
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [friends, setFriends] = useState([]); // State now expects an array of friend objects, not just names
  const [groups, setGroups] = useState([]);
  const [activeUser, setActiveUser] = useState(null); // State for the active user in the chat
  const [searchInput, setSearchInput] = useState("");
  const { currentUser } = useAuth(); // Destructured only necessary auth details

  useEffect(() => {
    if (currentUser) {
      fetch(`${process.env.REACT_APP_API_URL}/friends/${currentUser}`)
        .then((response) => response.json())
        .then((friendsData) => {
          // Assuming friendsData is structured as [{userId, name, lastMessage: {text, read}}]
          setFriends(
            friendsData.map((friend) => ({
              ...friend,
              userId: friend.userId,
              name: friend.name, // Ensure this matches your data structure
              lastMessage: friend.lastMessage
                ? friend.lastMessage.text
                : "No messages",
              readStatus: friend.lastMessage
                ? friend.lastMessage.read
                  ? "Read"
                  : "Delivered"
                : "",
            }))
          );
          if (friendsData.length > 0) {
            setActiveUser(friendsData[0]); // Adjusted to pass the first friend object
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [currentUser]);

  const handleShowPeople = () => {
    setViewMode("people");
    setShowCreateGroupForm(false);
  };

  const handleShowGroups = () => {
    setViewMode("groups");
    setShowCreateGroupForm(false); // Hide group form when showing groups
  };

  const handleCreateGroup = () => {
    setShowCreateGroupForm(true); // Show the group creation form
  };

  const handleCloseForm = () => {
    setShowCreateGroupForm(false);
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.userId &&
      friend.userId.toLowerCase().includes(searchInput.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="app-container">
        <div className="sidebar">
          <SearchBar
            onSearchChange={setSearchInput}
            onShowPeople={handleShowPeople}
            onShowGroups={handleShowGroups}
          />
          {viewMode === "people" && (
            <UserList users={filteredFriends} onUserSelect={setActiveUser} />
          )}
          {viewMode === "groups" && (
            <>
              <GroupList
                groups={filteredGroups}
                onGroupSelect={setActiveUser}
              />
              <button className="create-group-btn" onClick={handleCreateGroup}>
                + New Group
              </button>
              {showCreateGroupForm && (
                <CreateGroupForm
                  friends={filteredFriends}
                  onClose={handleCloseForm} // This passes the handleCloseForm function to the CreateGroupForm
                  onCreate={(newGroup) => {
                    setGroups([...groups, newGroup]);
                    setShowCreateGroupForm(false); // Closes the form after a new group is successfully created
                  }}
                />
              )}
            </>
          )}
        </div>
        {activeUser && <ChatArea activeChat={activeUser.userId} />}{" "}
        {/* Ensure we pass userId to ChatArea */}
      </div>
    </div>
  );
};

export default ParentComponent;
