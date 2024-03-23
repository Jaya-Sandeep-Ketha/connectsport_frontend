import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../services/useAuth"; // Correct path as necessary

const PeopleList = () => {
  const [people, setPeople] = useState([]);
  const { currentUser } = useAuth(); // Ensuring useAuth provides currentUser
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    if (currentUser) {
      console.log("Fetching people for user:", currentUser);
      const url = new URL(`${process.env.REACT_APP_API_URL}/people`);
      url.searchParams.append("userId", currentUser); // Add userId to query params

      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          // Include any other headers if needed
        },
      })
        .then((response) => {
          console.log("Response received:", response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data fetched successfully:", data);
          if (data.length > 0) {
            console.log("Example person:", data[0]);
          }
          setPeople(data);
        })
        .catch((error) => console.error("Fetching people failed", error));
    }
  }, [currentUser, refetchTrigger]);

  const sendFriendRequest = (targetUserId) => {
    fetch(`${process.env.REACT_APP_API_URL}/send-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include any other headers if needed
      },
      body: JSON.stringify({ userId: currentUser, targetUserId: targetUserId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // setRefetchTrigger(!refetchTrigger);
        // Refresh the people list or modify it directly to reflect changes
        setPeople(
          people.map((person) =>
            person.userId === targetUserId
              ? { ...person, requestSent: true }
              : person
          )
        );
      })
      .catch((error) => console.error("Error sending friend request:", error));
  };

  const cancelFriendRequest = (targetUserId) => {
    fetch(`${process.env.REACT_APP_API_URL}/cancel-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include any other headers if needed
      },
      body: JSON.stringify({ userId: currentUser, targetUserId: targetUserId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // setRefetchTrigger(!refetchTrigger);
        // Refresh the people list or modify it directly to reflect changes
        setPeople(
          people.map((person) =>
            person.userId === targetUserId
              ? { ...person, requestSent: false }
              : person
          )
        );
      })
      .catch((error) =>
        console.error("Error canceling friend request:", error)
      );
  };

  return (
    <div className="col-md-5 mb-5">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">People You May Know</h3>
          <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
            {people.map((person) => (
              <div key={person.userId} className="list-group mb-2">
                <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <span>{person.name}</span>
                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                      {person.mutualFriends
                        ? `${person.mutualFriends} mutual friend${
                            person.mutualFriends > 1 ? "s" : ""
                          }`
                        : "No mutual friends"}
                    </div>
                  </div>
                  {!person.requestSent ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => sendFriendRequest(person.userId)}
                    >
                      Send Request
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => cancelFriendRequest(person.userId)}
                    >
                      Sent
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleList;
