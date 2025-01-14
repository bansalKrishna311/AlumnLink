import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const UserLinksPage = () => {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const getProfilePicture = (profilePicture) => {
    return profilePicture || "/avatar.png"; // Default avatar if profilePicture is missing
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Links</h2>
      {isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
      ) : links && links.length > 0 ? (
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link._id} className="flex items-center space-x-4 text-gray-700">
              <img
                src={getProfilePicture(link.profilePicture)}
                alt={`${link.name || link.username || "Unknown User"}'s profile`}
                className="w-10 h-10 rounded-full"
              />
              <span>{link.name || link.username || "Unknown User"}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No links available</p>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go Back
      </button>
    </div>
  );
};

export default UserLinksPage;
