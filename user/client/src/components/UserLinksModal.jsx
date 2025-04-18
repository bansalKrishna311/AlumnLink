import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2, UserCircle2, Search, MapPin, Briefcase, GraduationCap, Code, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Doodles from "@/pages/auth/components/Doodles";

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

  const handleMessage = (e, username) => {
    e.stopPropagation(); // Prevent card click event from firing
    navigate(`/messages/${username}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Doodle Background Pattern */}
      <Doodles/>

      <div className="relative max-w-4xl mx-auto p-6 space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-orange-100 shadow-lg">
          <div className="relative w-full md:max-w-[70%]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#fe6019]" />
              <Input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border-orange-200 focus:border-[#fe6019] focus:ring-[#fe6019] bg-white/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>
          
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe6019] bg-white/50 backdrop-blur-sm transition-all duration-300"
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
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-[#fe6019]" />
          </div>
        ) : filteredLinks.length > 0 ? (
          <div className="grid gap-4">
            {filteredLinks.map((link) => (
              <div
                key={link._id}
                className="group bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-orange-100 hover:border-[#fe6019] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-orange-100/50 transform hover:-translate-y-1"
                onClick={() => navigate(`/profile/${link.username}`)}
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {link.profilePicture ? (
                        <img
                          src={link.profilePicture}
                          alt={link.name || "Unknown User"}
                          className="w-14 h-14 rounded-full border-2 border-orange-100 group-hover:border-[#fe6019] transition-colors object-cover"
                        />
                      ) : (
                        <UserCircle2 className="w-14 h-14 text-[#fe6019]" />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-[#fe6019] transition-colors">
                          {link.name || "Unknown User"}
                        </h3>
                        <p className="text-gray-600">@{link.username || "unknown"}</p>
                        {link.location && (
                          <p className="text-gray-500 flex items-center space-x-2 mt-1">
                            <MapPin className="h-4 w-4 text-[#fe6019]" />
                            <span>{link.location}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => handleMessage(e, link.username)}
                      className="bg-[#fe6019] hover:bg-[#e54e0e] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
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
                        {link.skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="bg-orange-50 text-[#fe6019] px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Education Section */}
                  {link.education && link.education.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <GraduationCap className="h-4 w-4 text-[#fe6019]" />
                        <span className="font-medium">Education:</span>
                      </div>
                      <div className="mt-1 space-y-2">
                        {link.education.map((edu, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            <p className="font-medium">{edu.school} • {edu.degree}</p>
                            <p>{edu.fieldOfStudy}</p>
                            <p className="text-gray-500">
                              {new Date(edu.startDate).getFullYear()} - 
                              {edu.isCurrentlyStudying ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Experience Section */}
                  {link.experience && link.experience.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Briefcase className="h-4 w-4 text-[#fe6019]" />
                        <span className="font-medium">Experience:</span>
                      </div>
                      <div className="mt-1 space-y-2">
                        {link.experience.map((exp, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            <p className="font-medium">{exp.title} • {exp.company}</p>
                            <p className="text-gray-500">
                              {new Date(exp.startDate).getFullYear()} - 
                              {exp.isCurrentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl border border-orange-100">
            <UserCircle2 className="mx-auto h-16 w-16 text-[#fe6019]" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              {searchQuery || selectedLocation ? "No matches found" : "No connections yet"}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchQuery || selectedLocation
                ? "Try adjusting your search terms or filters"
                : "Start connecting with other users to build your network."}
            </p>
          </div>
        )}
      </div>
    </div>  
  );
};

export default UserLinksPage;