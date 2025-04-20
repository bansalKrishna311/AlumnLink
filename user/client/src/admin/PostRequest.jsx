import { useState } from "react";
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
  User
} from "lucide-react";
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

// Types that appear in the filter UI (based on post.model.js)
const ACTIVE_FILTER_TYPES = ['all', 'discussion', 'event', 'job', 'internship', 'personal', 'other'];

const PostRequests = () => {
  const [selectedType, setSelectedType] = useState("all");
  const queryClient = useQueryClient();

  // Fetch pending posts
  const { data: pendingPosts, isLoading } = useQuery({
    queryKey: ["pendingPosts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts/admin/pending");
        return res.data;
      } catch (err) {
        // Return empty array instead of showing error for 404
        if (err.response && err.response.status === 404) {
          return [];
        }
        throw err;
      }
    }
  });

  const updatePostStatus = useMutation({
    mutationFn: async ({ postId, status }) => {
      const res = await axiosInstance.patch(`/posts/admin/${postId}/status`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["pendingPosts"]);
      toast.success(`Post ${variables.status === "approved" ? "approved" : "rejected"} successfully!`);
    },
    onError: (error) => {
      console.error("Error updating post status:", error);
      toast.error("Error updating post status. Please try again.");
    }
  });

  const handleStatusUpdate = (postId, status) => {
    updatePostStatus.mutate({ postId, status });
  };

  // Get type configuration or default if type doesn't exist
  const getPostTypeConfig = (type) => {
    return POST_TYPES[type] || POST_TYPES.other;
  };

  const filteredPosts = pendingPosts?.filter(post => 
    selectedType === "all" || post.type === selectedType
  ) || [];

  // Dynamically render post details based on type
  const renderPostDetails = (post) => {
    const typeConfig = getPostTypeConfig(post.type);
    
    switch(post.type) {
      case "job":
        return (
          <div className={`mb-4 p-4 rounded-lg border ${typeConfig.detailsColor}`}>
            <h4 className={`font-medium mb-2 flex items-center ${typeConfig.titleColor}`}>
              {typeConfig.icon}
              <span className="ml-2">Job Details</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Company:</span> {post.jobDetails.companyName}
              </div>
              <div>
                <span className="font-medium text-gray-600">Title:</span> {post.jobDetails.jobTitle}
              </div>
              <div>
                <span className="font-medium text-gray-600">Location:</span> {post.jobDetails.jobLocation}
              </div>
            </div>
          </div>
        );
        
      case "internship":
        return (
          <div className={`mb-4 p-4 rounded-lg border ${typeConfig.detailsColor}`}>
            <h4 className={`font-medium mb-2 flex items-center ${typeConfig.titleColor}`}>
              {typeConfig.icon}
              <span className="ml-2">Internship Details</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Company:</span> {post.internshipDetails.companyName}
              </div>
              <div>
                <span className="font-medium text-gray-600">Duration:</span> {post.internshipDetails.internshipDuration}
              </div>
            </div>
          </div>
        );
        
      case "event":
        return (
          <div className={`mb-4 p-4 rounded-lg border ${typeConfig.detailsColor}`}>
            <h4 className={`font-medium mb-2 flex items-center ${typeConfig.titleColor}`}>
              {typeConfig.icon}
              <span className="ml-2">Event Details</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Event:</span> {post.eventDetails.eventName}
              </div>
              <div>
                <span className="font-medium text-gray-600">Date:</span> {post.eventDetails.eventDate && new Date(post.eventDetails.eventDate).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div>
                <span className="font-medium text-gray-600">Location:</span> {post.eventDetails.eventLocation}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-[#fe6019]" />
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
          <p>Posts requiring your review are shown below. Approved posts will be visible to all users immediately.</p>
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
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredPosts.map((post, index) => {
              const typeConfig = getPostTypeConfig(post.type);
              
              return (
                <motion.div 
                  key={post._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author.profilePicture || "/avatar.png"}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full border border-gray-200"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{post.author.name}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${typeConfig.color}`}>
                      {typeConfig.icon}
                      <span className="capitalize ml-1">{typeConfig.label}</span>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                    )}

                    {/* Render type-specific details */}
                    {renderPostDetails(post)}
                    
                    <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleStatusUpdate(post._id, "approved")}
                        className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium flex items-center shadow-sm hover:shadow-md transition-all duration-200"
                        disabled={updatePostStatus.isPending}
                      >
                        {updatePostStatus.isPending ? 
                          <Loader size={18} className="animate-spin mr-2" /> : 
                          <Check size={18} className="mr-2" />
                        }
                        Approve Post
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleStatusUpdate(post._id, "rejected")}
                        className="px-5 py-2.5 bg-white border border-red-500 text-red-500 rounded-lg font-medium flex items-center hover:bg-red-50 transition-colors"
                        disabled={updatePostStatus.isPending}
                      >
                        <X size={18} className="mr-2" />
                        Reject Post
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostRequests;
