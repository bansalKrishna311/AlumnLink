import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, UserCircle2, Search, MapPin } from 'lucide-react';

const SelfLinks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { userId } = useParams();

  const { 
    data: links = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ["userLinks", userId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/links/${userId}`);
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch user links:", error);
        throw new Error("Failed to fetch links. Please try again later.");
      }
    },
    enabled: !!userId,
  });

  const filteredLinks = links.filter((link) => {
    if (!searchQuery.trim()) return true;
    
    const searchTerm = searchQuery.toLowerCase().trim();
    const name = (link.user?.name || "").toLowerCase();
    const username = (link.user?.username || "").toLowerCase();
    const headline = (link.user?.headline || "").toLowerCase();
    const location = (link.user?.location || "").toLowerCase();
    
    return name.includes(searchTerm) || 
           username.includes(searchTerm) ||
           headline.includes(searchTerm) ||
           location.includes(searchTerm);
  });

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-red-800 font-medium">Error Loading Links</h3>
          <p className="text-red-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-[70%]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search links by name, username, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : filteredLinks.length > 0 ? (
        <div className="grid gap-4">
          {filteredLinks.map((link) => (
            <div
              key={link._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => navigate(`/profile/${link.user?.username}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {link.user?.profilePicture ? (
                    <img
                      src={link.user.profilePicture}
                      alt={link.user.name || "Unknown User"}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        e.target.className = "hidden";
                        e.target.nextSibling.className = "w-12 h-12 text-gray-400";
                      }}
                    />
                  ) : (
                    <UserCircle2 className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {link.user?.name || "Unknown User"}
                    </h3>
                    <p className="text-gray-600">
                      @{link.user?.username || "unknown"}
                    </p>
                    {link.user?.headline && (
                      <p className="text-gray-600 text-sm mt-1">{link.user.headline}</p>
                    )}
                    {link.user?.location && (
                      <p className="text-gray-500 flex items-center space-x-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{link.user.location}</span>
                      </p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {link.courseName} - Batch {link.batch}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Roll Number: {link.rollNumber}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Status: {link.status}
                    </p>
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
            {searchQuery ? "No matches found" : "No links yet"}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start adding links to build your network."}
          </p>
        </div>
      )}
    </div>
  );
};

export default SelfLinks;

