import React from 'react';

const SearchBar = ({ onSearchChange }) => (
  <div className="search-bar">
    <input 
      type="text" 
      placeholder="Search friends..."
      onChange={(e) => onSearchChange(e.target.value)} // Propagate the change up to the parent component
    />
    <div>
      <button>People</button>
      <button>Groups</button>
    </div>
  </div>
);

export default SearchBar;
