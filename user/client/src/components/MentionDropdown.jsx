import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

const MentionDropdown = ({ 
  query, 
  visible,
  onSelect, 
  position
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  
  // Fetch users with the search query
  const { data: users, isLoading } = useQuery({
    queryKey: ['mentionSuggestions', query],
    queryFn: async () => {
      // Add search parameter to the API call
      const response = await axiosInstance.get(`/users/mention-suggestions${query ? `?search=${query}` : ''}`);
      return response.data;
    },
    // Only start searching when there's a query
    enabled: visible,
    // Reduce refetch rate to avoid too many requests
    staleTime: 30000,
  });
  
  // Filter users to display (limit to 10 for performance)
  const filteredUsers = users?.slice(0, 10) || [];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!visible) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredUsers.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredUsers[selectedIndex]) {
            onSelect(filteredUsers[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onSelect(null); // Cancel
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, filteredUsers, selectedIndex, onSelect]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex] && listRef.current) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-64 max-h-60 overflow-y-auto"
      style={{
        top: position?.top || '100%',
        left: position?.left || 0
      }}
      ref={listRef}
    >
      <div className="p-2 border-b border-gray-100 flex items-center">
        <Search size={14} className="text-gray-400 mr-2" />
        <span className="text-sm text-gray-600">
          {query ? `Results for "${query}"` : "Mention someone"}
        </span>
      </div>
      
      {isLoading ? (
        <div className="p-3 text-center text-gray-500">
          <div className="animate-spin inline-block w-5 h-5 border-2 border-[#fe6019] border-t-transparent rounded-full mr-2"></div>
          Loading...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-3 text-center text-gray-500 flex flex-col items-center">
          <User size={20} className="mb-1 text-gray-400" />
          <span>No users found</span>
          <span className="text-xs mt-1">Try a different search</span>
        </div>
      ) : (
        <ul className="py-1">
          {filteredUsers.map((user, index) => (
            <li 
              key={user._id} 
              ref={el => itemRefs.current[index] = el}
              className={`px-3 py-2 flex items-center cursor-pointer ${
                index === selectedIndex ? 'bg-[#fe6019]/10 text-[#fe6019]' : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelect(user)}
            >
              <img 
                src={user.profilePicture || "/avatar.png"} 
                alt={user.name}
                className="w-8 h-8 rounded-full mr-2 border border-gray-200 object-cover" 
              />
              <div>
                <div className="font-medium text-sm">{user.name}</div>
                {user.username && (
                  <div className="text-xs text-gray-500">@{user.username}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default MentionDropdown;