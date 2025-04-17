import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  UserCircle2, 
  Search, 
  MapPin, 
  Filter, 
  Users, 
  ArrowRight, 
  X,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";

const UserLinksPage = () => {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserLinks();
    }
  }, [userId]);

  const fetchUserLinks = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/links/${userId}`);
      console.log("API Response:", response.data);
      setLinks(response.data || []);
    } catch (error) {
      console.error("Failed to fetch user links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated filter logic to include both search query and location
  const filteredLinks = links.filter((link) => {
    const searchTerm = searchQuery.toLowerCase();
    const name = (link.name || "").toLowerCase();
    const username = (link.username || "").toLowerCase();
    const locationMatch = !selectedLocation || link.location === selectedLocation;
    
    return (name.includes(searchTerm) || username.includes(searchTerm)) && locationMatch;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
  };

  const locations = [
    "Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai", 
    "Delhi NCR", "Kolkata", "Ahmedabad", "Jaipur", 
    "Thiruvananthapuram", "Lucknow", "Indore", "Chandigarh", "Nagpur"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Connections</h1>
          <p className="text-gray-500 mt-1">Discover and manage your network</p>
        </div>
        <div className="flex items-center space-x-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-50 p-2 rounded-full flex items-center justify-center"
          >
            <Users className="w-5 h-5 text-blue-600" />
          </motion.div>
          <span className="font-medium">{links.length} Connections</span>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div 
        className="bg-white rounded-xl shadow-md p-4"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search connections by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {searchQuery && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </motion.button>
            )}
          </div>
          
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center space-x-2 px-5 py-3 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-100"
                >
                  <div className="p-4">
                    <h3 className="font-medium text-gray-700 mb-3">Filter by Chapter</h3>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Chapters</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    
                    <div className="mt-4 flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFilters}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear filters
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFilterOpen(false)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Apply
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active filters display */}
        {(searchQuery || selectedLocation) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100"
          >
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
              >
                Search: {searchQuery}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSearchQuery("")}
                />
              </motion.span>
            )}
            {selectedLocation && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 bg-purple-50 text-purple-700 text-sm px-3 py-1 rounded-full"
              >
                Chapter: {selectedLocation}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedLocation("")}
                />
              </motion.span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Results Area */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 text-blue-500" />
          </motion.div>
        </div>
      ) : filteredLinks.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filteredLinks.map((link) => (
            <motion.div
              key={link._id}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer transition-all"
              onClick={() => navigate(`/profile/${link.username}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {link.profilePicture ? (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={link.profilePicture}
                      alt={link.name || "Unknown User"}
                      className="w-14 h-14 rounded-full border-2 border-blue-100 object-cover"
                    />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
                    >
                      <UserCircle2 className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{link.name || "Unknown User"}</h3>
                    <p className="text-gray-500">@{link.username || "unknown"}</p>
                    {link.location && (
                      <p className="text-gray-400 flex items-center mt-1 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{link.location}</span>
                      </p>
                    )}
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 3 }}
                  className="text-blue-500"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4"
          >
            <UserCircle2 className="h-10 w-10 text-gray-400" />
          </motion.div>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            {searchQuery || selectedLocation ? "No matches found" : "No connections yet"}
          </h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {searchQuery || selectedLocation
              ? "Try adjusting your search terms or filters to find what you're looking for."
              : "Start connecting with other users to build your network and expand your community."}
          </p>
          {(searchQuery || selectedLocation) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="mt-6 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
            >
              Clear all filters
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserLinksPage;