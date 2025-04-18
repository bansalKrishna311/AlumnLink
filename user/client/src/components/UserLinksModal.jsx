import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2, UserCircle2, Search, MapPin, X, MessageSquare, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Doodles from "@/pages/auth/components/Doodles";

const UserLinksPage = () => {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skills: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserLinks();
    }
  }, [userId]);

  const fetchUserLinks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/links/${userId}`);
      const linksData = response.data || [];
      
      // Fetch complete user data for each link
      const completeLinksData = await Promise.all(
        linksData.map(async (link) => {
          try {
            const userResponse = await axiosInstance.get(`/users/${link._id}`);
            return userResponse.data;
          } catch (error) {
            console.error(`Failed to fetch user data for ${link._id}:`, error);
            return link; // Return original link data if user fetch fails
          }
        })
      );
      
      setLinks(completeLinksData);
    } catch (error) {
      console.error("Failed to fetch user links:", error);
      setError(error?.message || "Failed to fetch user links");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        link.name?.toLowerCase().includes(searchTerm) ||
        link.username?.toLowerCase().includes(searchTerm) ||
        link.headline?.toLowerCase().includes(searchTerm);

      const matchesLocation = !filters.location || 
        link.location === filters.location;

      const matchesSkills = !filters.skills || (
        link.skills && 
        link.skills.some(skill => 
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );

      return matchesSearch && matchesLocation && matchesSkills;
    });
  }, [links, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      skills: ""
    });
  };

  const locations = [
    "Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai",
    "Delhi NCR", "Kolkata", "Ahmedabad", "Jaipur",
    "Thiruvananthapuram", "Lucknow", "Indore", "Chandigarh", "Nagpur"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8 px-4 bg-gradient-to-br from-white to-orange-50"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Doodle Background */}
        <Doodles />

        {/* Header section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Connections</h2>
          <p className="text-gray-500">Explore and connect with your professional network</p>
        </div>

        {/* Streamlined Search and Filter Bar */}
        {!isLoading && links.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 backdrop-blur-xl bg-white/90 p-6 rounded-3xl shadow-lg sticky top-4 z-10 border border-orange-100"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#fe6019]" />
              <Input
                type="text"
                placeholder="Search by name, username, or headline..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 w-full bg-transparent border-2 border-orange-200 focus:border-[#fe6019] rounded-xl h-12 text-base transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#fe6019]" />
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="pl-10 w-full h-12 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-[#fe6019] bg-white text-gray-900"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Skills Filter */}
              <div className="relative">
                <CheckCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#fe6019]" />
                <Input
                  type="text"
                  placeholder="Filter by skills..."
                  value={filters.skills}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                  className="pl-10 h-12 w-full border-2 border-orange-200 rounded-xl focus:outline-none focus:border-[#fe6019] bg-white text-gray-900"
                />
              </div>

              {/* Clear Filters Button */}
              {(filters.search || filters.location || filters.skills) && (
                <button
                  onClick={clearFilters}
                  className="h-12 px-6 bg-orange-100 text-[#fe6019] rounded-xl hover:bg-orange-200 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Results count */}
        {!isLoading && (
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{filteredLinks.length}</span> of <span className="font-medium text-gray-700">{links.length}</span> connections
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 my-4 animate-fadeIn">
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={fetchUserLinks}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-60 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
            <p className="text-gray-500">Loading your connections...</p>
          </div>
        ) : filteredLinks.length > 0 ? (
          <div className="grid gap-6">
            {filteredLinks.map((link) => (
              <motion.div
                key={link._id}
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/profile/${link.username}`)}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Profile Info */}
                  <div className="flex items-center space-x-4">
                    {link.profilePicture ? (
                      <div className="w-16 h-16 rounded-full border-2 border-orange-200 group-hover:border-orange-400 overflow-hidden transition-all">
                        <img
                          src={link.profilePicture}
                          alt={link.name || "Unknown User"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-200 group-hover:border-orange-400 flex items-center justify-center transition-all">
                        <UserCircle2 className="w-10 h-10 text-orange-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-xl text-gray-800 group-hover:text-orange-600 transition-colors">{link.name || "Unknown User"}</h3>
                      <p className="text-orange-500">@{link.username || "unknown"}</p>
                      {link.headline && (
                        <p className="text-gray-600 text-sm mt-1">{link.headline}</p>
                      )}
                      {link.location && (
                        <p className="text-gray-500 flex items-center text-sm mt-1">
                          <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                          <span>{link.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Message button for larger screens */}
                  <button className="hidden md:flex text-orange-500 hover:text-orange-600 font-medium items-center gap-1 bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-all group-hover:shadow-sm">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </button>
                </div>
                
                {/* Skills showcase - Prominently displayed */}
                {link.skills && link.skills.length > 0 && (
                  <div className="mt-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {link.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mobile message button */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end items-center md:hidden">
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1 px-3 py-1.5 bg-orange-50 rounded-full hover:bg-orange-100 transition-all">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center">
              <UserCircle2 className="h-10 w-10 text-orange-500" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900">
              {filters.search || filters.location || filters.skills ? "No matches found" : "No connections yet"}
            </h3>
            <p className="mt-3 text-gray-600 max-w-md mx-auto">
              {filters.search || filters.location || filters.skills
                ? "No connections match your current filters. Try adjusting your search criteria."
                : "Start connecting with other users to build your professional network."}
            </p>
            {(filters.search || filters.location || filters.skills) && (
              <button 
                onClick={clearFilters}
                className="mt-6 px-6 py-3 bg-orange-100 text-orange-600 rounded-lg border border-orange-200 hover:bg-orange-200 transition-colors flex items-center gap-2 mx-auto"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserLinksPage;