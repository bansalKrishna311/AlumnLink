import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { optimizedRequest } from '@/utils/requestManager';

// Main app store with all the frequently used data
const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Auth state
        authUser: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null,

        // Posts state
        posts: [],
        postsLoading: false,
        postsError: null,
        postsLastFetch: null,

        // Trending tags state
        trendingTags: [],
        trendingTagsLoading: false,
        trendingTagsError: null,
        trendingTagsLastFetch: null,

        // User connections state
        userConnections: [],
        userConnectionsLoading: false,
        userConnectionsError: null,
        userConnectionsLastFetch: null,

        // Same admin users state
        sameAdminUsers: [],
        sameAdminUsersLoading: false,
        sameAdminUsersError: null,
        sameAdminUsersLastFetch: null,

        // Conversations state
        conversations: [],
        conversationsLoading: false,
        conversationsError: null,
        conversationsLastFetch: null,

        // Cache management
        CACHE_DURATION: {
          AUTH: 15 * 60 * 1000, // 15 minutes
          POSTS: 2 * 60 * 1000, // 2 minutes
          TRENDING_TAGS: 10 * 60 * 1000, // 10 minutes
          CONNECTIONS: 10 * 60 * 1000, // 10 minutes
          CONVERSATIONS: 30 * 1000, // 30 seconds
        },

        // Check if data is stale
        isStale: (lastFetch, duration) => {
          if (!lastFetch) return true;
          return Date.now() - lastFetch > duration;
        },

        // Auth actions
        fetchAuthUser: async () => {
          const { authUser, authLoading, isStale, CACHE_DURATION } = get();
          
          if (authLoading || (!isStale(get().authLastFetch, CACHE_DURATION.AUTH) && authUser)) {
            return authUser;
          }

          set({ authLoading: true, authError: null });
          
          try {
            const user = await optimizedRequest.get('/auth/me', { 
              cacheTTL: CACHE_DURATION.AUTH 
            });
            
            set({ 
              authUser: user, 
              isAuthenticated: true, 
              authLoading: false,
              authLastFetch: Date.now()
            });
            
            return user;
          } catch (error) {
            set({ 
              authUser: null, 
              isAuthenticated: false, 
              authLoading: false, 
              authError: error.message,
              authLastFetch: Date.now()
            });
            return null;
          }
        },

        // Posts actions
        fetchPosts: async (filters = {}) => {
          const { postsLoading, isStale, CACHE_DURATION } = get();
          
          if (postsLoading || (!isStale(get().postsLastFetch, CACHE_DURATION.POSTS) && get().posts.length > 0)) {
            return get().posts;
          }

          set({ postsLoading: true, postsError: null });
          
          try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
              if (value) params.append(key, value);
            });
            
            const posts = await optimizedRequest.get(`/posts`, { 
              params: filters,
              cacheTTL: CACHE_DURATION.POSTS 
            });
            
            set({ 
              posts, 
              postsLoading: false,
              postsLastFetch: Date.now()
            });
            
            return posts;
          } catch (error) {
            set({ 
              postsLoading: false, 
              postsError: error.message,
              postsLastFetch: Date.now()
            });
            return [];
          }
        },

        // Trending tags actions
        fetchTrendingTags: async () => {
          const { trendingTagsLoading, isStale, CACHE_DURATION } = get();
          
          if (trendingTagsLoading || (!isStale(get().trendingTagsLastFetch, CACHE_DURATION.TRENDING_TAGS) && get().trendingTags.length > 0)) {
            return get().trendingTags;
          }

          set({ trendingTagsLoading: true, trendingTagsError: null });
          
          try {
            const tags = await optimizedRequest.get('/posts/admin/trending-tags', { 
              cacheTTL: CACHE_DURATION.TRENDING_TAGS 
            });
            
            set({ 
              trendingTags: tags || [], 
              trendingTagsLoading: false,
              trendingTagsLastFetch: Date.now()
            });
            
            return tags || [];
          } catch (error) {
            set({ 
              trendingTagsLoading: false, 
              trendingTagsError: error.message,
              trendingTagsLastFetch: Date.now()
            });
            return [];
          }
        },

        // User connections actions
        fetchUserConnections: async () => {
          const { userConnectionsLoading, isStale, CACHE_DURATION } = get();
          
          if (userConnectionsLoading || (!isStale(get().userConnectionsLastFetch, CACHE_DURATION.CONNECTIONS) && get().userConnections.length > 0)) {
            return get().userConnections;
          }

          set({ userConnectionsLoading: true, userConnectionsError: null });
          
          try {
            const connections = await optimizedRequest.get('/links', { 
              cacheTTL: CACHE_DURATION.CONNECTIONS 
            });
            
            set({ 
              userConnections: connections, 
              userConnectionsLoading: false,
              userConnectionsLastFetch: Date.now()
            });
            
            return connections;
          } catch (error) {
            set({ 
              userConnectionsLoading: false, 
              userConnectionsError: error.message,
              userConnectionsLastFetch: Date.now()
            });
            return [];
          }
        },

        // Same admin users actions
        fetchSameAdminUsers: async () => {
          const { sameAdminUsersLoading, isStale, CACHE_DURATION } = get();
          
          if (sameAdminUsersLoading || (!isStale(get().sameAdminUsersLastFetch, CACHE_DURATION.CONNECTIONS) && get().sameAdminUsers.length > 0)) {
            return get().sameAdminUsers;
          }

          set({ sameAdminUsersLoading: true, sameAdminUsersError: null });
          
          try {
            const users = await optimizedRequest.get('/users/suggestions', { 
              cacheTTL: CACHE_DURATION.CONNECTIONS 
            });
            
            set({ 
              sameAdminUsers: users, 
              sameAdminUsersLoading: false,
              sameAdminUsersLastFetch: Date.now()
            });
            
            return users;
          } catch (error) {
            set({ 
              sameAdminUsersLoading: false, 
              sameAdminUsersError: error.message,
              sameAdminUsersLastFetch: Date.now()
            });
            return [];
          }
        },

        // Conversations actions
        fetchConversations: async () => {
          const { conversationsLoading, isStale, CACHE_DURATION } = get();
          
          if (conversationsLoading || (!isStale(get().conversationsLastFetch, CACHE_DURATION.CONVERSATIONS) && get().conversations.length > 0)) {
            return get().conversations;
          }

          set({ conversationsLoading: true, conversationsError: null });
          
          try {
            const conversations = await optimizedRequest.get('/messages/conversations', { 
              cacheTTL: CACHE_DURATION.CONVERSATIONS 
            });
            
            set({ 
              conversations, 
              conversationsLoading: false,
              conversationsLastFetch: Date.now()
            });
            
            return conversations;
          } catch (error) {
            set({ 
              conversationsLoading: false, 
              conversationsError: error.message,
              conversationsLastFetch: Date.now()
            });
            return [];
          }
        },

        // Cache invalidation actions
        invalidatePosts: () => set({ postsLastFetch: null, posts: [] }),
        invalidateTrendingTags: () => set({ trendingTagsLastFetch: null, trendingTags: [] }),
        invalidateUserConnections: () => set({ userConnectionsLastFetch: null, userConnections: [] }),
        invalidateSameAdminUsers: () => set({ sameAdminUsersLastFetch: null, sameAdminUsers: [] }),
        invalidateConversations: () => set({ conversationsLastFetch: null, conversations: [] }),
        
        // Clear all cache
        clearCache: () => set({
          postsLastFetch: null,
          posts: [],
          trendingTagsLastFetch: null,
          trendingTags: [],
          userConnectionsLastFetch: null,
          userConnections: [],
          sameAdminUsersLastFetch: null,
          sameAdminUsers: [],
          conversationsLastFetch: null,
          conversations: [],
        }),

        // Logout action
        logout: () => set({
          authUser: null,
          isAuthenticated: false,
          authLoading: false,
          authError: null,
          posts: [],
          trendingTags: [],
          userConnections: [],
          sameAdminUsers: [],
          conversations: [],
        }),
      }),
      {
        name: 'alumnlink-app-store',
        partialize: (state) => ({
          // Only persist non-sensitive data with short expiry
          trendingTags: state.trendingTags,
          trendingTagsLastFetch: state.trendingTagsLastFetch,
        }),
      }
    ),
    {
      name: 'alumnlink-app-store',
    }
  )
);

export default useAppStore;
