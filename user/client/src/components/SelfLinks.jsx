import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { axiosInstance } from "@/lib/axios"; // Update the path accordingly

const SelfLinks = ({ onRemoveLink, onOpenUserAccount }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchLinks = async () => {
      try {
        const response = await axiosInstance.get("/links"); // Using axiosInstance
        setLinks(response.data);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Links</h1>
      <div className="space-y-4 max-h-screen overflow-y-auto">
        {links.length > 0 ? (
          links.map((link) => (
            <div
              key={link._id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
              onClick={() => onOpenUserAccount(link.user.username)}
            >
              <img
                src={link.user.profilePicture || "/avatar.png"}
                alt={link.user.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{link.user.name}</h3>
                <p className="text-gray-600">{link.user.headline}</p>
              </div>
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLink(link._id);
                }}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No links found.</div>
        )}
      </div>
    </div>
  );
};

export default SelfLinks;