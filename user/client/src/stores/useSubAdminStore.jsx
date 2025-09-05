import { create } from 'zustand';
import { optimizedRequest } from '@/utils/requestManager';

const useSubAdminStore = create((set, get) => ({
  // Auth state
  authUser: null,
  authLoading: false,
  authError: null,

  // Hierarchy data
  hierarchyData: null,
  hierarchyLoading: false,
  hierarchyError: null,

  // UI state
  activeItem: '',
  sidebarCollapsed: false,

  // Actions
  setActiveItem: (item) => set({ activeItem: item }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Fetch auth user
  fetchAuthUser: async () => {
    set({ authLoading: true, authError: null });
    try {
      const user = await optimizedRequest.get('/auth/me');
      set({ authUser: user, authLoading: false });
      return user;
    } catch (error) {
      set({ authError: error.message, authLoading: false });
      throw error;
    }
  },

  // Fetch hierarchy data
  fetchHierarchyData: async () => {
    const { authUser } = get();
    if (!authUser?._id) return;

    set({ hierarchyLoading: true, hierarchyError: null });
    try {
      const data = await optimizedRequest.get('/links/hierarchy/my-hierarchy');
      set({ hierarchyData: data, hierarchyLoading: false });
      return data;
    } catch (error) {
      set({ hierarchyError: error.message, hierarchyLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await optimizedRequest.post('/auth/logout');
      set({ 
        authUser: null, 
        hierarchyData: null, 
        activeItem: '',
        authError: null,
        hierarchyError: null
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Clear all data
  clearStore: () => set({
    authUser: null,
    authLoading: false,
    authError: null,
    hierarchyData: null,
    hierarchyLoading: false,
    hierarchyError: null,
    activeItem: '',
    sidebarCollapsed: false,
  }),
}));

export default useSubAdminStore;
