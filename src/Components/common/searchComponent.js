// SearchComponent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/HomePage/searchComponent.css';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const selectFilter = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearch = () => {
    console.log(`Navigating to search results with query: ${searchQuery} and filter: ${activeFilter}`);
    navigate(`/search-results?query=${encodeURIComponent(searchQuery)}&filter=${activeFilter}`);
  };  

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="filter-options">
        {['All', 'Posts', 'People', 'Pages'].map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => selectFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchComponent;
