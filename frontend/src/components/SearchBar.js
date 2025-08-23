import React, { useState } from 'react';

const SearchBar = ({ searchTerm, onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-section">
      <h2>🔍 Search in Documents</h2>
      <div className="search-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter word to search (e.g., 'change')"
          className="search-input"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !inputValue.trim()}
          className="search-btn"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
