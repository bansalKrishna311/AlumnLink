import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubAdmin } from '../context/SubAdminContext';
import { 
  Loader, 
  MessageSquare, 
  Calendar, 
  Briefcase, 
  Award, 
  FileText, 
  AlertTriangle,
  Clock,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  XCircle,
  RotateCcw,
  Search,
  Check
} from 'lucide-react';
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";

// Define all post types with their respective UI configurations based on the actual model
const POST_TYPES = {
  all: {
    label: "All Posts",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-gray-100 text-gray-700"
  },
  discussion: {
    label: "Discussion",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "bg-[#fe6019]/10 text-[#fe6019]",
    detailsColor: "bg-[#fe6019]/5 border-[#fe6019]/20",
    titleColor: "text-[#fe6019]"
  },
  event: {
    label: "Event",
    icon: <Calendar className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-600",
    detailsColor: "bg-blue-50 border-blue-100",
    titleColor: "text-blue-700"
  },
  job: {
    label: "Job",
    icon: <Briefcase className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-600",
    detailsColor: "bg-purple-50 border-purple-100",
    titleColor: "text-purple-700"
  },
  internship: {
    label: "Internship",
    icon: <Award className="w-5 h-5" />,
    color: "bg-green-100 text-green-600",
    detailsColor: "bg-green-50 border-green-100",
    titleColor: "text-green-700"
  },
  personal: {
    label: "Personal",
    icon: <User className="w-5 h-5" />,
    color: "bg-yellow-100 text-yellow-600",
    detailsColor: "bg-yellow-50 border-yellow-100",
    titleColor: "text-yellow-700"
  },
  other: {
    label: "Other",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-gray-100 text-gray-600",
    detailsColor: "bg-gray-50 border-gray-100",
    titleColor: "text-gray-700"
  }
};

// Types that appear in the filter UI
const ACTIVE_FILTER_TYPES = ['all', 'discussion', 'event', 'job', 'internship', 'personal', 'other'];

const RejectedPosts = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Add ref for modal content
  const modalContentRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const queryClient = useQueryClient();
  const { targetAdminId } = useSubAdmin();

  // Fetch rejected posts with server-side pagination
  const { data: responseData, isLoading: fetchingPosts, error: fetchError } = useQuery({
    queryKey: ['rejectedPosts', currentPage, itemsPerPage, targetAdminId],
    queryFn: async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString()
        });
        
        // Add target admin ID if available
        if (targetAdminId) {
          console.log('🎯 RejectedPosts - Adding targetAdminId to API call:', targetAdminId);
          params.append('adminId', targetAdminId);
        } else {
          console.log('⚠️ RejectedPosts - No targetAdminId found, using current user');
        }
        
        console.log('🌐 RejectedPosts - Final API URL params:', params.toString());
        
        const response = await axiosInstance.get(`/posts/admin/rejected?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching rejected posts:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error fetching rejected posts:", error);
    }
  });

  // Extract data and pagination info
  const rejectedPosts = responseData?.success ? responseData.data : (Array.isArray(responseData) ? responseData : []);
  const pagination = responseData?.pagination || {};
  
  // Fallback pagination calculation if backend doesn't provide it
  const totalItems = rejectedPosts.length;
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
  const finalPagination = {
    currentPage: currentPage,
    totalPages: pagination.totalPages || totalPages,
    totalItems: pagination.totalItems || totalItems,
    hasNextPage: currentPage < (pagination.totalPages || totalPages),
    hasPrevPage: currentPage > 1
  };

  // Client-side filtering for search and type (applied to current page only)
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Update filtered posts when rejected posts data changes or filters change
  useEffect(() => {
    if (rejectedPosts) {
      let filtered = [...rejectedPosts];
      
      // Apply type filter
      if (selectedType !== 'all') {
        filtered = filtered.filter(post => post.type === selectedType);
      }
      
      // Apply search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(post => 
          post.content?.toLowerCase().includes(query) || 
          post.author?.name?.toLowerCase().includes(query)
        );
      }
      
      setFilteredPosts(filtered);
    }
  }, [rejectedPosts, selectedType, searchQuery]);

  // Use filtered posts for display, but use server pagination for navigation
  const currentItems = filteredPosts || [];
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedPosts([]); // Clear selections when changing pages
    // Reset filters when changing pages to show server-side results
    setSelectedType("all");
    setSearchQuery('');
  };

  // Handle restoring a post to pending status
  const handleRestorePost = async (postId) => {
    if (processing) return;
    
    setProcessing(true);
    try {
      await axiosInstance.post(`/posts/admin/${postId}/review`, {
        status: 'pending'
      });
      
      toast.success("Post has been restored to pending status");
      queryClient.invalidateQueries({ queryKey: ['rejectedPosts', currentPage, itemsPerPage] });
      
      // Remove from selected posts if it was selected
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    } catch (error) {
      console.error("Error restoring post:", error);
      toast.error("Failed to restore post. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Handle bulk restore posts
  const handleBulkRestore = async () => {
    if (processing || selectedPosts.length === 0) return;
    
    setProcessing(true);
    try {
      const promises = selectedPosts.map(postId => 
        axiosInstance.post(`/posts/admin/${postId}/review`, {
          status: 'pending'
        })
      );
      
      await Promise.all(promises);
      toast.success(`${selectedPosts.length} posts restored to pending status`);
      queryClient.invalidateQueries({ queryKey: ['rejectedPosts'] });
      setSelectedPosts([]);
    } catch (error) {
      console.error("Error bulk restoring posts:", error);
      toast.error("Failed to restore some posts. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Toggle post selection for bulk actions
  const togglePostSelection = (postId) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  // Handle selecting all visible posts
  const toggleAllSelection = () => {
    if (currentItems.length === 0) return;
    
    if (selectedPosts.length === currentItems.length) {
      // Deselect all if all are selected
      setSelectedPosts([]);
    } else {
      // Select all visible posts
      setSelectedPosts(currentItems.map(post => post._id));
    }
  };

  // Preview a post
  const handlePreviewPost = (post) => {
    setPreviewPost(post);
    setShowPreviewModal(true);
  };

  // Close preview modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        setShowPreviewModal(false);
      }
    };

    if (showPreviewModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [showPreviewModal]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 50,
        damping: 10
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.2 
      }
    }
  };

  if (fetchingPosts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div 
          className="rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#fe6019]"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.2, 
            ease: "linear", 
            repeat: Infinity 
          }}
        />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Rejected Posts</h2>
        <p className="text-gray-600 mb-4">Something went wrong. Please try again later.</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['rejectedPosts', currentPage, itemsPerPage] })}
          className="px-4 py-2 bg-[#fe6019] text-white rounded-md flex items-center gap-2 hover:bg-[#e55a17] transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Rejected Posts
      </motion.h1>

      <motion.div
        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <p>Rejected posts will be automatically deleted after 30 days. You can restore them to pending status before deletion if needed.</p>
        </div>
      </motion.div>

      <motion.div 
        className="mb-6 bg-white rounded-xl shadow-md p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg text-gray-800 flex items-center">
            <Filter className="mr-2 h-5 w-5 text-[#fe6019]" />
            Filter by Type
          </h2>
          <span className="text-sm text-gray-500">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {ACTIVE_FILTER_TYPES.map(type => {
            const typeConfig = POST_TYPES[type];
            return (
              <motion.button
                key={type}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors flex items-center
                  ${selectedType === type 
                    ? "bg-[#fe6019] text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <span className="mr-1.5">
                  {typeConfig.icon}
                </span>
                {typeConfig.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search in rejected posts..."
            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {selectedPosts.length > 0 && (
          <motion.button
            className="px-4 py-2 bg-[#fe6019] text-white rounded-lg font-medium shadow-sm hover:bg-[#e55a17] transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleBulkRestore}
            disabled={processing || selectedPosts.length === 0}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={14} />
            {processing ? 'Processing...' : `Restore ${selectedPosts.length} Post${selectedPosts.length > 1 ? 's' : ''}`}
          </motion.button>
        )}
      </motion.div>

      {filteredPosts.length === 0 ? (
        <motion.div 
          className="text-center py-12 bg-white rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <XCircle className="h-10 w-10 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No rejected posts found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery || selectedType !== 'all' 
              ? "Try changing your filters or search query." 
              : "There are no rejected posts at this time."}
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div 
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#fff5f0]">
                  <th className="px-3 py-4 text-left">
                    <div className="flex items-center">
                      <label className="inline-flex">
                        <input 
                          type="checkbox" 
                          className="form-checkbox rounded border-gray-300 text-[#fe6019] focus:ring focus:ring-[#fe6019]/20 h-5 w-5 cursor-pointer"
                          checked={currentItems.length > 0 && selectedPosts.length === currentItems.length}
                          onChange={toggleAllSelection}
                        />
                      </label>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Rejected On</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                className="divide-y divide-gray-200 bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentItems.map((post, index) => {
                  const typeConfig = POST_TYPES[post.type] || POST_TYPES.other;
                  const isSelected = selectedPosts.includes(post._id);
                  
                  return (
                    <motion.tr 
                      key={post._id} 
                      className={`hover:bg-[#fff5f0] transition-all duration-200 ${
                        isSelected ? 'bg-[#fff5f0]' : ''
                      }`}
                      variants={rowVariants}
                      custom={index}
                      layout
                    >
                      <td className="pl-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <label className="inline-flex">
                            <input 
                              type="checkbox" 
                              className="form-checkbox rounded border-gray-300 text-[#fe6019] focus:ring focus:ring-[#fe6019]/20 h-5 w-5 cursor-pointer"
                              checked={isSelected}
                              onChange={() => togglePostSelection(post._id)}
                            />
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={post.author?.profilePicture || "/avatar.png"}
                            alt={post.author?.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <span className="text-sm text-gray-900 font-medium block">{post.author?.name || "Unknown User"}</span>
                            <span className="text-xs text-gray-500">@{post.author?.username || "unknown"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${typeConfig.color}`}>
                          {typeConfig.icon}
                          <span className="ml-1">{typeConfig.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 truncate max-w-xs">
                          {post.content}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-[#fe6019]" />
                          {formatDate(post.reviewedAt || post.updatedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
                            aria-label="Preview Post"
                            onClick={() => handlePreviewPost(post)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye size={14} />
                          </motion.button>

                          <motion.button
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors duration-200"
                            aria-label="Restore Post"
                            onClick={() => handleRestorePost(post._id)}
                            disabled={processing}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <RotateCcw size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </motion.div>

          {selectedPosts.length > 0 && (
            <motion.div 
              className="mt-4 p-3 bg-[#fff5f0] rounded-lg border border-[#fe6019]/20 text-sm text-gray-700 flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div>
                <span className="font-medium text-[#fe6019]">{selectedPosts.length}</span> post{selectedPosts.length !== 1 ? 's' : ''} selected
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 underline text-sm"
                onClick={() => setSelectedPosts([])}
              >
                Clear selection
              </button>
            </motion.div>
          )}

          {/* Pagination controls */}
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Pagination
              currentPage={finalPagination.currentPage}
              totalPages={finalPagination.totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        </>
      )}

      {/* Post Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && previewPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              className="relative bg-transparent w-full max-w-3xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              ref={modalContentRef}
            >
              <div className="flex flex-col">
                {/* Modal header with close button */}
                <div className="flex justify-between items-center mb-2 px-2">
                  <div className="bg-white/90 rounded-full py-1 px-3 shadow-sm flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-[#fe6019] animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-700">Rejected Post Preview</span>
                  </div>
                  
                  <motion.button
                    className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => setShowPreviewModal(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle size={20} />
                  </motion.button>
                </div>
                
                {/* Post Preview Card */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                  {/* Post header with user info and type badge */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={previewPost.author?.profilePicture || "/avatar.png"}
                            alt={previewPost.author?.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 flex items-center">
                            {previewPost.author?.name || "Unknown User"}
                            {previewPost.author?.verified && (
                              <svg className="ml-1 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </h3>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <span>@{previewPost.author?.username || "unknown"}</span>
                            <span>•</span>
                            <span>{new Date(previewPost.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`${POST_TYPES[previewPost.type]?.color || POST_TYPES.other.color} px-3 py-1 rounded-full text-sm flex items-center gap-1.5`}>
                          {POST_TYPES[previewPost.type]?.icon || POST_TYPES.other.icon}
                          {POST_TYPES[previewPost.type]?.label || "Other"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post content */}
                  <div className="p-5">
                    <p className="text-gray-800 whitespace-pre-wrap text-[15px] leading-relaxed">{previewPost.content}</p>
                    
                    {/* Hashtags highlighted */}
                    {previewPost.content && previewPost.content.includes('#') && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {previewPost.content.split(' ')
                          .filter(word => word.startsWith('#') && word.length > 1)
                          .map((hashtag, index) => (
                            <span key={index} className="text-[#fe6019] text-sm font-medium hover:underline">
                              {hashtag}
                            </span>
                          ))}
                      </div>
                    )}
                    
                    {/* Post image with improved styling */}
                    {previewPost.image && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        <img
                          src={previewPost.image}
                          alt="Post content"
                          className="w-full h-auto max-h-64 object-contain bg-black/5"
                        />
                      </div>
                    )}
                    
                    {/* Type-specific details with enhanced styling */}
                    {previewPost.type === "job" && previewPost.jobDetails && (
                      <div className="mt-5 bg-purple-50 p-4 rounded-lg border border-purple-100 shadow-sm">
                        <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                          <Briefcase size={16} className="mr-2" />
                          Job Opportunity
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Company</span>
                            <span className="text-purple-700">{previewPost.jobDetails.company}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Position</span>
                            <span className="text-purple-700">{previewPost.jobDetails.title}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Location</span>
                            <span className="text-purple-700">{previewPost.jobDetails.location}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {previewPost.type === "internship" && previewPost.internshipDetails && (
                      <div className="mt-5 bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
                        <h4 className="font-medium text-green-800 mb-3 flex items-center">
                          <Award size={16} className="mr-2" />
                          Internship Opportunity
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Company</span>
                            <span className="text-green-700">{previewPost.internshipDetails.company}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Duration</span>
                            <span className="text-green-700">{previewPost.internshipDetails.duration}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {previewPost.type === "event" && previewPost.eventDetails && (
                      <div className="mt-5 bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                        <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                          <Calendar size={16} className="mr-2" />
                          Event Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Event</span>
                            <span className="text-blue-700">{previewPost.eventDetails.name}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Date & Time</span>
                            <span className="text-blue-700">{previewPost.eventDetails.date && new Date(previewPost.eventDetails.date).toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Location</span>
                            <span className="text-blue-700">{previewPost.eventDetails.location}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Rejection details */}
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-5">
                      <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                        <XCircle size={16} />
                        Rejection Details
                      </h4>
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Rejected on:</p>
                        <p className="text-sm">{formatDate(previewPost.reviewedAt || previewPost.updatedAt)}</p>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Rejected by:</p>
                        <p className="text-sm">@{previewPost.adminId?.username || "admin"}</p>
                      </div>
                      {previewPost.feedback && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Reason:</p>
                          <p className="text-sm whitespace-pre-wrap">{previewPost.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-center gap-4 mt-5">
                  <motion.button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      handleRestorePost(previewPost._id);
                      setShowPreviewModal(false);
                    }}
                    disabled={processing}
                    className="px-6 py-2 bg-[#fe6019] text-white rounded-md flex items-center gap-2 hover:bg-[#e55a17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {processing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Restore to Pending
                  </motion.button>
                </div>
                
                {/* Display metadata for admin */}
                {/* <div className="mt-3 text-center">
                  <span className="text-xs text-gray-400">
                    Post ID: {previewPost._id} • Created: {new Date(previewPost.createdAt).toLocaleString()}
                  </span>
                </div> */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RejectedPosts;