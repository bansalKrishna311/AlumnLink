// filepath: c:\Users\bansa\OneDrive\Desktop\AlumnLink\user\client\src\components\UserPostsSection.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Post from "./Post";
import { Bookmark, Filter, MessageCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserPostsSection = ({ username, isOwnProfile }) => {
  const [selectedType, setSelectedType] = useState("all");
  const navigate = useNavigate();

  
  // Fetch user's posts
  const { data: userPosts, isLoading } = useQuery({
    queryKey: ["userPosts", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/user/${username}`);
      return res.data;
    },
  });

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const filteredPosts =
    selectedType === "all"
      ? userPosts
      : userPosts?.filter((post) => post.type === selectedType);

  // Always display only the latest post in profile
  const displayedPosts = filteredPosts?.length > 0 ? [filteredPosts[0]] : [];

  const postTypes = [
    { id: "all", label: "All" },
    { id: "discussion", label: "Discussion" },
    { id: "job", label: "Job" },
    { id: "internship", label: "Internship" },
    { id: "event", label: "Event" },
    { id: "personal", label: "Personal" },
    { id: "other", label: "Other" },
  ];

  const goToSavedPosts = () => {
    navigate("/saved-posts");
  };

  const goToUserPosts = () => {
    navigate(`/profile/${username}/posts`);
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6 p-4 md:p-6">
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

      <motion.div 
        className="flex space-x-2 mb-4 overflow-x-auto py-2 scrollbar-hide"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Filter size={16} className="text-gray-500 mr-1 mt-2" />
        {postTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTypeChange(type.id)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 whitespace-nowrap
              ${selectedType === type.id 
                ? 'bg-[#fe6019] text-white shadow-sm' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            {type.label}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <div className="animate-pulse space-y-4 w-full">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-40 w-full" />
              ))}
            </div>
          </motion.div>
        ) : filteredPosts?.length ? (
          <motion.div layout className="space-y-4">
            {displayedPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Post post={post} />
              </motion.div>
            ))}
            
            {filteredPosts.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-4"
              >
                <button
                  onClick={goToUserPosts}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <span>View All Posts ({filteredPosts.length})</span>
                  <ChevronRight className="ml-1" size={16} />
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
    </div>
  );
};

export default UserPostsSection;