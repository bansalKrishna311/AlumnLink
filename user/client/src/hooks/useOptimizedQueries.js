import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useMemo, useCallback } from "react";

// Optimized query configurations
const queryConfig = {
  // Auth user - long cache since it rarely changes
  authUser: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  },
  // Posts - medium cache for better UX
  posts: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  },
  // Messages - short cache for real-time feel
  messages: {
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30000, // 30 seconds
  },
  // User connections - long cache
  connections: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: false,
  },
  // Static data - very long cache
  static: {
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
  },
};

// Custom hooks for optimized queries
export const useOptimizedAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch {
        return null;
      }
    },
    ...queryConfig.authUser,
  });
};

export const useOptimizedPosts = (filters = {}) => {
  const queryKey = useMemo(() => ["posts", filters], [filters]);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const res = await axiosInstance.get(`/posts?${params}`);
      return res.data;
    },
    ...queryConfig.posts,
  });
};

export const useOptimizedConversation = (username) => {
  return useQuery({
    queryKey: ["conversation", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/messages/${username}`);
      return response.data;
    },
    enabled: !!username,
    ...queryConfig.messages,
  });
};

export const useOptimizedConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await axiosInstance.get("/messages/conversations");
      return response.data;
    },
    ...queryConfig.connections,
  });
};

export const useOptimizedUserConnections = () => {
  return useQuery({
    queryKey: ["userMessagingConnections"],
    queryFn: async () => {
      const response = await axiosInstance.get("/links");
      return response.data;
    },
    ...queryConfig.connections,
  });
};

export const useOptimizedSameAdminUsers = () => {
  return useQuery({
    queryKey: ["sameAdminMessagingConnections"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/suggestions");
      return response.data;
    },
    ...queryConfig.connections,
  });
};

// Batch query hook for efficiency
export const useBatchQueries = (queries) => {
  return queries.map(query => useQuery(query));
};

// Prefetch hook for improving perceived performance
export const usePrefetchQueries = () => {
  const queryClient = useQueryClient();
  
  const prefetchPosts = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ["posts"],
      queryFn: async () => {
        const res = await axiosInstance.get("/posts");
        return res.data;
      },
      ...queryConfig.posts,
    });
  }, [queryClient]);

  const prefetchConversations = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ["conversations"],
      queryFn: async () => {
        const response = await axiosInstance.get("/messages/conversations");
        return response.data;
      },
      ...queryConfig.connections,
    });
  }, [queryClient]);

  return { prefetchPosts, prefetchConversations };
};
