import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";

const UserLinksModal = ({ userId, onClose }) => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserLinks();
  }, [userId]); // Fetch links only when `userId` changes

  const fetchUserLinks = async () => {
    try {
      const response = await axiosInstance.get(`/links/${userId}`);
      console.log("API Response:", response.data); // Log API response
      setLinks(response.data || []); // Replace state, avoid appending
    } catch (error) {
      console.error("Failed to fetch user links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">User Links</h2>
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
        ) : links && links.length > 0 ? (
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link._id} className="text-gray-700">
                {link.name || link.username || "Unknown User"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No links available</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserLinksModal;
