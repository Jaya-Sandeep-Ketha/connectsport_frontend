import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/useAuth";
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
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetch(`${process.env.REACT_APP_API_URL}/friends/${currentUser}`)
        .then((response) => response.json())
        .then((friendsData) => {
          setFriends(
            friendsData.map((friend) => ({
              ...friend,
              userId: friend.userId,
              name: friend.name,
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
          if (friendsData.length > 0 && viewMode === "people") {
            setActiveUser({ id: friendsData[0].userId, type: "people" });
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [currentUser, viewMode]); // Added viewMode as a dependency

  const handleShowPeople = () => {
    setViewMode("people");
    setShowCreateGroupForm(false);
    if (friends.length > 0) {
      setActiveUser({ id: friends[0].userId, type: "people" }); // Set activeUser for people view
    } else {
      setActiveUser(null);
    }
  };

  const handleShowGroups = () => {
    setViewMode("groups");
    setShowCreateGroupForm(false);
    if (groups.length > 0) {
      setActiveUser({ id: groups[0].name, type: "groups" }); // Set activeUser for groups view
    } else {
      setActiveUser(null);
    }
  };

  const handleCreateGroup = () => {
    setShowCreateGroupForm(true);
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

  console.log("Rendering ChatArea with activeUser:", activeUser);
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
            <UserList
              users={filteredFriends}
              onUserSelect={(user) =>
                setActiveUser({ id: user.userId, type: "people" })
              }
            />
          )}
          {viewMode === "groups" && (
            <>
              <GroupList
                groups={filteredGroups}
                onGroupSelect={(group) => {
                  console.log("Selected group:", group);
                  setActiveUser({ id: group.id, type: "groups" });
                }}
              />

              <button className="create-group-btn" onClick={handleCreateGroup}>
                + New Group
              </button>
              {showCreateGroupForm && (
                <CreateGroupForm
                  userId={currentUser}
                  friends={filteredFriends}
                  onClose={handleCloseForm}
                  onCreate={(newGroup) => {
                    setGroups([...groups, newGroup]);
                    setShowCreateGroupForm(false);
                  }}
                />
              )}
            </>
          )}
        </div>
        {activeUser && (
          <ChatArea activeChat={activeUser.id} viewMode={activeUser.type} />
        )}{" "}
        {/* Adjusted to pass correct activeChat and viewMode */}
      </div>
    </div>
  );
};

export default ParentComponent;
