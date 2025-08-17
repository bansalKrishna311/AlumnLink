import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Post from "@/components/Post";
import { Filter, ArrowLeft, Bookmark } from "lucide-react";

const UserPostsPage = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [selectedType, setSelectedType] = useState("all");

  // Fetch auth user to compare with profile being viewed
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  // Determine if this is the user's own profile
  const isOwnProfile = authUser?.username === username;

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

  const goToSavedPosts = () => {
    navigate("/saved-posts");
  };

  const filteredPosts =
    selectedType === "all"
      ? userPosts
      : userPosts?.filter((post) => post.type === selectedType);

  const postTypes = [
    { id: "all", label: "All" },
    { id: "discussion", label: "Discussion" },
    { id: "job", label: "Job" },
    { id: "internship", label: "Internship" },
    { id: "event", label: "Event" },
    { id: "personal", label: "Personal" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg mb-6 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <Link to={`/profile/${username}`} className="flex items-center text-gray-600 hover:text-[#fe6019] transition-colors mr-4">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Profile</span>
          </Link>
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
          className="flex space-x-2 mb-6 overflow-x-auto py-2 scrollbar-hide"
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
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-40 w-full" />
                ))}
              </div>
            </motion.div>
          ) : filteredPosts?.length ? (
            <motion.div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Post post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-50 rounded-lg p-8 text-center"
            >
              <p className="text-gray-600">No posts found.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserPostsPage;