import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [previewPost, setPreviewPost] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add ref for modal content
  const modalContentRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  const queryClient = useQueryClient();

  // Fetch rejected posts
  const { data: rejectedPosts, isLoading: fetchingPosts, error: fetchError } = useQuery({
    queryKey: ['rejectedPosts'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/posts/admin/rejected');
        return response.data;
      } catch (error) {
        console.error("Error fetching rejected posts:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error fetching rejected posts:", error);
      setError("Failed to load rejected posts. Please try again later.");
    }
  });

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
          post.author?.name?.toLowerCase().includes(query) ||
          post.feedback?.toLowerCase().includes(query)
        );
      }
      
      setFilteredPosts(filtered);
      setIsLoading(false);
    }
  }, [rejectedPosts, selectedType, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil((filteredPosts?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts?.slice(indexOfFirstItem, indexOfLastItem) || [];
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      queryClient.invalidateQueries({ queryKey: ['rejectedPosts'] });
      
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
  const selectAllVisiblePosts = () => {
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
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPreviewModal]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading || fetchingPosts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-[#fe6019]" />
      </div>
    );
  }

  if (error || fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Rejected Posts</h2>
        <p className="text-gray-600 mb-4">{error || "Something went wrong. Please try again later."}</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['rejectedPosts'] })}
          className="px-4 py-2 bg-[#fe6019] text-white rounded-md flex items-center gap-2 hover:bg-[#e55a17] transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Rejected Posts</h1>
      
      {/* Filters and Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {ACTIVE_FILTER_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`${
                selectedType === type 
                  ? `${POST_TYPES[type].color} border-2 border-[#fe6019]/70` 
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent'
              } px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all`}
            >
              {POST_TYPES[type].icon}
              {POST_TYPES[type].label}
              {selectedType === type && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search rejected posts..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe6019]/50 focus:border-[#fe6019]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg flex justify-between items-center">
          <div>
            <span className="font-medium text-[#fe6019]">{selectedPosts.length} posts selected</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkRestore}
              disabled={processing}
              className="px-3 py-1.5 bg-[#fe6019] text-white rounded-md flex items-center gap-1 hover:bg-[#e55a17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              Restore to Pending
            </button>
          </div>
        </div>
      )}
      
      {filteredPosts?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <XCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-medium text-gray-900">No rejected posts found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery || selectedType !== 'all' 
              ? "Try changing your filters or search query." 
              : "There are no rejected posts at this time."}
          </p>
        </div>
      ) : (
        <>
          {/* Post Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentItems.map((post) => {
              const postTypeConfig = POST_TYPES[post.type] || POST_TYPES.other;
              const isSelected = selectedPosts.includes(post._id);
              
              return (
                <div
                  key={post._id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                    isSelected ? 'border-[#fe6019]' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`${postTypeConfig.color} px-2 py-1 rounded-full text-xs flex items-center gap-1`}>
                        {postTypeConfig.icon}
                        {postTypeConfig.label}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePostSelection(post._id)}
                          className={`p-1.5 rounded-full transition-colors ${
                            isSelected ? 'bg-[#fe6019]/10 text-[#fe6019]' : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={isSelected ? "Deselect post" : "Select post"}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-sm" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={post.author?.profilePicture || "/avatar.png"}
                        alt={post.author?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 leading-tight">{post.author?.name || "Unknown User"}</h4>
                        <p className="text-xs text-gray-500">@{post.author?.username || "unknown"}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-gray-700 line-clamp-3">{post.content}</p>
                    </div>
                    
                    {post.feedback && (
                      <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-sm text-red-700 font-medium">Rejection Reason:</p>
                        <p className="text-sm text-gray-700">{post.feedback}</p>
                      </div>
                    )}
                    
                    {post.image && (
                      <div className="mb-3 h-32 overflow-hidden rounded-lg">
                        <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Rejected on {formatDate(post.reviewedAt || post.updatedAt)}</span>
                      </div>
                      
                      {post.adminId && (
                        <span className="text-xs text-gray-500">
                          by @{post.adminId?.username || "admin"}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between gap-2 mt-4">
                      <button
                        onClick={() => handlePreviewPost(post)}
                        className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleRestorePost(post._id)}
                        disabled={processing}
                        className="flex-1 px-3 py-1.5 bg-[#fe6019] text-white rounded-md flex items-center justify-center gap-1 hover:bg-[#e55a17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                        Restore
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    currentPage === page
                      ? 'bg-[#fe6019] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Post Preview Modal */}
      {showPreviewModal && previewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            ref={modalContentRef}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Post Preview</h3>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={previewPost.author?.profilePicture || "/avatar.png"}
                  alt={previewPost.author?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{previewPost.author?.name || "Unknown User"}</h4>
                  <p className="text-sm text-gray-500">@{previewPost.author?.username || "unknown"}</p>
                  {previewPost.author?.headline && (
                    <p className="text-sm text-gray-600">{previewPost.author.headline}</p>
                  )}
                </div>
                
                <div className={`${POST_TYPES[previewPost.type]?.color || POST_TYPES.other.color} ml-auto px-3 py-1 rounded-full text-sm flex items-center gap-1.5`}>
                  {POST_TYPES[previewPost.type]?.icon || POST_TYPES.other.icon}
                  {POST_TYPES[previewPost.type]?.label || "Other"}
                </div>
              </div>
              
              <div className="mb-4 whitespace-pre-wrap">{previewPost.content}</div>
              
              {previewPost.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img src={previewPost.image} alt="Post attachment" className="w-full max-h-80 object-contain" />
                </div>
              )}
              
              {/* Display type-specific details */}
              {previewPost.type === 'job' && previewPost.jobDetails && (
                <div className={`${POST_TYPES.job.detailsColor} p-4 rounded-lg border mb-4`}>
                  <h5 className={`${POST_TYPES.job.titleColor} font-bold mb-2`}>Job Details</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Company:</p>
                      <p className="text-sm">{previewPost.jobDetails.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Title:</p>
                      <p className="text-sm">{previewPost.jobDetails.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location:</p>
                      <p className="text-sm">{previewPost.jobDetails.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Employment Type:</p>
                      <p className="text-sm">{previewPost.jobDetails.employmentType}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {previewPost.type === 'internship' && previewPost.internshipDetails && (
                <div className={`${POST_TYPES.internship.detailsColor} p-4 rounded-lg border mb-4`}>
                  <h5 className={`${POST_TYPES.internship.titleColor} font-bold mb-2`}>Internship Details</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Company:</p>
                      <p className="text-sm">{previewPost.internshipDetails.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Title:</p>
                      <p className="text-sm">{previewPost.internshipDetails.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Duration:</p>
                      <p className="text-sm">{previewPost.internshipDetails.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Paid:</p>
                      <p className="text-sm">{previewPost.internshipDetails.isPaid ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {previewPost.type === 'event' && previewPost.eventDetails && (
                <div className={`${POST_TYPES.event.detailsColor} p-4 rounded-lg border mb-4`}>
                  <h5 className={`${POST_TYPES.event.titleColor} font-bold mb-2`}>Event Details</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Event Name:</p>
                      <p className="text-sm">{previewPost.eventDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date:</p>
                      <p className="text-sm">{new Date(previewPost.eventDetails.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location:</p>
                      <p className="text-sm">{previewPost.eventDetails.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Type:</p>
                      <p className="text-sm">{previewPost.eventDetails.eventType}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                <h5 className="font-bold text-red-700 mb-2">Rejection Details</h5>
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
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleRestorePost(previewPost._id);
                    setShowPreviewModal(false);
                  }}
                  disabled={processing}
                  className="px-4 py-2 bg-[#fe6019] text-white rounded-md hover:bg-[#e55a17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {processing ? <Loader className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  Restore to Pending
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RejectedPosts;