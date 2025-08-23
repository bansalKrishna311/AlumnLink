import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Custom hook for memory-efficient handling of large datasets
 * Features:
 * - Pagination/chunking of large arrays
 * - Memory-conscious filtering
 * - Debounced operations
 * - Automatic cleanup
 */
export const useLargeDataset = (
  data = [],
  options = {}
) => {
  const {
    pageSize = 50,
    maxMemoryItems = 200, // Maximum items to keep in memory
    debounceMs = 300,
    autoCleanup = true,
  } = options;

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [memoryItems, setMemoryItems] = useState([]);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Memory-efficient filtering
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let filtered = data;
    
    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const searchableText = Object.values(item)
          .filter(value => typeof value === 'string')
          .join(' ')
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }
    
    // Apply other filters
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return item[key] === value;
        });
      });
    }
    
    return filtered;
  }, [data, debouncedSearchTerm, filters]);

  // Paginated data for current view
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Update memory items (keep recently viewed items)
  useEffect(() => {
    if (autoCleanup && paginatedData.length > 0) {
      setMemoryItems(prev => {
        const newItems = [...prev, ...paginatedData];
        
        // Remove duplicates based on ID
        const uniqueItems = newItems.filter((item, index, self) => 
          index === self.findIndex(i => (i._id || i.id) === (item._id || item.id))
        );
        
        // Keep only maxMemoryItems most recent items
        if (uniqueItems.length > maxMemoryItems) {
          return uniqueItems.slice(-maxMemoryItems);
        }
        
        return uniqueItems;
      });
    }
  }, [paginatedData, maxMemoryItems, autoCleanup]);

  // Navigation functions
  const goToPage = useCallback((page) => {
    const maxPage = Math.ceil(filteredData.length / pageSize) - 1;
    setCurrentPage(Math.max(0, Math.min(page, maxPage)));
  }, [filteredData.length, pageSize]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, filters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setMemoryItems([]);
    };
  }, []);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  return {
    // Data
    currentData: paginatedData,
    filteredData,
    memoryItems,
    totalItems: filteredData.length,
    
    // Pagination
    currentPage,
    totalPages,
    pageSize,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    
    // Search & Filters
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    
    // Utils
    clearMemory: () => setMemoryItems([]),
  };
};

/**
 * Hook for optimized rendering of large lists with intersection observer
 */
export const useVisibilityOptimization = (itemRefs, threshold = 0.1) => {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleItems(prev => {
          const newVisible = new Set(prev);
          entries.forEach(entry => {
            const index = parseInt(entry.target.dataset.index);
            if (entry.isIntersecting) {
              newVisible.add(index);
            } else {
              newVisible.delete(index);
            }
          });
          return newVisible;
        });
      },
      { threshold }
    );

    itemRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [itemRefs, threshold]);

  return visibleItems;
};
