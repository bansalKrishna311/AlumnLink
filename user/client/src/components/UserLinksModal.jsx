import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2, UserCircle2, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";

const UserLinksPage = () => {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter links based on search query
  const filteredLinks = links.filter((link) => {
    const searchTerm = searchQuery.toLowerCase();
    const name = (link.name || "").toLowerCase();
    const username = (link.username || "").toLowerCase();
    return name.includes(searchTerm) || username.includes(searchTerm);
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
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
            {searchQuery ? "No matches found" : "No connections yet"}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start connecting with other users to build your network."}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserLinksPage;