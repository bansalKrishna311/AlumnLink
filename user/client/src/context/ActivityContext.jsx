import { createContext, useEffect, useCallback } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Get current user using the same pattern as other components
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch {
        return null;
      }
    },
  });

  // Function to refresh contribution data
  const refreshContributions = useCallback((username) => {
    // Invalidate and refetch contribution data for the specific user
    queryClient.invalidateQueries(['userContributions', username]);
    
    // If it's the current user, also refresh their own contributions
    if (authUser && authUser.username === username) {
      queryClient.invalidateQueries(['userContributions', authUser.username]);
    }
  }, [queryClient, authUser]);

  // Function to trigger contribution refresh on activity
  const trackActivity = useCallback((activityType) => {
    if (authUser && authUser.username) {
      // Immediately refresh the current user's contribution data
      refreshContributions(authUser.username);
      
      // You could also emit a custom event here for other components to listen to
      window.dispatchEvent(new CustomEvent('userActivity', {
        detail: { 
          username: authUser.username,
          activityType,
          timestamp: new Date()
        }
      }));
    }
  }, [authUser, refreshContributions]);

  useEffect(() => {
    // Listen for successful mutations that should trigger activity tracking
    const handleMutationSuccess = (data, variables, context, mutation) => {
      const mutationKey = mutation.options.mutationKey;
      
      if (mutationKey && mutationKey.length > 0) {
        const mutationType = mutationKey[0];
        
        // Track different types of activities based on mutation key
        if (mutationType === 'createPost') {
          trackActivity('post');
        } else if (mutationType === 'reactToPost' || mutationType === 'likeComment' || mutationType === 'likeReply') {
          trackActivity('like');
        } else if (mutationType === 'createComment' || mutationType === 'createReply') {
          trackActivity('comment');
        }
      }
    };

    // Set up global mutation success handler
    queryClient.setDefaultOptions({
      mutations: {
        onSuccess: handleMutationSuccess
      }
    });

    return () => {
      // Clean up
      queryClient.setDefaultOptions({
        mutations: {}
      });
    };
  }, [queryClient, authUser, trackActivity]);

  const value = {
    refreshContributions,
    trackActivity
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityContext;
