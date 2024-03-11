import React from 'react';

const SearchBar = () => (
  <div className="search-bar">
    <input type="text" placeholder="Search..." />
    <div>
      <button>People</button>
      <button>Groups</button>
    </div>
  </div>
);

export default SearchBar;
