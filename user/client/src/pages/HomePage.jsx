import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import SelfLinks from "../components/SelfLinks";
import { Users } from 'lucide-react';

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [selectedType, setSelectedType] = useState("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const filteredPosts =
    selectedType === "all"
      ? posts
      : posts?.filter((post) => post.type === selectedType);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 max-w-8xl mx-auto"
    >
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block lg:col-span-1"
      >
        <Sidebar user={authUser} />
      </motion.div>

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none space-y-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <PostCreation user={authUser} />
        </motion.div>

        <motion.div 
          className="flex space-x-2 mb-4 overflow-x-auto py-2 scrollbar-hide"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {postTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTypeChange(type.id)}
              className={`px-4 py-2 rounded-full overflow-none transition-all duration-200 whitespace-nowrap
                ${selectedType === type.id 
                  ? 'bg-[#fe6019] text-white shadow-lg' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
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
                <Users size={64} className="mx-auto text-[#fe6019]" />
              </motion.div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-4 text-gray-800"
              >
                No Posts Yet
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                Link with others to start seeing posts in your feed!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block lg:col-span-1"
      >
        <SelfLinks />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;

