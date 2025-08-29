import { useEffect, useState } from 'react';
import useAppStore from '@/stores/useAppStore';

// Hook for auth user with automatic fetching
export const useAuthUser = () => {
  const { authUser, authLoading, authError, fetchAuthUser } = useAppStore();
  
  useEffect(() => {
    fetchAuthUser();
  }, [fetchAuthUser]);
  
  return { data: authUser, isLoading: authLoading, error: authError };
};

// Hook for posts with automatic fetching
export const usePosts = (filters = {}) => {
  const { posts, postsLoading, postsError, fetchPosts } = useAppStore();
  
  useEffect(() => {
    fetchPosts(filters);
  }, [fetchPosts, JSON.stringify(filters)]);
  
  return { data: posts, isLoading: postsLoading, error: postsError };
};

// Hook for trending tags with automatic fetching
export const useTrendingTags = () => {
  const { trendingTags, trendingTagsLoading, trendingTagsError, fetchTrendingTags } = useAppStore();
  
  useEffect(() => {
    fetchTrendingTags();
  }, [fetchTrendingTags]);
  
  return { data: trendingTags, isLoading: trendingTagsLoading, error: trendingTagsError };
};

// Hook for user connections with automatic fetching
export const useUserConnections = () => {
  const { userConnections, userConnectionsLoading, userConnectionsError, fetchUserConnections } = useAppStore();
  
  useEffect(() => {
    fetchUserConnections();
  }, [fetchUserConnections]);
  
  return { data: userConnections, isLoading: userConnectionsLoading, error: userConnectionsError };
};

// Hook for same admin users with automatic fetching
export const useSameAdminUsers = () => {
  const { sameAdminUsers, sameAdminUsersLoading, sameAdminUsersError, fetchSameAdminUsers } = useAppStore();
  
  useEffect(() => {
    fetchSameAdminUsers();
  }, [fetchSameAdminUsers]);
  
  return { data: sameAdminUsers, isLoading: sameAdminUsersLoading, error: sameAdminUsersError };
};

// Hook for conversations with automatic fetching
export const useConversations = () => {
  const { conversations, conversationsLoading, conversationsError, fetchConversations } = useAppStore();
  
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  return { data: conversations, isLoading: conversationsLoading, error: conversationsError };
};

// Hook for manual data fetching with loading state
export const useManualFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const store = useAppStore();
  
  const fetchData = async (fetchFunction, ...args) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(...args);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };
  
  return {
    fetchPosts: (...args) => fetchData(store.fetchPosts, ...args),
    fetchTrendingTags: (...args) => fetchData(store.fetchTrendingTags, ...args),
    fetchUserConnections: (...args) => fetchData(store.fetchUserConnections, ...args),
    fetchSameAdminUsers: (...args) => fetchData(store.fetchSameAdminUsers, ...args),
    fetchConversations: (...args) => fetchData(store.fetchConversations, ...args),
    isLoading,
    error,
  };
};

// Hook for cache management
export const useCacheManager = () => {
  const store = useAppStore();
  
  return {
    invalidatePosts: store.invalidatePosts,
    invalidateTrendingTags: store.invalidateTrendingTags,
    invalidateUserConnections: store.invalidateUserConnections,
    invalidateSameAdminUsers: store.invalidateSameAdminUsers,
    invalidateConversations: store.invalidateConversations,
    clearCache: store.clearCache,
  };
};

// Hook for optimized search with debouncing
export const useOptimizedSearch = (data = [], searchFields = ['name', 'username'], delay = 300) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredData(data);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = data.filter(item => 
          searchFields.some(field => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], item);
            return value?.toString().toLowerCase().includes(query);
          })
        );
        setFilteredData(filtered);
      }
      setIsSearching(false);
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, data, searchFields, delay]);
  
  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    isSearching,
  };
};
