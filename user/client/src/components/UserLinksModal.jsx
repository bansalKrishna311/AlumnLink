import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2, UserCircle2, Search, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Doodles from "@/pages/auth/components/Doodles";


const UserLinksPage = () => {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
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
      setLinks(response.data || []);
    } catch (error) {
      console.error("Failed to fetch user links:", error);
      setError(error.message || "Failed to fetch user links");
    } finally {
      setIsLoading(false);
    }
  };

  // Use useMemo to prevent unnecessary re-calculation of filtered links on every render
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const searchTerm = searchQuery.toLowerCase();
      const name = (link.name || "").toLowerCase();
      const username = (link.username || "").toLowerCase();
      const locationMatch = !selectedLocation || link.location === selectedLocation;

      return (name.includes(searchTerm) || username.includes(searchTerm)) && locationMatch;
    });
  }, [links, searchQuery, selectedLocation]);

  const locations = [
    "Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai",
    "Delhi NCR", "Kolkata", "Ahmedabad", "Jaipur",
    "Thiruvananthapuram", "Lucknow", "Indore", "Chandigarh", "Nagpur"
  ];

  // Added function to handle filter reset
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
  };

  return (<>
      <Doodles />
    <div className="relative max-w-4xl mx-auto p-4 space-y-6">
      {/* Doodle Background */}
      
      {/* Content (with z-index to appear above the background) */}
      <div className="relative z-10">
        {/* Search and Filter Bar */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full max-w-[70%]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 border-gray-200"
          >
            <option value="">All Chapters</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3 mt-4">
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={fetchUserLinks}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : filteredLinks.length > 0 ? (
          <div className="grid gap-4 mt-6">
            {filteredLinks.map((link) => (
              <div
                key={link._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/profile/${link.username}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {link.profilePicture ? (
                      <div className="w-12 h-12 rounded-full border-2 border-orange-400 overflow-hidden">
                        <img
                          src={link.profilePicture}
                          alt={link.name || "Unknown User"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <UserCircle2 className="w-8 h-8 text-orange-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{link.name || "Unknown User"}</h3>
                      <p className="text-orange-600">@{link.username || "unknown"}</p>
                      {link.location && (
                        <p className="text-gray-500 flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-orange-400" />
                          <span>{link.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-orange-50 rounded-lg mt-6 border border-orange-100">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              <UserCircle2 className="h-10 w-10 text-orange-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchQuery || selectedLocation ? "No matches found" : "No connections yet"}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchQuery || selectedLocation
                ? "Try adjusting your search terms or filters"
                : "Start connecting with other users to build your network."}
            </p>
            {(searchQuery || selectedLocation) && (
              <button 
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-md border border-orange-200 hover:bg-orange-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default UserLinksPage;