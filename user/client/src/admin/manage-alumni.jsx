import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import { 
  UserCircle2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  MapPin, 
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  BookOpen,
  Code
} from 'lucide-react';
import { FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const UserLinks = () => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Helper function to safely convert to string and check if it includes search query
  const safeIncludes = (value, query) => {
    if (value === null || value === undefined) return false;
    
    const stringValue = typeof value === 'string' ? value : String(value);
    return stringValue.toLowerCase().includes(query.toLowerCase());
  };

  useEffect(() => {
    fetchUserLinks();
  }, []);

  useEffect(() => {
    // Safely filter links based on search query with type checking
    if (!links || !Array.isArray(links) || links.length === 0) {
      setFilteredLinks([]);
      return;
    }
    
    try {
      const filtered = links.filter(link => {
        if (!link) return false;
        
        // Use the safeIncludes helper for all checks
        const nameMatch = link.user && safeIncludes(link.user.name, searchQuery);
        const usernameMatch = link.user && safeIncludes(link.user.username, searchQuery);
        const locationMatch = link.user && safeIncludes(link.user.location, searchQuery);
        const courseMatch = safeIncludes(link.courseName, searchQuery);
        const batchMatch = safeIncludes(link.batch, searchQuery);
        const rollMatch = safeIncludes(link.rollNumber, searchQuery);
        
        return nameMatch || usernameMatch || locationMatch || courseMatch || batchMatch || rollMatch;
      });
      
      setFilteredLinks(filtered);
      setCurrentPage(1); // Reset to first page when search changes
    } catch (err) {
      console.error("Error in filtering:", err);
      // In case of error, don't change the current filtered list
    }
  }, [searchQuery, links]);

  const fetchUserLinks = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/links');
      
      // Ensure we have valid data before setting state
      if (response && response.data && Array.isArray(response.data)) {
        setLinks(response.data);
        setFilteredLinks(response.data);
        setError(null);
      } else {
        setLinks([]);
        setFilteredLinks([]);
        setError("Received invalid data format");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching connections:", err);
      // Handle 404 specifically as "no data" rather than an error
      if (err.response && err.response.status === 404) {
        setLinks([]);
        setFilteredLinks([]);
        setError(null);
      } else {
        setError("Unable to connect to the server. Please try again later.");
      }
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const route = status === "accepted" ? "/accept" : "/reject";
      await axiosInstance.put(`/links${route}/${id}`);
      
      // Update the status in the UI without fetching again
      setLinks(prevLinks =>
        prevLinks.map(link => 
          link._id === id ? { ...link, status } : link
        )
      );
      
      toast.success(`Connection ${status === "accepted" ? "approved" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Error updating connection status:", error);
      toast.error("Error updating connection status.");
    }
  };

  const handleResetToPending = async (id) => {
    try {
      await axiosInstance.put(`/links/reset-to-pending/${id}`);
      
      // Remove the item from both links and filteredLinks arrays
      setLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      setFilteredLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      
      toast.success("Connection reset to pending status successfully!");
    } catch (error) {
      console.error("Error resetting connection status:", error);
      toast.error("Error resetting connection status.");
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedLinks.length === 0) {
      toast.error("Please select at least one connection");
      return;
    }

    setProcessing(true);
    const route = status === "accepted" ? "/accept" : "/reject";
    const successCount = { value: 0 };
    const failCount = { value: 0 };

    try {
      // Create an array of promises for all the requests
      const updatePromises = selectedLinks.map(async (id) => {
        try {
          await axiosInstance.put(`/links${route}/${id}`);
          successCount.value++;
          return id;
        } catch (error) {
          console.error(`Error ${status === "accepted" ? "approving" : "rejecting"} connection ${id}:`, error);
          failCount.value++;
          return null;
        }
      });

      // Wait for all promises to resolve
      const successfulIds = (await Promise.all(updatePromises)).filter(id => id !== null);
      
      // Update the statuses in the UI
      setLinks(prevLinks =>
        prevLinks.map(link => 
          successfulIds.includes(link._id) ? { ...link, status } : link
        )
      );
      
      // Clear the selection
      setSelectedLinks([]);
      
      if (successCount.value > 0) {
        toast.success(`${successCount.value} connection${successCount.value > 1 ? 's' : ''} ${status === "accepted" ? "approved" : "rejected"} successfully!`);
      }
      
      if (failCount.value > 0) {
        toast.error(`Failed to ${status === "accepted" ? "approve" : "reject"} ${failCount.value} connection${failCount.value > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error(`Error in bulk ${status}:`, error);
      toast.error("An error occurred during batch processing");
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkResetToPending = async () => {
    if (selectedLinks.length === 0) {
      toast.error("Please select at least one connection");
      return;
    }

    setProcessing(true);
    const successCount = { value: 0 };
    const failCount = { value: 0 };

    try {
      // Create an array of promises for all the requests
      const updatePromises = selectedLinks.map(async (id) => {
        try {
          await axiosInstance.put(`/links/reset-to-pending/${id}`);
          successCount.value++;
          return id;
        } catch (error) {
          console.error(`Error changing connection ${id} to pending:`, error);
          failCount.value++;
          return null;
        }
      });

      // Wait for all promises to resolve
      const successfulIds = (await Promise.all(updatePromises)).filter(id => id !== null);
      
      // Update the statuses in the UI
      setLinks(prevLinks =>
        prevLinks.map(link => 
          successfulIds.includes(link._id) ? { ...link, status: "pending" } : link
        )
      );
      
      // Clear the selection
      setSelectedLinks([]);
      
      if (successCount.value > 0) {
        toast.success(`${successCount.value} connection${successCount.value > 1 ? 's' : ''} changed to pending successfully!`);
      }
      
      if (failCount.value > 0) {
        toast.error(`Failed to change ${failCount.value} connection${failCount.value > 1 ? 's' : ''} to pending`);
      }
    } catch (error) {
      console.error(`Error in bulk change to pending:`, error);
      toast.error("An error occurred during batch processing");
    } finally {
      setProcessing(false);
    }
  };

  const toggleLinkSelection = (id) => {
    setSelectedLinks(prev => 
      prev.includes(id) 
        ? prev.filter(linkId => linkId !== id)
        : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedLinks.length === currentItems.length) {
      setSelectedLinks([]);
    } else {
      setSelectedLinks(currentItems.map(link => link._id));
    }
  };

  const handleSearchChange = (e) => {
    try {
      setSearchQuery(e.target.value);
    } catch (err) {
      console.error("Error in search:", err);
    }
  };

  // Pagination logic with safeguards
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLinks?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.max(1, Math.ceil((filteredLinks?.length || 0) / itemsPerPage));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 50,
        damping: 10
      }
    },
    exit: { 
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Manage Alumni Connections
      </motion.h1>

      {error && (
        <motion.div 
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            className="rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#fe6019]"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.2, 
              ease: "linear", 
              repeat: Infinity 
            }}
          />
        </div>
      ) : (
        <>
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, roll number, batch..."
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium shadow-sm hover:bg-amber-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleBulkResetToPending}
                  disabled={processing || selectedLinks.length === 0}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Clock size={14} />
                  {processing ? 'Processing...' : 'Change to Pending'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#fff5f0]">
                  <th className="px-3 py-4 text-left">
                    <div className="flex items-center">
                      <label className="inline-flex">
                        <input 
                          type="checkbox" 
                          className="form-checkbox rounded border-gray-300 text-[#fe6019] focus:ring focus:ring-[#fe6019]/20 h-5 w-5 cursor-pointer"
                          checked={currentItems.length > 0 && selectedLinks.length === currentItems.length}
                          onChange={toggleAllSelection}
                        />
                      </label>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                className="divide-y divide-gray-200 bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentItems.length > 0 ? (
                  currentItems.map((link, index) => (
                    <motion.tr 
                      key={link._id || Math.random().toString()} 
                      className={`hover:bg-[#fff5f0] transition-all duration-200 ${
                        selectedLinks.includes(link._id) ? 'bg-[#fff5f0]' : ''
                      }`}
                      variants={rowVariants}
                      custom={index}
                      layout
                    >
                      <td className="pl-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <label className="inline-flex">
                            <input 
                              type="checkbox" 
                              className="form-checkbox rounded border-gray-300 text-[#fe6019] focus:ring focus:ring-[#fe6019]/20 h-5 w-5 cursor-pointer"
                              checked={selectedLinks.includes(link._id)}
                              onChange={() => toggleLinkSelection(link._id)}
                            />
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {link.user?.profilePicture ? (
                            <img
                              src={link.user.profilePicture}
                              alt={link.user?.name || "User"}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <User size={18} className="text-[#fe6019]" />
                          )}
                          <div>
                            <span className="text-sm text-gray-900 font-medium block">{link.user?.name || "Unknown User"}</span>
                            <span className="text-xs text-gray-500">@{link.user?.username || "username"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Code size={18} className="text-[#fe6019]" />
                          <span className="text-sm text-gray-600">
                            {typeof link.rollNumber === 'string' ? link.rollNumber : String(link.rollNumber) || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Calendar size={18} className="text-[#fe6019]" />
                          <span className="text-sm text-gray-600">
                            {typeof link.batch === 'string' ? link.batch : String(link.batch) || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <BookOpen size={18} className="text-[#fe6019]" />
                          <span className="text-sm text-gray-600">
                            {typeof link.courseName === 'string' ? link.courseName : 'Unknown Course'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <MapPin size={18} className="text-[#fe6019]" />
                          <span className="text-sm text-gray-600">
                            {link.user?.location || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <motion.button
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors duration-200 disabled:opacity-50"
                            aria-label="Reset to Pending"
                            onClick={() => handleResetToPending(link._id)}
                            disabled={link.status === 'pending'}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Clock size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500 italic">
                      No connections found
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </motion.div>

          {selectedLinks.length > 0 && (
            <motion.div 
              className="mt-4 p-3 bg-[#fff5f0] rounded-lg border border-[#fe6019]/20 text-sm text-gray-700 flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div>
                <span className="font-medium text-[#fe6019]">{selectedLinks.length}</span> connection{selectedLinks.length !== 1 ? 's' : ''} selected
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 underline text-sm"
                onClick={() => setSelectedLinks([])}
              >
                Clear selection
              </button>
            </motion.div>
          )}

          {/* Pagination controls */}
          {filteredLinks.length > itemsPerPage && (
            <motion.div 
              className="flex justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex space-x-1">
                <motion.button
                  className="p-2 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-[#fff5f0] disabled:opacity-50"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }
                  
                  return (
                    <motion.button
                      key={pageNumber}
                      className={`h-9 w-9 rounded-md border ${
                        currentPage === pageNumber 
                          ? 'bg-[#fe6019] text-white border-[#fe6019]' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-[#fff5f0]'
                      }`}
                      onClick={() => paginate(pageNumber)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {pageNumber}
                    </motion.button>
                  );
                })}
                
                <motion.button
                  className="p-2 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-[#fff5f0] disabled:opacity-50"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default UserLinks;