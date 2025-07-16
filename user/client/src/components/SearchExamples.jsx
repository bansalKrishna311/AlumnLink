import React from 'react';
import SearchBar from './SearchBar';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';

/**
 * Example usage of the SearchBar and useAdvancedSearch hook
 * This demonstrates the various features and configurations available
 */

const SearchExamples = () => {
  // Sample data for demonstration
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales' }
  ];

  // Basic search example
  const {
    searchQuery: basicQuery,
    setSearchQuery: setBasicQuery,
    filteredData: basicResults
  } = useAdvancedSearch(sampleData, ['name', 'email']);

  // Advanced search example with custom options
  const {
    searchQuery: advancedQuery,
    setSearchQuery: setAdvancedQuery,
    filteredData: advancedResults,
    isSearching,
    resultCount
  } = useAdvancedSearch(sampleData, ['name', 'email', 'department'], {
    debounceDelay: 500,
    fuzzySearch: true,
    minSearchLength: 2,
    sortResults: true
  });

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-800">Search Component Examples</h2>
      
      {/* Basic Search Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Basic Search</h3>
        <SearchBar
          placeholder="Search users..."
          onSearch={setBasicQuery}
          className="max-w-md"
        />
        <div className="text-sm text-gray-600">
          Results: {basicResults.length} items
        </div>
      </div>

      {/* Advanced Search Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Advanced Search with Features</h3>
        <SearchBar
          placeholder="Advanced search with fuzzy matching..."
          onSearch={setAdvancedQuery}
          className="max-w-md"
          size="lg"
          debounceDelay={500}
        />
        {isSearching && (
          <div className="text-sm text-blue-600">Searching...</div>
        )}
        <div className="text-sm text-gray-600">
          Found {resultCount} results
        </div>
      </div>

      {/* Different Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Different Sizes</h3>
        <div className="space-y-3">
          <SearchBar placeholder="Small search..." size="sm" className="max-w-xs" />
          <SearchBar placeholder="Medium search..." size="md" className="max-w-sm" />
          <SearchBar placeholder="Large search..." size="lg" className="max-w-md" />
        </div>
      </div>

      {/* Without Icon */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Without Search Icon</h3>
        <SearchBar
          placeholder="Search without icon..."
          icon={false}
          className="max-w-md"
        />
      </div>

      {/* Without Clear Button */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Without Clear Button</h3>
        <SearchBar
          placeholder="Search without clear button..."
          showClearButton={false}
          className="max-w-md"
        />
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Disabled State</h3>
        <SearchBar
          placeholder="Disabled search..."
          disabled={true}
          className="max-w-md"
        />
      </div>
    </div>
  );
};

export default SearchExamples;
