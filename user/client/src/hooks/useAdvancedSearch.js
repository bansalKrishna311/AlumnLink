import { useState, useEffect, useCallback, useMemo } from 'react';

// Utility function to normalize strings for searching
const normalizeString = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase().trim();
};

// Utility function to highlight search terms
export const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const normalizedText = text.toString();
  const normalizedTerm = searchTerm.toLowerCase();
  const regex = new RegExp(`(${normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  
  return normalizedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};

// Advanced search hook with multiple search strategies
export const useAdvancedSearch = (data, searchFields, options = {}) => {
  const {
    debounceDelay = 300,
    caseSensitive = false,
    exactMatch = false,
    fuzzySearch = true,
    minSearchLength = 1,
    sortResults = true
  } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceDelay]);

  // Fuzzy search algorithm (simple Levenshtein distance)
  const calculateSimilarity = useCallback((str1, str2) => {
    if (!str1 || !str2) return 0;
    
    const s1 = normalizeString(str1);
    const s2 = normalizeString(str2);
    
    if (s1 === s2) return 1;
    
    const len1 = s1.length;
    const len2 = s2.length;
    
    if (len1 === 0) return len2;
    if (len2 === 0) return len1;
    
    let matrix = [];
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    const maxLen = Math.max(len1, len2);
    const distance = matrix[len2][len1];
    return (maxLen - distance) / maxLen;
  }, []);

  // Get nested property value
  const getNestedValue = useCallback((obj, path) => {
    if (!path) return '';
    
    return path.split('.').reduce((value, key) => {
      return value && typeof value === 'object' ? value[key] : '';
    }, obj) || '';
  }, []);

  // Filter and sort results
  const filteredData = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < minSearchLength) {
      return data;
    }

    const query = caseSensitive ? debouncedQuery : normalizeString(debouncedQuery);
    const searchTerms = query.split(/\s+/).filter(term => term.length > 0);

    const results = data.map(item => {
      let totalScore = 0;
      let matchCount = 0;
      let hasExactMatch = false;

      searchFields.forEach(field => {
        const fieldValue = getNestedValue(item, field);
        const normalizedValue = caseSensitive ? fieldValue : normalizeString(fieldValue);

        searchTerms.forEach(term => {
          if (exactMatch) {
            if (normalizedValue === term) {
              totalScore += 100;
              matchCount++;
              hasExactMatch = true;
            }
          } else {
            // Exact substring match (highest priority)
            if (normalizedValue.includes(term)) {
              const position = normalizedValue.indexOf(term);
              const positionScore = position === 0 ? 50 : 30; // Higher score for matches at start
              totalScore += positionScore;
              matchCount++;
              
              if (normalizedValue === term) {
                hasExactMatch = true;
              }
            }
            // Fuzzy match (lower priority)
            else if (fuzzySearch) {
              const similarity = calculateSimilarity(normalizedValue, term);
              if (similarity > 0.6) { // Threshold for fuzzy matching
                totalScore += similarity * 20;
                matchCount++;
              }
            }
          }
        });
      });

      // Calculate final score
      const averageScore = matchCount > 0 ? totalScore / matchCount : 0;
      const termMatchRatio = matchCount / (searchTerms.length * searchFields.length);
      
      return {
        ...item,
        _searchScore: averageScore * termMatchRatio,
        _hasExactMatch: hasExactMatch,
        _matchCount: matchCount
      };
    });

    // Filter items with a minimum score
    let filtered = results.filter(item => item._searchScore > 0);

    // Sort results if enabled
    if (sortResults) {
      filtered.sort((a, b) => {
        // Prioritize exact matches
        if (a._hasExactMatch && !b._hasExactMatch) return -1;
        if (!a._hasExactMatch && b._hasExactMatch) return 1;
        
        // Then sort by score
        if (b._searchScore !== a._searchScore) {
          return b._searchScore - a._searchScore;
        }
        
        // Finally sort by match count
        return b._matchCount - a._matchCount;
      });
    }

    // Clean up search metadata
    return filtered.map(({ _searchScore, _hasExactMatch, _matchCount, ...item }) => item);
  }, [
    data,
    debouncedQuery,
    searchFields,
    caseSensitive,
    exactMatch,
    fuzzySearch,
    minSearchLength,
    sortResults,
    calculateSimilarity,
    getNestedValue
  ]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    filteredData,
    isSearching,
    resultCount: filteredData.length,
    hasResults: filteredData.length > 0,
    clearSearch: () => setSearchQuery('')
  };
};

// Hook for search history
export const useSearchHistory = (maxItems = 10) => {
  const [searchHistory, setSearchHistory] = useState([]);

  const addToHistory = useCallback((query) => {
    if (!query.trim()) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      const newHistory = [query, ...filtered].slice(0, maxItems);
      return newHistory;
    });
  }, [maxItems]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const removeFromHistory = useCallback((query) => {
    setSearchHistory(prev => prev.filter(item => item !== query));
  }, []);

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
};

export default useAdvancedSearch;
