import React, { useState, useEffect } from "react";

const FilterSidebar = ({ setFilters }) => {
  const [sportsOptions, setSportsOptions] = useState([]);
  const [friendsOptions, setFriendsOptions] = useState([]);

  useEffect(() => {
    // Fetch sports options from the backend
    fetch(`${process.env.REACT_APP_API_URL}/sports-options`, {
      headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => setSportsOptions(data))
    .catch(error => console.error("Error fetching sports options:", error));

    // Fetch friends options from the backend
    fetch(`${process.env.REACT_APP_API_URL}/friends-options`, {
      headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => setFriendsOptions(data))
    .catch(error => console.error("Error fetching friends options:", error));
  }, []);

  return (
    <div className="col-md-3 mb-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Filter</h3>
          <select
            className="form-select mb-3"
            onChange={(e) => {
              console.log("Sport selected:", e.target.value); // Log selected sport
              setFilters(prev => ({ ...prev, sport: e.target.value }));
            }}
          >
            <option value="">Select Sport</option>
            {sportsOptions.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
          <select
            className="form-select"
            onChange={(e) => {
              console.log("Friend selected:", e.target.value); // Log selected friend
              setFilters(prev => ({ ...prev, friend: e.target.value }));
            }}
          >
            <option value="">Select Friend</option>
            {friendsOptions.map((friend) => (
              <option key={friend} value={friend}>{friend}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
