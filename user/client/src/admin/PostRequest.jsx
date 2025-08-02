import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader, 
  MessageSquare, 
  Calendar, 
  Briefcase, 
  Award, 
  FileText, 
  AlertTriangle,
  Check,
  X,
  Clock,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  XCircle
} from "lucide-react";
import { FaSearch } from "react-icons/fa";
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

// Types that appear in the filter UI (based on post.model.js)
const ACTIVE_FILTER_TYPES = ['all', 'discussion', 'event', 'job', 'internship', 'personal', 'other'];

const PostRequests = () => {
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
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Fetch pending posts with server-side pagination
  const { data: responseData, isLoading } = useQuery({
    queryKey: ["pendingPosts", currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/posts/admin/pending?page=${currentPage}&limit=${itemsPerPage}`);
        return res.data;
      } catch (err) {
        // Return empty array instead of showing error for 404
        if (err.response && err.response.status === 404) {
          return { success: true, data: [], pagination: { totalPages: 0, currentPage: 1, totalItems: 0 } };
        }
        throw err;
      }
    }
  });

  // Extract data and pagination info
  const pendingPosts = responseData?.success ? responseData.data : (Array.isArray(responseData) ? responseData : []);
  const pagination = responseData?.pagination || {};

  // Client-side filtering for search and type (applied to current page only)
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Update filtered posts when search query or pendingPosts change
  useEffect(() => {
    if (!pendingPosts || !Array.isArray(pendingPosts)) {
      setFilteredPosts([]);
      return;
    }
    
    let filtered = [...pendingPosts];
    
    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(post => post.type === selectedType);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase();
      
      filtered = filtered.filter(post => {
        const nameMatch = post.author?.name?.toLowerCase().includes(searchLower);
        const contentMatch = post.content?.toLowerCase().includes(searchLower);
        
        // Type-specific field searching
        let detailsMatch = false;
        if (post.type === "job" && post.jobDetails) {
          detailsMatch = 
            (post.jobDetails.companyName || "").toLowerCase().includes(searchLower) || 
            (post.jobDetails.jobTitle || "").toLowerCase().includes(searchLower) || 
            (post.jobDetails.jobLocation || "").toLowerCase().includes(searchLower);
        } else if (post.type === "internship" && post.internshipDetails) {
          detailsMatch = 
            (post.internshipDetails.companyName || "").toLowerCase().includes(searchLower) || 
            (post.internshipDetails.internshipDuration || "").toLowerCase().includes(searchLower);
        } else if (post.type === "event" && post.eventDetails) {
          detailsMatch = 
            (post.eventDetails.eventName || "").toLowerCase().includes(searchLower) || 
            (post.eventDetails.eventLocation || "").toLowerCase().includes(searchLower);
        }
        
        return nameMatch || contentMatch || detailsMatch;
      });
    }
    
    setFilteredPosts(filtered);
  }, [pendingPosts, searchQuery, selectedType]);

  // Use filtered posts for display, but use server pagination for navigation
  const currentItems = filteredPosts;
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedPosts([]); // Clear selections when changing pages
    // Reset filters when changing pages to show server-side results
    setSelectedType("all");
    setSearchQuery('');
  };

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPreviewModal && modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        handleClosePreview();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPreviewModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showPreviewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPreviewModal]);

  const updatePostStatus = useMutation({
    mutationFn: async ({ postId, status }) => {
      const res = await axiosInstance.patch(`/posts/admin/${postId}/status`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["pendingPosts"]);
      toast.success(`Post ${variables.status === "approved" ? "approved" : "rejected"} successfully!`);
      
      // Close modal if the previewed post was updated
      if (previewPost && previewPost._id === variables.postId) {
        setShowPreviewModal(false);
        setPreviewPost(null);
      }
      
      // Remove selected posts that were processed
      setSelectedPosts(prev => prev.filter(id => id !== variables.postId));
    },
    onError: (error) => {
      console.error("Error updating post status:", error);
      toast.error("Error updating post status. Please try again.");
    }
  });

  const handleStatusUpdate = (postId, status) => {
    updatePostStatus.mutate({ postId, status });
  };

  const handleBulkApprove = async () => {
    if (selectedPosts.length === 0) {
      toast.error("Please select at least one post");
      return;
    }

    setProcessing(true);
    const successCount = { value: 0 };
    const failCount = { value: 0 };

    try {
      const updatePromises = selectedPosts.map(async (postId) => {
        try {
          await axiosInstance.patch(`/posts/admin/${postId}/status`, { status: "approved" });
          successCount.value++;
          return postId;
        } catch (error) {
          console.error(`Error approving post ${postId}:`, error);
          failCount.value++;
          return null;
        }
      });

      await Promise.all(updatePromises);
      
      // Refresh the posts data
      queryClient.invalidateQueries(["pendingPosts"]);
      
      // Close modal if the previewed post was in the selected posts
      if (previewPost && selectedPosts.includes(previewPost._id)) {
        setShowPreviewModal(false);
        setPreviewPost(null);
      }
      
      // Clear selection
      setSelectedPosts([]);
      
      if (successCount.value > 0) {
        toast.success(`${successCount.value} post${successCount.value > 1 ? 's' : ''} approved successfully!`);
      }
      
      if (failCount.value > 0) {
        toast.error(`Failed to approve ${failCount.value} post${failCount.value > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error(`Error in bulk approve:`, error);
      toast.error("An error occurred during batch processing");
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedPosts.length === 0) {
      toast.error("Please select at least one post");
      return;
    }

    setProcessing(true);
    const successCount = { value: 0 };
    const failCount = { value: 0 };

    try {
      const updatePromises = selectedPosts.map(async (postId) => {
        try {
          await axiosInstance.patch(`/posts/admin/${postId}/status`, { status: "rejected" });
          successCount.value++;
          return postId;
        } catch (error) {
          console.error(`Error rejecting post ${postId}:`, error);
          failCount.value++;
          return null;
        }
      });

      await Promise.all(updatePromises);
      
      // Refresh the posts data
      queryClient.invalidateQueries(["pendingPosts"]);
      
      // Close modal if the previewed post was in the selected posts
      if (previewPost && selectedPosts.includes(previewPost._id)) {
        setShowPreviewModal(false);
        setPreviewPost(null);
      }
      
      // Clear selection
      setSelectedPosts([]);
      
      if (successCount.value > 0) {
        toast.success(`${successCount.value} post${successCount.value > 1 ? 's' : ''} rejected successfully!`);
      }
      
      if (failCount.value > 0) {
        toast.error(`Failed to reject ${failCount.value} post${failCount.value > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error(`Error in bulk reject:`, error);
      toast.error("An error occurred during batch processing");
    } finally {
      setProcessing(false);
    }
  };

  // Get type configuration or default if type doesn't exist
  const getPostTypeConfig = (type) => {
    return POST_TYPES[type] || POST_TYPES.other;
  };

  // Helper functions for selection
  const togglePostSelection = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedPosts.length === currentItems.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(currentItems.map(post => post._id));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenPreview = (post) => {
    setPreviewPost(post);
    setShowPreviewModal(true);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewPost(null);
  };

  // Function to format the post type in a user-friendly way
  const getPostTypeBadge = (type) => {
    const typeConfig = getPostTypeConfig(type);
    
    const getPostTypeBadgeColor = (type) => {
      const types = {
        discussion: "bg-amber-400 text-white border-amber-500",
        job: "bg-indigo-400 text-white border-indigo-500",
        internship: "bg-emerald-400 text-white border-emerald-500",
        event: "bg-sky-400 text-white border-sky-500",
        personal: "bg-pink-400 text-white border-pink-500",
        other: "bg-blue-700 text-white border-blue-800",
      };
      return types[type] || "bg-gray-400 text-white border-gray-500";
    };
    
    return (
      <div className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${getPostTypeBadgeColor(type)}`}>
        {typeConfig.icon}
        <span className="capitalize ml-1">{typeConfig.label}</span>
      </div>
    );
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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

  return (
    <>
      <div className="p-8 w-full max-w-[1400px] mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Post Approval Requests
        </motion.h1>

        <motion.div
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
            <p>Pending posts will be automatically deleted after 30 days if no action is taken. Review these posts promptly.</p>
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
              placeholder="Search in posts..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex gap-3">
            <motion.button
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium shadow-sm hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleBulkApprove}
              disabled={processing || selectedPosts.length === 0}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Check size={14} />
              {processing ? 'Processing...' : 'Approve Selected'}
            </motion.button>

            <motion.button
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium shadow-sm hover:bg-red-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleBulkReject}
              disabled={processing || selectedPosts.length === 0}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <X size={14} />
              {processing ? 'Processing...' : 'Reject Selected'}
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-md p-5 mb-6"
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

        <AnimatePresence>
          {filteredPosts.length === 0 ? (
            <motion.div 
              className="text-center py-12 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Clock className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No pending posts to review</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                When users create new posts, they will appear here for your approval.
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Created</th>
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
                      const typeConfig = getPostTypeConfig(post.type);
                      
                      return (
                        <motion.tr 
                          key={post._id} 
                          className={`hover:bg-[#fff5f0] transition-all duration-200 ${
                            selectedPosts.includes(post._id) ? 'bg-[#fff5f0]' : ''
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
                                  checked={selectedPosts.includes(post._id)}
                                  onChange={() => togglePostSelection(post._id)}
                                />
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <img
                                src={post.author.profilePicture || "/avatar.png"}
                                alt={post.author.name}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              />
                              <div>
                                <span className="text-sm text-gray-900 font-medium block">{post.author.name}</span>
                                <span className="text-xs text-gray-500">@{post.author.username}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${typeConfig.color}`}>
                              {typeConfig.icon}
                              <span className="capitalize ml-1">{typeConfig.label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 truncate max-w-xs">
                              {post.content}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {new Date(post.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200"
                                aria-label="Approve Post"
                                onClick={() => handleStatusUpdate(post._id, "approved")}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Check size={14} />
                              </motion.button>

                              <motion.button
                                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                                aria-label="Reject Post"
                                onClick={() => handleStatusUpdate(post._id, "rejected")}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <X size={14} />
                              </motion.button>
                              
                              <motion.button
                                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
                                aria-label="Preview Post"
                                onClick={() => handleOpenPreview(post)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Eye size={14} />
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
              {pagination.totalPages > 1 && (
                <motion.div 
                  className="flex justify-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Pagination
                    currentPage={pagination.currentPage || currentPage}
                    totalPages={pagination.totalPages || 1}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

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
                    <span className="text-sm font-medium text-gray-700">Preview Mode</span>
                  </div>
                  
                  <motion.button
                    className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={handleClosePreview}
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
                            src={previewPost.author.profilePicture || "/avatar.png"}
                            alt={previewPost.author.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 flex items-center">
                            {previewPost.author.name}
                            {previewPost.author.verified && (
                              <svg className="ml-1 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </h3>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <span>@{previewPost.author.username}</span>
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
                        {getPostTypeBadge(previewPost.type)}
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
                    {previewPost.images && previewPost.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {previewPost.images.map((img, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                            <img
                              src={img}
                              alt={`Post content ${idx+1}`}
                              className="w-full h-auto max-h-64 object-contain bg-black/5"
                            />
                          </div>
                        ))}
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
                            <span className="text-purple-700">{previewPost.jobDetails.companyName}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Position</span>
                            <span className="text-purple-700">{previewPost.jobDetails.jobTitle}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Location</span>
                            <span className="text-purple-700">{previewPost.jobDetails.jobLocation}</span>
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
                            <span className="text-green-700">{previewPost.internshipDetails.companyName}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Duration</span>
                            <span className="text-green-700">{previewPost.internshipDetails.internshipDuration}</span>
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
                            <span className="text-blue-700">{previewPost.eventDetails.eventName}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Date & Time</span>
                            <span className="text-blue-700">{previewPost.eventDetails.eventDate && new Date(previewPost.eventDetails.eventDate).toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium text-gray-700 block mb-1">Location</span>
                            <span className="text-blue-700">{previewPost.eventDetails.eventLocation}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Simulated engagement section with better styling */}
                    <div className="border-t border-gray-100 pt-4 mt-5">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <div className="rounded-full bg-[#fe6019]/10 p-1.5 mr-1.5">
                              <MessageSquare size={14} className="text-[#fe6019]" />
                            </div>
                            <span>0 comments</span>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <div className="rounded-full bg-[#fe6019]/10 p-1.5 mr-1.5">
                              <Award size={14} className="text-[#fe6019]" />
                            </div>
                            <span>0 reactions</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Clock size={12} className="mr-1" />
                          <span>Pending approval</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons with improved styling */}
                <div className="flex justify-center gap-4 mt-5">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => handleStatusUpdate(previewPost._id, "approved")}
                    disabled={updatePostStatus.isPending}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {updatePostStatus.isPending ? 
                      <Loader size={20} className="animate-spin mr-2" /> : 
                      <Check size={20} className="mr-2" />
                    }
                    Approve Post
                  </motion.button>
                  
                  <motion.button
                    className="px-6 py-3 bg-white border-2 border-red-500 text-red-500 rounded-xl font-medium flex items-center hover:bg-red-50 transition-colors shadow-sm hover:shadow-md"
                    onClick={() => handleStatusUpdate(previewPost._id, "rejected")}
                    disabled={updatePostStatus.isPending}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <X size={20} className="mr-2" />
                    Reject Post
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
    </>
  );
};

export default PostRequests;
