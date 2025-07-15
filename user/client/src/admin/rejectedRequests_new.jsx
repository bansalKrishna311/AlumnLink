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
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 10;

  // Helper function to safely convert to string and check if it includes search query
  const safeIncludes = (value, query) => {
    if (value === null || value === undefined) return false;
    const stringValue = typeof value === 'string' ? value : String(value);
    return stringValue.toLowerCase().includes(query.toLowerCase());
  };

  useEffect(() => {
    fetchUserLinks(currentPage);
  }, [currentPage]);

  useEffect(() => {
    try {
      if (!searchQuery.trim()) {
        setFilteredLinks(links);
        return;
      }

      const filtered = links.filter(link => {
        if (!link) return false;
        
        const nameMatch = link.user && safeIncludes(link.user.name, searchQuery);
        const usernameMatch = link.user && safeIncludes(link.user.username, searchQuery);
        const locationMatch = link.user && safeIncludes(link.user.location, searchQuery);
        const courseMatch = safeIncludes(link.courseName, searchQuery);
        const batchMatch = safeIncludes(link.batch, searchQuery);
        const rollMatch = safeIncludes(link.rollNumber, searchQuery);
        
        return nameMatch || usernameMatch || locationMatch || courseMatch || batchMatch || rollMatch;
      });
      
      setFilteredLinks(filtered);
    } catch (err) {
      console.error("Error in filtering:", err);
    }
  }, [searchQuery, links]);

  const fetchUserLinks = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/links/rejected?page=${page}&limit=${itemsPerPage}`);
      
      if (response && response.data) {
        // Check if it's the new paginated format
        if (response.data.success && response.data.data) {
          setLinks(response.data.data);
          setFilteredLinks(response.data.data);
          setPagination(response.data.pagination || {});
        } else if (Array.isArray(response.data)) {
          // Handle old format (all data at once)
          setLinks(response.data);
          setFilteredLinks(response.data);
          // Create mock pagination for old format
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: response.data.length
          });
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching rejected links:', err);
      setError('Failed to fetch rejected connections. Please try again.');
      toast.error('Failed to fetch rejected connections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConnection = async (id) => {
    if (!id) {
      console.error('No connection ID provided');
      return;
    }

    if (!window.confirm('Are you sure you want to permanently delete this connection?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/links/${id}`);
      
      setLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      setFilteredLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      
      toast.success('Connection deleted successfully!');
    } catch (error) {
      console.error('Error deleting connection:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete connection';
      toast.error(errorMessage);
    }
  };

  const handleDeleteConnections = async () => {
    if (selectedLinks.length === 0) {
      toast.error("Please select connections to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete ${selectedLinks.length} connection${selectedLinks.length > 1 ? 's' : ''}?`)) {
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
    if (currentItems.length === 0) return;
    
    if (selectedLinks.length === currentItems.length) {
      setSelectedLinks([]);
    } else {
      setSelectedLinks(currentItems.map(link => link._id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const currentItems = searchQuery.trim() ? filteredLinks : links;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedLinks([]); // Clear selections when changing pages
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-[#fe6019] w-8 h-8" />
          <p className="text-gray-600">Loading rejected connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">Error Loading Data</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => fetchUserLinks(currentPage)}
            className="px-4 py-2 bg-[#fe6019] text-white rounded-lg hover:bg-[#e55417] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <motion.div 
        className="max-w-7xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              Rejected Connections
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and review rejected alumni connection requests
            </p>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019]/20 focus:border-[#fe6019] w-full sm:w-80"
              />
            </div>

            {selectedLinks.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {selectedLinks.length} selected
                </span>
                <button
                  onClick={handleDeleteConnections}
                  disabled={processing}
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1" />
                  )}
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination.totalItems || links.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Search className="w-6 h-6 text-[#fe6019]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Search Results</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentItems.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedLinks.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connections Table */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {searchQuery.trim() ? (
                  <div className="space-y-4">
                    <Search className="w-16 h-16 text-gray-300 mx-auto" />
                    <h3 className="text-lg font-medium text-gray-900">No Search Results</h3>
                    <p className="text-gray-600">
                      No rejected connections found matching "{searchQuery}"
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-[#fe6019] text-white rounded-lg hover:bg-[#e55417] transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <XCircle className="w-16 h-16 text-gray-300 mx-auto" />
                    <h3 className="text-lg font-medium text-gray-900">No Rejected Connections</h3>
                    <p className="text-gray-600">
                      There are no rejected connections at the moment.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
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
                  {currentItems.map((link, index) => (
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
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {link.user?.avatar ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                                src={link.user.avatar}
                                alt={link.user?.name || 'User'}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`h-12 w-12 rounded-full bg-gradient-to-br from-[#fe6019] to-orange-600 flex items-center justify-center text-white font-semibold text-lg ${
                                link.user?.avatar ? 'hidden' : 'flex'
                              }`}
                            >
                              {link.user?.name ? link.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <User className="w-4 h-4 mr-1 text-gray-400" />
                              {link.user?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{link.user?.username || 'unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Code className="w-4 h-4 mr-1 text-gray-400" />
                          {link.rollNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {link.batch || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="max-w-xs truncate" title={link.courseName}>
                            {link.courseName || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="max-w-xs truncate" title={link.user?.location}>
                            {link.user?.location || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleDeleteConnection(link._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}

          {/* Pagination Component */}
          {!searchQuery.trim() && pagination && pagination.totalPages > 1 && (
            <motion.div 
              className="px-6 py-4 border-t border-gray-200 bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Pagination
                currentPage={pagination.currentPage || currentPage}
                totalPages={pagination.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </motion.div>

        {/* No data message for search */}
        {searchQuery.trim() && currentItems.length === 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1 
              className="text-2xl font-bold text-gray-800 mb-4"
              variants={rowVariants}
              initial="hidden"
              animate="visible"
            >
              No connections found matching "{searchQuery}"
            </motion.h1>
            <motion.p 
              className="text-gray-600 mb-6"
              variants={rowVariants}
              initial="hidden"
              animate="visible"
            >
              Try adjusting your search criteria or clear the search to see all rejected connections.
            </motion.p>
            <motion.button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2 bg-[#fe6019] text-white rounded-lg hover:bg-[#e55417] transition-colors"
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Search
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RejectedRequests;
