// filepath: c:\Users\bansa\OneDrive\Desktop\AlumnLink\user\client\src\components\UserPostsSection.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Post from "./Post";
import { Bookmark, MessageCircle, ChevronRight, Heart, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const UserPostsSection = ({ username, isOwnProfile }) => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch user's posts
  const { data: userPosts, isLoading } = useQuery({
    queryKey: ["userPosts", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/user/${username}`);
      return res.data;
    },
  });

  // Show up to 4 posts in carousel
  const displayedPosts = userPosts?.slice(0, 4) || [];

  const goToSavedPosts = () => {
    navigate("/saved-posts");
  };

  const goToUserPosts = () => {
    navigate(`/profile/${username}/posts`);
  };

  const openPostModal = (post) => {
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  const scrollLeft = () => {
    const container = document.getElementById('posts-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('posts-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const getPostTypeColor = (type) => {
    const colors = {
      job: "bg-blue-100 text-blue-700",
      internship: "bg-green-100 text-green-700", 
      event: "bg-orange-100 text-orange-700",
      discussion: "bg-purple-100 text-purple-700",
      personal: "bg-pink-100 text-pink-700",
      other: "bg-gray-100 text-gray-700"
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg mb-6 p-4 md:p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0 flex items-center">
          <MessageCircle className="mr-2 text-[#fe6019]" size={20} />
          {isOwnProfile ? "My Posts" : `${username}'s Posts`}
        </h2>
        
        {isOwnProfile && (
          <button
            onClick={goToSavedPosts}
            className="flex items-center px-4 py-2 bg-[#fe6019]/10 text-[#fe6019] rounded-md hover:bg-[#fe6019]/20 transition-colors"
          >
            <Bookmark size={16} className="mr-2" />
            <span>View Saved Posts</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-48 w-full" />
                ))}
              </div>
            </div>
          </motion.div>
        ) : userPosts?.length ? (
          <motion.div layout className="space-y-4">
            {/* Posts Carousel */}
            <div className="relative overflow-hidden bg-gray-50/30 rounded-xl p-4">
              {/* Left Arrow */}
              {displayedPosts.length > 1 && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
              )}
              
              {/* Right Arrow */}
              {displayedPosts.length > 1 && (
                <button
                  onClick={scrollRight}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              )}
              
              <div id="posts-container" className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {displayedPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-64 md:w-72 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => openPostModal(post)}
                  >
                    {/* Post Type Badge */}
                    <div className="p-3 pb-2">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPostTypeColor(post.type)}`}>
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </span>
                    </div>

                    {/* Post Content Preview */}
                    <div className="px-3 pb-3">
                      <div className="flex items-center mb-2">
                        <img
                          src={post.author?.profilePicture || "/avatar.png"}
                          alt={post.author?.name}
                          className="w-8 h-8 rounded-full mr-2 border border-gray-200 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {post.author?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 line-clamp-3 group-hover:text-gray-900 transition-colors">
                          {post.content}
                        </p>
                      </div>

                      {/* Post Image Preview */}
                      {(post.images && post.images.length > 0) ? (
                        <div className="mb-3 relative">
                          <img
                            src={post.images[0]}
                            alt="Post content"
                            className="w-full h-32 object-cover rounded-md border border-gray-200"
                          />
                          {post.images.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              +{post.images.length - 1}
                            </div>
                          )}
                        </div>
                      ) : post.image ? (
                        <div className="mb-3">
                          <img
                            src={post.image}
                            alt="Post content"
                            className="w-full h-32 object-cover rounded-md border border-gray-200"
                          />
                        </div>
                      ) : null}

                      {/* Post Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Heart size={12} className="mr-1" />
                            {post.reactions?.length || 0}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle size={12} className="mr-1" />
                            {post.comments?.length || 0}
                          </span>
                        </div>
                       
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Horizontal Line */}
            {userPosts.length > 0 && (
              <div className="w-full border-t border-gray-200 my-6"></div>
            )}
            
            {/* Show All Posts Button */}
            {userPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-6"
              >
                <button
                  onClick={goToUserPosts}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-[#fe6019] to-[#fe6019]/80 text-white rounded-lg hover:from-[#fe6019]/90 hover:to-[#fe6019]/70 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="font-medium">Show all posts</span>
                  <ChevronRight className="ml-2" size={18} />
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-50 rounded-lg p-8 text-center"
          >
            <p className="text-gray-600">
              {isOwnProfile 
                ? "You haven't created any posts yet."
                : `${username} hasn't created any posts yet.`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePostModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Post Details</h3>
              <button
                onClick={closePostModal}
                className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
              >
                ×
              </button>
            </div>
            <div className="p-0">
              <Post post={selectedPost} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserPostsSection;