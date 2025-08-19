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
  Code,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";

const RejectedRequests = () => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // Helper function to safely convert to string and check if it includes search query
  const safeIncludes = (value, query) => {
    if (value === null || value === undefined) return false;
    const stringValue = typeof value === 'string' ? value : String(value);
    return stringValue.toLowerCase().includes(query.toLowerCase());
  };

  useEffect(() => {
    fetchUserLinks();
  }, [currentPage]);

  useEffect(() => {
    // Reset to first page when search changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchUserLinks();
    }
  }, [searchQuery]);

  const fetchUserLinks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await axiosInstance.get(`/links/rejected?${params}`);
      
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          // Handle paginated response
          setLinks(response.data.data);
          setFilteredLinks(response.data.data);
          setPagination({
            currentPage: response.data.pagination.currentPage,
            totalPages: response.data.pagination.totalPages,
            totalItems: response.data.pagination.totalItems
          });
        } else if (Array.isArray(response.data)) {
          // Handle non-paginated response (fallback)
          setLinks(response.data);
          setFilteredLinks(response.data);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: response.data.length
          });
        }
        setError(null);
      } else {
        setLinks([]);
        setFilteredLinks([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        });
        setError("Received invalid data format");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching rejected links:", err);
      if (err.response && err.response.status === 404) {
        setLinks([]);
        setFilteredLinks([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        });
        setError(null);
      } else {
        setError("Unable to connect to the server. Please try again later.");
      }
      setIsLoading(false);
    }
  };

  const handleResetToPending = async (id) => {
    try {
      await axiosInstance.put(`/links/reset-to-pending/${id}`);
      setLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      setFilteredLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      toast.success("Connection reset to pending status successfully!");
    } catch (error) {
      console.error("Error resetting connection status:", error);
      toast.error("Error resetting connection status.");
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await axiosInstance.delete(`/links/${id}`);
      setLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      setFilteredLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      toast.success("Connection request deleted successfully!");
    } catch (error) {
      console.error("Error deleting connection request:", error);
      toast.error("Error deleting connection request.");
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

      const successfulIds = (await Promise.all(updatePromises)).filter(id => id !== null);
      
      setLinks(prevLinks =>
        prevLinks.filter(link => !successfulIds.includes(link._id))
      );
      
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

  const handleBulkDelete = async () => {
    if (selectedLinks.length === 0) {
      toast.error("Please select at least one connection");
      return;
    }

    setProcessing(true);
    const successCount = { value: 0 };
    const failCount = { value: 0 };

    try {
      const deletePromises = selectedLinks.map(async (id) => {
        try {
          await axiosInstance.delete(`/links/${id}`);
          successCount.value++;
          return id;
        } catch (error) {
          console.error(`Error deleting connection ${id}:`, error);
          failCount.value++;
          return null;
        }
      });

      const successfulIds = (await Promise.all(deletePromises)).filter(id => id !== null);
      
      setLinks(prevLinks =>
        prevLinks.filter(link => !successfulIds.includes(link._id))
      );
      
      setSelectedLinks([]);
      
      if (successCount.value > 0) {
        toast.success(`${successCount.value} connection${successCount.value > 1 ? 's' : ''} deleted successfully!`);
      }
      
      if (failCount.value > 0) {
        toast.error(`Failed to delete ${failCount.value} connection${failCount.value > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error(`Error in bulk delete:`, error);
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
    if (selectedLinks.length === filteredLinks.length) {
      setSelectedLinks([]);
    } else {
      setSelectedLinks(filteredLinks.map(link => link._id));
    }
  };

  const handleSearchChange = (e) => {
    try {
      setSearchQuery(e.target.value);
    } catch (err) {
      console.error("Error in search:", err);
    }
  };

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
        Rejected Connection Requests
      </motion.h1>

      <motion.div
        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <p>Rejected requests will be automatically deleted after 30 days. You can change them back to pending status before deletion if needed.</p>
        </div>
      </motion.div>

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

                <motion.button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium shadow-sm hover:bg-red-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleBulkDelete}
                  disabled={processing || selectedLinks.length === 0}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Trash2 size={14} />
                  {processing ? 'Processing...' : 'Delete Selected'}
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
                          checked={filteredLinks.length > 0 && selectedLinks.length === filteredLinks.length}
                          onChange={toggleAllSelection}
                        />
                      </label>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Selected Course</th>
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
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link, index) => (
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
                            {link.courseName || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <BookOpen size={18} className="text-[#fe6019]" />
                          <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-md">
                            {link.selectedCourse || 'Not specified'}
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
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors duration-200"
                            aria-label="Reset to Pending"
                            onClick={() => handleResetToPending(link._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Clock size={14} />
                          </motion.button>

                          <motion.button
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                            aria-label="Delete Request"
                            onClick={() => handleDeleteRequest(link._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-gray-500 italic">
                      No rejected connections found
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
          {pagination.totalPages > 1 && (
            <motion.div 
              className="flex justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => setCurrentPage(newPage)}
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default RejectedRequests;
