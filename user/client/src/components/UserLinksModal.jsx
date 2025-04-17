import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2, UserCircle2, Search, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const UserLinksPage = () => {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserLinks();
    }
  }, [userId]);

  const fetchUserLinks = async () => {
    try {
      const response = await axiosInstance.get(`/links/${userId}`);
      console.log("API Response:", response.data);
      setLinks(response.data || []);
    } catch (error) {
      console.error("Failed to fetch user links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLinks = links.filter((link) => {
    const searchTerm = searchQuery.toLowerCase();
    const name = (link.name || "").toLowerCase();
    const username = (link.username || "").toLowerCase();
    const locationMatch = !selectedLocation || link.location === selectedLocation;

    return (name.includes(searchTerm) || username.includes(searchTerm)) && locationMatch;
  });

  const locations = [
    "Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai",
    "Delhi NCR", "Kolkata", "Ahmedabad", "Jaipur",
    "Thiruvananthapuram", "Lucknow", "Indore", "Chandigarh", "Nagpur"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 space-y-6"
    >
      {/* Search and Filter Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center gap-4 backdrop-blur-md bg-white/80 p-4 rounded-xl shadow-lg sticky top-4 z-10"
      >
        <div className="relative w-full max-w-[70%]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-transparent border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-300"
            />
          </div>
        </div>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent transition-all duration-300"
        >
          <option value="">All Chapters</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex justify-center items-center h-40"
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </motion.div>
      ) : filteredLinks.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          <AnimatePresence>
            {filteredLinks.map((link) => (
              <motion.div
                key={link._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform cursor-pointer backdrop-blur-sm bg-white/90"
                onClick={() => navigate(`/profile/${link.username}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      {link.profilePicture ? (
                        <img
                          src={link.profilePicture}
                          alt={link.name || "Unknown User"}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2"
                        />
                      ) : (
                        <UserCircle2 className="w-14 h-14 text-gray-400" />
                      )}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-blue-500/20"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{link.name || "Unknown User"}</h3>
                      <p className="text-blue-600 font-medium">@{link.username || "unknown"}</p>
                      {link.location && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-gray-500 flex items-center space-x-2 mt-1"
                        >
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{link.location}</span>
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-inner"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <UserCircle2 className="mx-auto h-16 w-16 text-blue-400" />
          </motion.div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            {searchQuery || selectedLocation ? "No matches found" : "No connections yet"}
          </h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {searchQuery || selectedLocation
              ? "Try adjusting your search terms or filters"
              : "Start connecting with other users to build your network."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserLinksPage;
