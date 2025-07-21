import React from 'react';

const HighlightedText = ({ 
  text, 
  searchTerm, 
  className = "",
  highlightClassName = "bg-yellow-200 px-1 rounded font-medium"
}) => {
  if (!searchTerm || !text || searchTerm.trim() === '') {
    return <span className={className}>{text}</span>;
  }

  const normalizedText = text.toString();
  const normalizedTerm = searchTerm.trim();
  
  // Split search term by spaces to handle multi-word searches
  const searchTerms = normalizedTerm.split(/\s+/).filter(term => term.length > 0);
  
  if (searchTerms.length === 0) {
    return <span className={className}>{text}</span>;
  }
  
  // Create a regex pattern that matches any of the search terms
  const pattern = searchTerms.map(term => 
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  ).join('|');
  
  const regex = new RegExp(`(${pattern})`, 'gi');
  
  // Split the text into parts
  const parts = normalizedText.split(regex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part matches any of the search terms
        const isHighlight = searchTerms.some(term => 
          part.toLowerCase() === term.toLowerCase()
        );
        
        return isHighlight ? (
          <mark key={index} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
};

export default HighlightedText;
