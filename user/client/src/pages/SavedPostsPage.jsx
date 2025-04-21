// filepath: c:\Users\bansa\OneDrive\Desktop\AlumnLink\user\client\src\pages\SavedPostsPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../lib/axios";
import { ArrowLeft, Bookmark, Filter } from 'lucide-react';
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import { AppSidebar } from "../components/app-sidebar";

const SavedPostsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [selectedType, setSelectedType] = useState("all");
  
  // Check if the logged in user is an admin
  const isAdmin = authUser?.isAdmin || authUser?.role === 'admin';
  
  // Check if we're in the admin routes (the path contains /admin/)
  const isAdminRoute = location.pathname.startsWith('/admin');

  const { data: savedPosts, isLoading } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/bookmarked");
      return res.data;
    },
  });

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const filteredPosts =
    selectedType === "all"
      ? savedPosts
      : savedPosts?.filter((post) => post.type === selectedType);

  const postTypes = [
    { id: "all", label: "All" },
    { id: "discussion", label: "Discussion" },
    { id: "job", label: "Job" },
    { id: "internship", label: "Internship" },
    { id: "event", label: "Event" },
    { id: "personal", label: "Personal" },
    { id: "other", label: "Other" },
  ];
  
  // The content to be rendered with or without the sidebar
  const Content = () => (
    <div className="space-y-6 w-full">
      <motion.div 
        className="flex items-center space-x-2 mb-4 overflow-x-auto py-2 scrollbar-hide bg-white p-3 rounded-lg shadow-sm"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Filter size={16} className="text-gray-500 mr-2 ml-1" />
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {postTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTypeChange(type.id)}
            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 whitespace-nowrap
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
          <motion.div layout className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-6"
            >
              <Bookmark size={64} className="mx-auto text-[#fe6019]" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-4 text-gray-800"
            >
              No Saved Posts Yet
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Posts you save will appear here. Click the three-dot menu on any post and select "Save Post" to add it to your collection.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // If this is being rendered within an admin layout, just return the content
  // without the wrapper layout (the AdminLayout will provide the structure)
  if (isAdmin && !location.pathname.includes('/saved-posts')) {
    return <Content />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="p-4">
        <h1 className="text-xl font-bold text-[#fe6019] flex items-center mb-4">
          <Bookmark size={20} className="mr-2" /> Saved Posts
        </h1>
        <Content />
      </div>
    </motion.div>
  );
};

export default SavedPostsPage;