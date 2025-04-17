import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2, UserCircle2, Search, MapPin, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

// Add background doodle styles
const backgroundDoodles = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23fe6019' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  backgroundSize: "cover",
};

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
      className="min-h-screen py-8 px-4 bg-gradient-to-br from-white to-orange-50"
      style={backgroundDoodles}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Glass Header with Stats */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-orange-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#fe6019] to-orange-600 bg-clip-text text-transparent">
              Your Connections
            </h1>
            <Sparkles className="h-6 w-6 text-[#fe6019]" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-orange-50/50">
              <p className="text-2xl font-bold text-[#fe6019]">{links.length}</p>
              <p className="text-sm text-gray-600">Total Connections</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50/50">
              <p className="text-2xl font-bold text-[#fe6019]">{locations.length}</p>
              <p className="text-sm text-gray-600">Chapters</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50/50">
              <p className="text-2xl font-bold text-[#fe6019]">{filteredLinks.length}</p>
              <p className="text-sm text-gray-600">Filtered Results</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 backdrop-blur-xl bg-white/90 p-4 rounded-2xl shadow-lg sticky top-4 z-10 border border-orange-100"
        >
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#fe6019]" />
              <Input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-transparent border-2 border-orange-200 focus:border-[#fe6019] rounded-xl transition-all duration-300"
              />
            </div>
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-[#fe6019] bg-transparent transition-all duration-300"
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
            <Loader2 className="h-8 w-8 animate-spin text-[#fe6019]" />
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
                  className="bg-white/90 p-6 rounded-2xl shadow-lg border border-orange-100 hover:border-[#fe6019] transition-all duration-300 transform cursor-pointer backdrop-blur-xl hover:shadow-orange-100/50"
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
                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#fe6019] ring-offset-2"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <UserCircle2 className="w-8 h-8 text-[#fe6019]" />
                          </div>
                        )}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-[#fe6019]/20"
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
                        <h3 className="font-bold text-xl text-gray-900">{link.name || "Unknown User"}</h3>
                        <p className="text-[#fe6019] font-medium">@{link.username || "unknown"}</p>
                        {link.location && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-gray-500 flex items-center space-x-2 mt-1"
                          >
                            <MapPin className="h-4 w-4 text-[#fe6019]" />
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
            className="text-center py-12 bg-gradient-to-b from-orange-50 to-white rounded-2xl shadow-lg border border-orange-100"
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
              <UserCircle2 className="mx-auto h-16 w-16 text-[#fe6019]" />
            </motion.div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              {searchQuery || selectedLocation ? "No matches found" : "No connections yet"}
            </h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {searchQuery || selectedLocation
                ? "Try adjusting your search terms or filters"
                : "Start connecting with other users to build your network."}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserLinksPage;
