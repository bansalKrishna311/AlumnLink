import { motion } from "framer-motion";
import { Search, User, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

const MentionDropdown = ({ 
  query, 
  visible,
  onSelect,
  users = [],
  parentRef = null
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  
  // Use passed users or fetch from API
  const { data: fetchedUsers, isLoading } = useQuery({
    queryKey: ['mentionSuggestions', query],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/mention-suggestions${query ? `?search=${query}` : ''}`);
      return response.data;
    },
    enabled: visible && (!users || users.length === 0),
    staleTime: 30000,
  });
  
  // Filter users to display
  const usersToShow = users?.length > 0 ? users : fetchedUsers;
  const filteredUsers = (usersToShow || [])
    .filter(user => !query || 
      user.name?.toLowerCase().includes(query.toLowerCase()) || 
      user.username?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 10);

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
  
  // Format admin type for display
  const formatAdminType = (type) => {
    if (!type) return 'Admin';
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Admin';
  };

  return (
    <div 
      className="relative w-full"
      style={{
        zIndex: 9999,
        // Position above the input field instead of below
        position: "absolute",
        bottom: "100%",  // Position above instead of below
        left: 0,
        right: 0,
        marginBottom: "40px" // Small gap between dropdown and input
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className="bg-white rounded-lg shadow-lg border-2 border-gray-200 w-full max-h-[300px] overflow-y-auto"
        ref={listRef}
      >
        <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center sticky top-0 z-10">
          <Search size={14} className="text-gray-500 mr-2" />
          <span className="text-sm font-medium">
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
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{user.name}</div>
                  {user.username && (
                    <div className="text-xs text-gray-500 truncate">@{user.username}</div>
                  )}
                </div>
                {user.role === "admin" && (
                  <div className="flex items-center text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded ml-1 whitespace-nowrap">
                    <Shield size={10} className="mr-0.5 flex-shrink-0" />
                    {formatAdminType(user.adminType)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default MentionDropdown;