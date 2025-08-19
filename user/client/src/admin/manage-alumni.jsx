import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import * as XLSX from 'xlsx';
import { 
  Clock, 
  MapPin, 
  Search,
  ChevronDown,
  User,
  Calendar,
  BookOpen,
  Code,
  Download
} from 'lucide-react';
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import HighlightedText from "@/components/HighlightedText";

const UserLinks = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [allLinks, setAllLinks] = useState([]); // Store all links for client-side filtering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Chapters');
  
  // Location options for the filter
  const locationOptions = [
    'All Chapters',
    'Bengaluru',
    'Hyderabad', 
    'Pune',
    'Chennai',
    'Mumbai',
    'Delhi NCR',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Thiruvananthapuram',
    'Lucknow',
    'Indore',
    'Chandigarh',
    'Nagpur'
  ];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10
  });
  
  // Client-side filtering function like in SelfLinks.jsx
  const filterLinks = useCallback((linksArray, query) => {
    if (!query || !query.trim()) {
      return linksArray;
    }
    
    const searchTerm = query.toLowerCase().trim();
    return linksArray.filter((link) => {
      const name = link.user?.name?.toLowerCase() || '';
      const username = link.user?.username?.toLowerCase() || '';
      const rollNumber = String(link.rollNumber || '').toLowerCase();
      const batch = String(link.batch || '').toLowerCase();
      const courseName = String(link.courseName || '').toLowerCase();
      const selectedCourse = String(link.selectedCourse || '').toLowerCase();
      const location = link.user?.location?.toLowerCase() || '';
      
      return name.includes(searchTerm) ||
             username.includes(searchTerm) ||
             rollNumber.includes(searchTerm) ||
             batch.includes(searchTerm) ||
             courseName.includes(searchTerm) ||
             selectedCourse.includes(searchTerm) ||
             location.includes(searchTerm);
    });
  }, []);

  // Apply client-side filtering and pagination when search query or page changes
  useEffect(() => {
    let filtered = filterLinks(allLinks, searchQuery);
    
    // Update pagination based on filtered results
    const totalCount = filtered.length;
    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    setPagination(prev => ({
      ...prev,
      totalCount,
      totalPages
    }));
    
    // Apply pagination to filtered results
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = filtered.slice(startIndex, endIndex);
    
    setLinks(paginatedResults);
  }, [searchQuery, allLinks, filterLinks, currentPage]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const fetchUserLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch ALL data for client-side filtering and pagination
      const params = new URLSearchParams({
        limit: '10000' // Get all records
      });
      
      // Add location filter to server request if it's not "All Chapters"
      if (selectedLocation && selectedLocation !== 'All Chapters') {
        params.append('location', selectedLocation);
      }
      
      const response = await axiosInstance.get(`/links?${params}`);
      
      // Ensure we have valid data before setting state
      if (response && response.data && Array.isArray(response.data)) {
        const allData = response.data;
        setAllLinks(allData);
        
        // Calculate pagination for all data
        const totalCount = allData.length;
        const pageSize = 10;
        const totalPages = Math.ceil(totalCount / pageSize);
        
        setPagination({
          totalCount,
          totalPages,
          currentPage: 1,
          pageSize
        });
        
        setError(null);
      } else {
        setLinks([]);
        setAllLinks([]);
        setError("Received invalid data format");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching connections:", err);
      // Handle 404 specifically as "no data" rather than an error
      if (err.response && err.response.status === 404) {
        setLinks([]);
        setAllLinks([]);
        setPagination({
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 10
        });
        setError(null);
      } else {
        setError("Unable to connect to the server. Please try again later.");
      }
      setIsLoading(false);
    }
  }, [selectedLocation]);

  // Fetch data when location changes or on initial load
  useEffect(() => {
    fetchUserLinks();
  }, [fetchUserLinks]);

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
      
      // Remove the item from the links array
      setLinks(prevLinks => prevLinks.filter(link => link._id !== id));
      
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
    if (selectedLinks.length === links.length) {
      setSelectedLinks([]);
    } else {
      setSelectedLinks(links.map(link => link._id));
    }
  };

  const handleLocationChange = useCallback((location) => {
    setSelectedLocation(location);
    // Reset pagination when changing location
    setCurrentPage(1);
  }, []);

  const handleUserProfileClick = useCallback((username) => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  }, [navigate]);

  const handleDownloadData = useCallback(async () => {
    try {
      setProcessing(true);
      toast.loading('Preparing data for download...', { id: 'download' });
      
      // Fetch all users without pagination
      const response = await axiosInstance.get('/links?limit=10000');
      const allLinks = response.data || [];
      
      // Fetch detailed user profiles for each user
      const detailedUsers = await Promise.all(
        allLinks.map(async (link) => {
          try {
            if (link.user?.username) {
              const userResponse = await axiosInstance.get(`/users/${link.user.username}`);
              return { ...link, userDetails: userResponse.data };
            }
            return { ...link, userDetails: null };
          } catch (error) {
            console.error(`Error fetching details for user ${link.user?.username}:`, error);
            return { ...link, userDetails: null };
          }
        })
      );

      // Prepare data for Excel export
      const excelData = detailedUsers.map((link, index) => {
        const user = link.userDetails || link.user || {};
        
        // Handle multiple experiences
        let experienceData = '';
        if (user.experience && user.experience.length > 0) {
          experienceData = user.experience.map((exp, idx) => {
            const startYear = exp.startDate ? new Date(exp.startDate).getFullYear() : 'Unknown';
            const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present';
            const workingYears = endYear === 'Present' ? `${startYear} - Present` : `${startYear} - ${endYear}`;
            return `${idx + 1}. ${exp.company || 'Unknown Company'} (${workingYears})`;
          }).join('\n');
        } else {
          experienceData = 'N/A';
        }
        
        return {
          'S.No': index + 1,
          'Name': user.name || 'N/A',
          'Roll Number': link.rollNumber || 'N/A',
          'Batch': link.batch || 'N/A',
          'Course Name': link.courseName || 'N/A',
          'Selected Course': link.selectedCourse || 'Not specified',
          'Location': user.location || 'N/A',
          'Experience': experienceData
        };
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better readability
      const colWidths = [
        { wch: 8 },   // S.No
        { wch: 25 },  // Name
        { wch: 15 },  // Roll Number
        { wch: 10 },  // Batch
        { wch: 25 },  // Course Name
        { wch: 20 },  // Location
        { wch: 50 }   // Experience (wider for multiple companies)
      ];
      ws['!cols'] = colWidths;

      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Alumni Data');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `AlumnLink_Data_${currentDate}.xlsx`;

      // Write the file
      XLSX.writeFile(wb, filename);
      
      toast.success(`Successfully downloaded ${excelData.length} records!`, { id: 'download' });
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Failed to download data. Please try again.', { id: 'download' });
    } finally {
      setProcessing(false);
    }
  }, []);

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
              <div className="max-w-2xl w-full">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-hover:text-[#fe6019]" />
                      <input
                        type="text"
                        placeholder="Search by name, roll number, batch, course..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019]/20 focus:border-[#fe6019] transition-all duration-200 bg-white shadow-sm hover:border-gray-400 text-sm"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fe6019]/20 focus:border-[#fe6019] min-w-[180px] cursor-pointer transition-colors duration-200"
                    >
                      {locationOptions.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
                    />
                  </div>
                </div>
                {searchQuery && (
                  <div className="mt-2 text-sm text-gray-600">
                    {pagination.totalCount > 0 ? (
                      <>
                        Found {pagination.totalCount} result{pagination.totalCount !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                        {selectedLocation !== 'All Chapters' && (
                          <span className="text-gray-500"> in {selectedLocation}</span>
                        )}
                        {pagination.totalPages > 1 && (
                          <span className="text-gray-500"> (Page {currentPage} of {pagination.totalPages})</span>
                        )}
                      </>
                    ) : (
                      <>
                        No results found for &quot;{searchQuery}&quot;
                        {selectedLocation !== 'All Chapters' && (
                          <span className="text-gray-500"> in {selectedLocation}</span>
                        )}
                      </>
                    )}
                  </div>
                )}
                {!searchQuery && pagination.totalCount > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    Showing {pagination.totalCount} total connections
                    {selectedLocation !== 'All Chapters' && (
                      <span> from {selectedLocation}</span>
                    )}
                    {pagination.totalPages > 1 && (
                      <span> (Page {currentPage} of {pagination.totalPages})</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium shadow-sm hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleDownloadData}
                  disabled={processing}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Download size={14} />
                  {processing ? 'Downloading...' : 'Download Excel'}
                </motion.button>
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
                          checked={links.length > 0 && selectedLinks.length === links.length}
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
                {links.length > 0 ? (
                  links.map((link, index) => (
                    <motion.tr 
                      key={link._id || Math.random().toString()} 
                      className={`hover:bg-[#fff5f0] transition-all duration-200 cursor-pointer ${
                        selectedLinks.includes(link._id) ? 'bg-[#fff5f0]' : ''
                      }`}
                      variants={rowVariants}
                      custom={index}
                      layout
                      onClick={() => handleUserProfileClick(link.user?.username)}
                      title="Click to view profile"
                    >
                      <td className="pl-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <label className="inline-flex">
                            <input 
                              type="checkbox" 
                              className="form-checkbox rounded border-gray-300 text-[#fe6019] focus:ring focus:ring-[#fe6019]/20 h-5 w-5 cursor-pointer"
                              checked={selectedLinks.includes(link._id)}
                              onChange={() => toggleLinkSelection(link._id)}
                              onClick={(e) => e.stopPropagation()}
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
                            <HighlightedText
                              text={link.user?.name || "Unknown User"}
                              searchTerm={searchQuery}
                              className="text-sm text-gray-900 font-medium block"
                            />
                            <HighlightedText
                              text={`@${link.user?.username || "username"}`}
                              searchTerm={searchQuery}
                              className="text-xs text-gray-500"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Code size={18} className="text-[#fe6019]" />
                          <HighlightedText
                            text={typeof link.rollNumber === 'string' ? link.rollNumber : String(link.rollNumber) || 'N/A'}
                            searchTerm={searchQuery}
                            className="text-sm text-gray-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Calendar size={18} className="text-[#fe6019]" />
                          <HighlightedText
                            text={typeof link.batch === 'string' ? link.batch : String(link.batch) || 'N/A'}
                            searchTerm={searchQuery}
                            className="text-sm text-gray-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <BookOpen size={18} className="text-[#fe6019]" />
                          <HighlightedText
                            text={link.courseName || 'N/A'}
                            searchTerm={searchQuery}
                            className="text-sm text-gray-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <BookOpen size={18} className="text-[#fe6019]" />
                          <HighlightedText
                            text={link.selectedCourse || 'Not specified'}
                            searchTerm={searchQuery}
                            className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-md"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <MapPin size={18} className="text-[#fe6019]" />
                          <HighlightedText
                            text={link.user?.location || 'N/A'}
                            searchTerm={searchQuery}
                            className="text-sm text-gray-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <motion.button
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors duration-200 disabled:opacity-50"
                            aria-label="Reset to Pending"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetToPending(link._id);
                            }}
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
                      {searchQuery ? `No connections found matching "${searchQuery}"` : "No connections found"}
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
                currentPage={currentPage}
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

export default UserLinks;
