import React from 'react';

const SearchResults = ({ results, searchTerm, isLoading, uploadedFiles }) => {
  // Helper function to safely trim and validate strings
  const safeString = (value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return String(value || '').trim();
  };

  // Highlight search term
  const highlightText = (text, term) => {
    const safeText = safeString(text);
    if (!term || !safeText) return safeText;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = safeText.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (isLoading && searchTerm) {
    return (
      <div className="results-section">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Searching in {uploadedFiles.length} documents...</p>
        </div>
      </div>
    );
  }

  if (!searchTerm) {
    return null;
  }

  if (!results || results.length === 0) {
    return (
      <div className="results-section">
        <div className="no-results">
          <h3>No Results Found</h3>
          <p>The word "{searchTerm}" was not found in any uploaded documents.</p>
        </div>
      </div>
    );
  }

  // Calculate total occurrences
  const totalOccurrences = results.reduce((sum, result) => {
    return sum + (result.totalOccurrences || 0);
  }, 0);

  return (
    <div className="results-section">
      {/* Results Header */}
      <div className="results-header">
        <h2>🔍 Search Results for "{searchTerm}"</h2>
        <div className="search-summary">
          <p>Found <strong>{totalOccurrences} occurrences</strong> in <strong>{results.length} files</strong></p>
        </div>
      </div>

      {/* Side-by-Side Column Layout ONLY */}
      <div className="results-columns">
        <div className="columns-grid">
          {results.map((result, index) => (
            <div key={result.fileId || index} className="result-column">
              <div className="column-header">
                <div className="file-info">
                  <span className="file-icon">
                    {safeString(result.fileName).endsWith('.pdf') ? '📄' : '📝'}
                  </span>
                  <div>
                    <h4>{safeString(result.fileName)}</h4>
                    <span className="match-count">
                      {result.totalOccurrences || 0} matches found
                    </span>
                  </div>
                </div>
              </div>

              <div className="sentences-list">
                {result.sentences && result.sentences.length > 0 ? 
                  result.sentences.map((sentence, sentenceIndex) => (
                    <div key={sentence.id || sentenceIndex} className="sentence-item">
                      <div className="sentence-number">{sentenceIndex + 1}</div>
                      <div className="sentence-content">
                        {highlightText(sentence.text, searchTerm)}
                      </div>
                    </div>
                  )) :
                  <div className="sentence-item">
                    <div className="sentence-content">No matching sentences found.</div>
                  </div>
                }
              </div>

              {/* File Summary at Bottom */}
              <div className="column-footer">
                <p>Total: <strong>{result.totalOccurrences || 0}</strong> occurrences of "{searchTerm}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
