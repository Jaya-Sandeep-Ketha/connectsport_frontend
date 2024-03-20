import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/Messaging/manageGroup.css";

const GroupManagement = ({ groupId, onClose }) => {
  const [members, setMembers] = useState([]);
  const [nonMembers, setNonMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    fetchGroupMembers();
    // fetchNonMemberUsers();
  }, [groupId]);

  const fetchGroupMembers = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/groups/${groupId}/members`)
      .then((response) => {
        console.log("Fetched group members:", response.data); // Log fetched data
        setMembers(response.data);
        console.log("Members state after fetching:", response.data); // Log state after setting
      })
      .catch((error) => console.error("Fetch members failed:", error));
  };

  const fetchNonMemberUsers = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users`)
      .then((response) => setNonMembers(response.data))
      .catch((error) => console.error("Fetch users failed:", error));
  };

  const handleAddMember = () => {
    if (!selectedUserId) {
      setFeedbackMessage("Please select a user to add.");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/groups/${groupId}/addMember`, {
        userId: selectedUserId,
      })
      .then(() => {
        setFeedbackMessage(`User added successfully.`);
        fetchGroupMembers();
        fetchNonMemberUsers();
        setSelectedUserId("");
      })
      .catch((error) => {
        console.error("Add member failed:", error);
        setFeedbackMessage(`Failed to add user.`);
      });
  };

  const handleRemoveMember = (userId) => {
    console.log(groupId, userId);
    axios
      .post(`${process.env.REACT_APP_API_URL}/groups/${groupId}/removeMember`, {
        userId,
      })
      .then(() => {
        setFeedbackMessage(`User removed successfully.`);
        fetchGroupMembers();
      })
      .catch((error) => {
        console.error("Remove member failed:", error);
        setFeedbackMessage(`Failed to remove user.`);
      });
  };

  return (
    <div className="group-management">
      <button onClick={onClose}>X</button>
      <h2>Manage Group Members</h2>
      <div>{feedbackMessage}</div>
      <select
        onChange={(e) => setSelectedUserId(e.target.value)}
        value={selectedUserId}
      >
        <option value="">Select User</option>
        {nonMembers
          .filter((user) => !members.some((member) => member.id === user.id))
          .map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
      </select>
      <button onClick={handleAddMember}>Add Member</button>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        <ul>
          {members.map(
            (
              memberName,
              index // Use memberName directly, and add index for key if names can repeat
            ) => (
              <li key={index}>
                {" "}
                {/* If names are unique, you can use memberName as key instead */}
                {memberName} {/* Directly display the memberName */}
                <button onClick={() => handleRemoveMember(memberName)}>
                  Remove
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupManagement;
