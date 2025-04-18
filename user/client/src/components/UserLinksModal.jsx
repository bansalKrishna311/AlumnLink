<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======
import React, { useEffect, useState, useCallback } from "react";
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7
import { axiosInstance } from "@/lib/axios";
import { 
  Loader2, UserCircle2, Search, MapPin, Briefcase, 
  GraduationCap, Code, MessageCircle, Filter, 
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
=======
import Doodles from "@/pages/auth/components/Doodles";
import { debounce } from "lodash";
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7

const UserLinksPage = () => {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [sortBy, setSortBy] = useState("name"); // Default sort by name
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending
  const navigate = useNavigate();

  // Debounced search function to prevent excessive API calls
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setPage(1); // Reset to first page on new search
    }, 400),
    []
  );

  useEffect(() => {
    if (userId) {
      fetchUserLinks();
    }
  }, [userId, page, itemsPerPage, sortBy, sortOrder]);

  const fetchUserLinks = async () => {
    try {
<<<<<<< HEAD
      const response = await axiosInstance.get(`/links/${userId}`);
=======
      setIsLoading(true);
      const response = await axiosInstance.get(`/links/${userId}`, {
        params: {
          page,
          limit: itemsPerPage,
          sortBy,
          sortOrder
        }
      });
      
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7
      console.log("API Response:", response.data);
      setLinks(response.data || []);
      
      // Extract unique values for filters
      extractFilterOptions(response.data);
      
      // Calculate total pages if pagination info is available
      if (response.headers && response.headers["x-total-count"]) {
        const totalCount = parseInt(response.headers["x-total-count"]);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        // If server doesn't provide count, estimate based on results
        setTotalPages(response.data.length < itemsPerPage ? 1 : page + 1);
      }
    } catch (error) {
      console.error("Failed to fetch user links:", error);
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const filteredLinks = links.filter((link) => {
    const searchTerm = searchQuery.toLowerCase();
    const name = (link.name || "").toLowerCase();
    const username = (link.username || "").toLowerCase();
    const locationMatch = !selectedLocation || link.location === selectedLocation;

    return (name.includes(searchTerm) || username.includes(searchTerm)) && locationMatch;
=======
  const extractFilterOptions = (data) => {
    // Extract unique skills
    const skills = [...new Set(data
      .flatMap(link => link.skills || [])
    )];
    
    setAvailableSkills(skills);
  };

  const handleMessage = (e, username) => {
    e.stopPropagation(); // Prevent card click event from firing
    navigate(`/comingsoon`); // Redirect to coming soon page instead of messages
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0); // Scroll to top when changing pages
    }
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const resetFilters = () => {
    setSelectedLocation("");
    setSelectedSkill("");
    setSearchQuery("");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // If already sorting by this field, toggle order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, sort by the new field in ascending order
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1); // Reset to first page
  };

  const filteredLinks = links.filter((link) => {
    const searchTerm = searchQuery.toLowerCase();
    const name = (link.name || "").toLowerCase();
    const username = (link.username || "").toLowerCase();
    const locationMatch = !selectedLocation || link.location === selectedLocation;
    const skillMatch = !selectedSkill || (link.skills && link.skills.includes(selectedSkill));

    return (
      (name.includes(searchTerm) || username.includes(searchTerm)) && 
      locationMatch && 
      skillMatch
    );
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7
  });

  const locations = [
    "Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai", 
    "Delhi NCR", "Kolkata", "Ahmedabad", "Jaipur", 
    "Thiruvananthapuram", "Lucknow", "Indore", "Chandigarh", "Nagpur"
  ];

<<<<<<< HEAD
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
=======
  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Doodle Background Pattern */}
      <Doodles/>

      <div className="relative max-w-4xl mx-auto p-6 space-y-6">
        {/* Search and Basic Filters */}
        <div className="flex flex-col space-y-4 backdrop-blur-sm bg-white/30 p-3 sm:p-4 rounded-xl border border-orange-100 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            <div className="relative w-full md:max-w-[70%]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#fe6019]" />
                <Input
                  type="text"
                  placeholder="Search by name or username..."
                  onChange={handleSearchChange}
                  className="pl-10 w-full border-orange-200 focus:border-[#fe6019] focus:ring-[#fe6019] bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
                />
              </div>
            </div>
            
            <button
              onClick={toggleFilters}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-[#fe6019] text-white rounded-md hover:bg-[#e54e0e] transition-colors text-sm"
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">{filtersVisible ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>
          
          {/* Expanded Filters Section */}
          {filtersVisible && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-orange-100">
              {/* Location Filter */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-[#fe6019]" />
                  Chapter Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-2 py-1 sm:px-3 sm:py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe6019] bg-white/50 backdrop-blur-sm transition-all duration-300 text-xs sm:text-sm"
                >
                  <option value="">All Chapters</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Skills Filter */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                  <Code className="h-3 w-3 sm:h-4 sm:w-4 text-[#fe6019]" />
                  Skills
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="px-2 py-1 sm:px-3 sm:py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe6019] bg-white/50 backdrop-blur-sm transition-all duration-300 text-xs sm:text-sm"
                >
                  <option value="">All Skills</option>
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort By */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Sort By</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-2 py-1 sm:px-3 sm:py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe6019] bg-white/50 backdrop-blur-sm transition-all duration-300 text-xs sm:text-sm"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="createdAt-desc">Recently Connected</option>
                </select>
              </div>
              
              {/* Items Per Page */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Items Per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setPage(1); // Reset to first page when changing items per page
                  }}
                  className="px-2 py-1 sm:px-3 sm:py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe6019] bg-white/50 backdrop-blur-sm transition-all duration-300 text-xs sm:text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              {/* Reset Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results section with filter summary */}
        <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-orange-100 text-sm text-gray-600">
          {filteredLinks.length > 0 ? (
            <p>
              Showing {filteredLinks.length} connection{filteredLinks.length !== 1 ? 's' : ''}
              {(selectedLocation || selectedSkill || searchQuery) && ' • Filtered by: '}
              {selectedLocation && <span className="mx-1 bg-orange-100 text-[#fe6019] px-2 py-1 rounded-full">{selectedLocation}</span>}
              {selectedSkill && <span className="mx-1 bg-orange-100 text-[#fe6019] px-2 py-1 rounded-full">{selectedSkill}</span>}
              {searchQuery && <span className="mx-1 bg-orange-100 text-[#fe6019] px-2 py-1 rounded-full">"{searchQuery}"</span>}
            </p>
          ) : !isLoading && (
            <p>No connections match your filters</p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-[#fe6019]" />
          </div>
        ) : filteredLinks.length > 0 ? (
          <div className="grid gap-4">
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7
            {filteredLinks.map((link) => (
              <motion.div
                key={link._id}
<<<<<<< HEAD
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
=======
                className="group bg-white/70 backdrop-blur-sm p-3 sm:p-5 rounded-xl border border-orange-100 hover:border-[#fe6019] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-orange-100/50 transform hover:-translate-y-1"
                onClick={() => navigate(`/profile/${link.username}`)}
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-center space-x-3 sm:space-x-4">
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7
                      {link.profilePicture ? (
                        <img
                          src={link.profilePicture}
                          alt={link.name || "Unknown User"}
<<<<<<< HEAD
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
=======
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-orange-100 group-hover:border-[#fe6019] transition-colors object-cover"
                        />
                      ) : (
                        <UserCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-[#fe6019]" />
                      )}
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg text-gray-800 group-hover:text-[#fe6019] transition-colors">
                          {link.name || "Unknown User"}
                        </h3>
                        <p className="text-gray-600">@{link.username || "unknown"}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {link.location && (
                            <p className="text-gray-500 flex items-center space-x-1 text-sm">
                              <MapPin className="h-3 w-3 text-[#fe6019]" />
                              <span>{link.location}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => handleMessage(e, link.username)}
                      className="bg-[#fe6019] hover:bg-[#e54e0e] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                  </div>
                  
                  {/* Skills Section */}
                  {link.skills && link.skills.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Code className="h-4 w-4 text-[#fe6019]" />
                        <span className="font-medium">Skills:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {link.skills.slice(0, 3).map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="bg-orange-50 text-[#fe6019] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {link.skills.length > 3 && (
                          <span 
                            className="bg-orange-50 text-[#fe6019] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm"
                          >
                            +{link.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Education and Experience in side-by-side layout on larger screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    {/* Education Section (Collapsed) */}
                    {link.education && link.education.length > 0 && (
                      <div className="mt-1">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <GraduationCap className="h-4 w-4 text-[#fe6019]" />
                          <span className="font-medium">Education:</span>
                        </div>
                        <div className="mt-1">
                          <div className="text-xs sm:text-sm text-gray-700">
                            <p className="font-medium truncate">{link.education[0].school} • {link.education[0].degree}</p>
                            {link.education.length > 1 && (
                              <p className="text-xs text-gray-500">+{link.education.length - 1} more</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Experience Section (Collapsed) */}
                    {link.experience && link.experience.length > 0 && (
                      <div className="mt-1">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Briefcase className="h-4 w-4 text-[#fe6019]" />
                          <span className="font-medium">Experience:</span>
                        </div>
                        <div className="mt-1">
                          <div className="text-xs sm:text-sm text-gray-700">
                            <p className="font-medium truncate">{link.experience[0].title} • {link.experience[0].company}</p>
                            {link.experience.length > 1 && (
                              <p className="text-xs text-gray-500">+{link.experience.length - 1} more</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7
                  </div>
                </div>
              </motion.div>
            ))}
<<<<<<< HEAD
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
=======
          </div>
        ) : (
          <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl border border-orange-100">
            <UserCircle2 className="mx-auto h-16 w-16 text-[#fe6019]" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              {searchQuery || selectedLocation || selectedSkill ? "No matches found" : "No connections yet"}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchQuery || selectedLocation || selectedSkill
                ? "Try adjusting your search terms or filters"
                : "Start connecting with other users to build your network."}
            </p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!isLoading && filteredLinks.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between mt-6 bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-orange-100">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#fe6019] hover:bg-orange-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            
            <div className="flex items-center space-x-1">
              {totalPages > 0 && (
                <span className="text-xs text-gray-500 mr-2 sm:hidden">
                  Page {page} of {totalPages}
                </span>
              )}

              {/* Only show pagination numbers on larger screens */}
              <div className="hidden sm:flex items-center space-x-1">
                {[...Array(totalPages)].map((_, idx) => (
                  // Only show at most 5 page numbers
                  (totalPages <= 5 || 
                   idx === 0 || 
                   idx === totalPages - 1 || 
                   (idx >= page - 2 && idx <= page)) && (
                    <React.Fragment key={idx}>
                      {totalPages > 5 && idx === totalPages - 1 && page < totalPages - 2 && (
                        <span className="px-2">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(idx + 1)}
                        className={`h-8 w-8 rounded-md flex items-center justify-center ${
                          page === idx + 1
                            ? "bg-[#fe6019] text-white"
                            : "text-gray-700 hover:bg-orange-50"
                        }`}
                      >
                        {idx + 1}
                      </button>
                      {totalPages > 5 && idx === 0 && page > 3 && (
                        <span className="px-2">...</span>
                      )}
                    </React.Fragment>
                  )
                ))}
              </div>
            </div>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                page === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#fe6019] hover:bg-orange-50"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>  
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7
  );
};

export default UserLinksPage;
