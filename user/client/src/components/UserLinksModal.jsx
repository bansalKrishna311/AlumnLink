import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2, UserCircle2, Search, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";

const UserLinksPage = () => {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(""); // New state for location filter
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserLinks();
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

  // Updated filter logic to include both search query and location
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

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
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
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Chapters</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
      ) : filteredLinks.length > 0 ? (
        <div className="grid gap-4">
          {filteredLinks.map((link) => (
            <div
              key={link._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => navigate(`/profile/${link.username}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {link.profilePicture ? (
                    <img
                      src={link.profilePicture}
                      alt={link.name || "Unknown User"}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <UserCircle2 className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{link.name || "Unknown User"}</h3>
                    <p className="text-gray-600">@{link.username || "unknown"}</p>
                    {link.location && (
                      <p className="text-gray-500 flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
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
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <UserCircle2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery || selectedLocation ? "No matches found" : "No connections yet"}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || selectedLocation
              ? "Try adjusting your search terms or filters"
              : "Start connecting with other users to build your network."}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserLinksPage; 