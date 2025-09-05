import { create } from 'zustand';
import { optimizedRequest } from '@/utils/requestManager';

const usePostRequestStore = create((set, get) => ({
  posts: [],
  postsLoading: false,
  postsError: null,
  pagination: { totalPages: 1, currentPage: 1, totalItems: 0 },
  selectedType: 'all',
  searchQuery: '',
  selectedPosts: [],
  processing: false,
  previewPost: null,
  showPreviewModal: false,

  setSelectedType: (type) => set({ selectedType: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedPosts: (posts) => set({ selectedPosts: posts }),
  setProcessing: (val) => set({ processing: val }),
  setPreviewPost: (post) => set({ previewPost: post }),
  setShowPreviewModal: (val) => set({ showPreviewModal: val }),
  setPagination: (pagination) => set({ pagination }),

  fetchPosts: async (page = 1, limit = 10) => {
    set({ postsLoading: true, postsError: null });
    try {
      const res = await optimizedRequest.get(`/posts/admin/pending`, { params: { page, limit } });
      set({
        posts: res.data || [],
        pagination: res.pagination || { totalPages: 1, currentPage: 1, totalItems: 0 },
        postsLoading: false,
      });
    } catch (err) {
      set({ postsError: err.message, postsLoading: false });
    }
  },

  updatePostStatus: async (postId, status) => {
    set({ processing: true });
    try {
      await optimizedRequest.put(`/posts/admin/${postId}/status`, { status });
      // Refresh posts after update
      await get().fetchPosts(get().pagination.currentPage);
      set({ processing: false, showPreviewModal: false, previewPost: null });
    } catch (err) {
      set({ processing: false });
    }
  },

  bulkUpdateStatus: async (status) => {
    set({ processing: true });
    const selected = get().selectedPosts;
    try {
      await Promise.all(selected.map(postId => optimizedRequest.put(`/posts/admin/${postId}/status`, { status })));
      await get().fetchPosts(get().pagination.currentPage);
      set({ processing: false, selectedPosts: [] });
    } catch (err) {
      set({ processing: false });
    }
  },
});

export default usePostRequestStore;
