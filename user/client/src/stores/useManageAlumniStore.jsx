import { create } from 'zustand';
import { optimizedRequest } from '@/utils/requestManager';

const useManageAlumniStore = create((set, get) => ({
  links: [],
  allLinks: [],
  isLoading: false,
  error: null,
  selectedLinks: [],
  processing: false,
  searchQuery: '',
  selectedLocation: 'All Chapters',
  selectedCourse: 'All Courses',
  availableCourses: ['All Courses'],
  hierarchyModalOpen: false,
  selectedLinkForHierarchy: null,
  currentPage: 1,
  pagination: {
    totalPages: 1,
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10
  },

  // Setters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setSelectedLinks: (links) => set({ selectedLinks: links }),
  setProcessing: (val) => set({ processing: val }),
  setHierarchyModalOpen: (open) => set({ hierarchyModalOpen: open }),
  setSelectedLinkForHierarchy: (link) => set({ selectedLinkForHierarchy: link }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPagination: (pagination) => set({ pagination }),

  // Fetch all links with pagination
  fetchLinks: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await optimizedRequest.get(`/links/admin/all`, { params: { page, limit } });
      const links = res.data || [];
      
      // Extract unique courses
      const courses = ['All Courses', ...new Set(links.map(link => link.course).filter(Boolean))];
      
      set({
        links,
        allLinks: links,
        availableCourses: courses,
        pagination: res.pagination || { totalPages: 1, currentPage: 1, totalItems: 0, itemsPerPage: 10 },
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Update link hierarchy
  updateLinkHierarchy: async (linkId, newHierarchy) => {
    set({ processing: true });
    try {
      await optimizedRequest.put(`/links/admin/${linkId}/hierarchy`, { hierarchy: newHierarchy });
      // Refresh links after update
      await get().fetchLinks(get().currentPage);
      set({ processing: false, hierarchyModalOpen: false, selectedLinkForHierarchy: null });
    } catch (err) {
      set({ processing: false });
      throw err;
    }
  },

  // Bulk delete links
  bulkDeleteLinks: async () => {
    set({ processing: true });
    const selected = get().selectedLinks;
    try {
      await Promise.all(selected.map(linkId => optimizedRequest.delete(`/links/admin/${linkId}`)));
      await get().fetchLinks(get().currentPage);
      set({ processing: false, selectedLinks: [] });
    } catch (err) {
      set({ processing: false });
      throw err;
    }
  },

  // Toggle link selection
  toggleLinkSelection: (linkId) => {
    const { selectedLinks } = get();
    set({
      selectedLinks: selectedLinks.includes(linkId)
        ? selectedLinks.filter(id => id !== linkId)
        : [...selectedLinks, linkId]
    });
  },

  // Toggle all links selection
  toggleAllLinksSelection: () => {
    const { selectedLinks, links } = get();
    set({
      selectedLinks: selectedLinks.length === links.length
        ? []
        : links.map(link => link._id)
    });
  },

  // Clear all selections
  clearSelections: () => set({ selectedLinks: [] }),

  // Reset filters
  resetFilters: () => set({
    searchQuery: '',
    selectedLocation: 'All Chapters',
    selectedCourse: 'All Courses',
  }),
}));

export default useManageAlumniStore;
