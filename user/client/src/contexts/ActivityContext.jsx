import { createContext, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const ActivityContext = createContext({});

export const ActivityProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Function to invalidate contribution data
  const invalidateContributions = useCallback((username) => {
    if (username) {
      queryClient.invalidateQueries(['userContributions', username]);
    }
  }, [queryClient]);

  // Function to track activity and update contributions in real-time
  const trackActivity = useCallback(async (activityType, username) => {
    try {
      // The backend will automatically track the activity when the API is called
      // We just need to invalidate the contribution queries to refresh the graph
      
      // Add a small delay to ensure the backend has processed the activity
      setTimeout(() => {
        invalidateContributions(username);
        
        // Also invalidate the current user's contributions if different
        const authUser = queryClient.getQueryData(['authUser']);
        if (authUser && authUser.username !== username) {
          invalidateContributions(authUser.username);
        }
      }, 500);
      
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [queryClient, invalidateContributions]);

  // Listen for mutation events and track activities
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.query.queryKey) {
        const queryKey = event.query.queryKey;
        
        // Check if this is a mutation that should trigger activity tracking
        if (queryKey[0] === 'createPost' || queryKey[0] === 'posts') {
          const authUser = queryClient.getQueryData(['authUser']);
          if (authUser) {
            trackActivity('post', authUser.username);
          }
        }
      }
    });

    return unsubscribe;
  }, [queryClient, trackActivity]);

  // Set up mutation observers for real-time tracking
  useEffect(() => {
    const mutationCache = queryClient.getMutationCache();
    
    const unsubscribe = mutationCache.subscribe((event) => {
      if (event.type === 'updated' && event.mutation.state.status === 'success') {
        const mutationKey = event.mutation.options.mutationKey;
        const authUser = queryClient.getQueryData(['authUser']);
        
        if (!authUser) return;
        
        // Track different types of activities based on mutation keys
        if (mutationKey) {
          if (mutationKey.includes('createPost')) {
            trackActivity('post', authUser.username);
          } else if (mutationKey.includes('reactToPost') || mutationKey.includes('likePost')) {
            trackActivity('like', authUser.username);
          } else if (mutationKey.includes('createComment') || mutationKey.includes('replyToComment')) {
            trackActivity('comment', authUser.username);
          }
        }
      }
    });

    return unsubscribe;
  }, [queryClient, trackActivity]);

  const value = {
    trackActivity,
    invalidateContributions,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};
