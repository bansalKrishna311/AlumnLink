import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import { useSubAdmin } from '../context/SubAdminContext';
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
  Download,
  UserCog
} from 'lucide-react';
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import HighlightedText from "@/components/HighlightedText";
import HierarchyManagementModal from "@/components/HierarchyManagementModal";
import HierarchyBadge from "@/components/HierarchyBadge";

const UserLinks = () => {
  const navigate = useNavigate();
  const { targetAdminId } = useSubAdmin();
  
  console.log('🎯 UserLinks - targetAdminId from context:', targetAdminId);
  
  const [links, setLinks] = useState([]);
  const [allLinks, setAllLinks] = useState([]); // Store all links for client-side filtering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Chapters');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [availableCourses, setAvailableCourses] = useState(['All Courses']);
  
  // Hierarchy management modal state
  const [hierarchyModalOpen, setHierarchyModalOpen] = useState(false);
  const [selectedLinkForHierarchy, setSelectedLinkForHierarchy] = useState(null);
  
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
  
  // Client-side filtering function with course filter first, then search
  const filterLinks = useCallback((linksArray, query, courseFilter) => {
    let filtered = linksArray;
    
    // First filter by course if not "All Courses"
    if (courseFilter && courseFilter !== 'All Courses') {
      filtered = filtered.filter((link) => {
        const linkSelectedCourse = String(link.selectedCourse || '').toLowerCase();
        const linkCourseName = String(link.courseName || '').toLowerCase();
        const filterCourse = courseFilter.toLowerCase();
        
        return linkSelectedCourse.includes(filterCourse) || linkCourseName.includes(filterCourse);
      });
    }
    
    // Then filter by search query if provided
    if (!query || !query.trim()) {
      return filtered;
    }
    
    const searchTerm = query.toLowerCase().trim();
    return filtered.filter((link) => {
      // Check both new API structure (alumniInfo/sender) and legacy structure (user)
      const name = link.alumniInfo?.name?.toLowerCase() || link.sender?.name?.toLowerCase() || link.user?.name?.toLowerCase() || '';
      const username = link.alumniInfo?.username?.toLowerCase() || link.sender?.username?.toLowerCase() || link.user?.username?.toLowerCase() || '';
      const rollNumber = String(link.rollNumber || link.academicDetails?.rollNumber || '').toLowerCase();
      const batch = String(link.batch || link.academicDetails?.batch || '').toLowerCase();
      const location = link.alumniInfo?.location?.toLowerCase() || link.sender?.location?.toLowerCase() || link.user?.location?.toLowerCase() || '';
      
      return name.includes(searchTerm) ||
             username.includes(searchTerm) ||
             rollNumber.includes(searchTerm) ||
             batch.includes(searchTerm) ||
             location.includes(searchTerm);
    });
  }, []);

  // Apply client-side filtering and pagination when search query, course filter, or page changes
  useEffect(() => {
    let filtered = filterLinks(allLinks, searchQuery, selectedCourse);
    
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
  }, [searchQuery, selectedCourse, allLinks, filterLinks, currentPage]);

  // Reset to page 1 when search query or course filter changes
  useEffect(() => {
    if (searchQuery || selectedCourse !== 'All Courses') {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCourse]);

  // Extract available courses from alumni data
  useEffect(() => {
    const extractCoursesFromData = () => {
      const allAssignedCourses = new Set(['All Courses']);
      
      // Extract courses directly from alumni data
      allLinks.forEach(link => {
        if (link.selectedCourse && link.selectedCourse.trim()) {
          allAssignedCourses.add(link.selectedCourse.trim());
        }
      });
      
      setAvailableCourses(Array.from(allAssignedCourses).sort());
    };

    extractCoursesFromData();
  }, [allLinks]);

  const fetchUserLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch ALL data for client-side filtering and pagination
      const params = new URLSearchParams({
        limit: '10000' // Get all records
      });
      
      // Add target admin ID if available
      if (targetAdminId) {
        console.log('🎯 SubManageAlumni - Adding targetAdminId to API call:', targetAdminId);
        params.append('adminId', targetAdminId);
      } else {
        console.log('⚠️ SubManageAlumni - No targetAdminId found, using current user');
      }
      
      console.log('🌐 SubManageAlumni - Final API URL params:', params.toString());
      
      // Add location filter to server request if it's not "All Chapters"
      if (selectedLocation && selectedLocation !== 'All Chapters') {
        params.append('location', selectedLocation);
      }
      
      const response = await axiosInstance.get(`/links/subadmin/managed-alumni?${params}`);
      
      // Ensure we have valid data before setting state
      if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
        const allData = response.data.data; // New API returns data in data.data
        setAllLinks(allData);
        
        // Use pagination info from API response
        const paginationInfo = response.data.pagination;
        setPagination({
          totalCount: paginationInfo?.totalItems || allData.length,
          totalPages: paginationInfo?.totalPages || Math.ceil(allData.length / 10),
          currentPage: paginationInfo?.currentPage || 1,
          pageSize: 10
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
  }, [selectedLocation, targetAdminId]);

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

  const handleCourseChange = useCallback((course) => {
    setSelectedCourse(course);
    // Reset pagination when changing course
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
            // Handle both new API structure and legacy structure
            const username = link.alumniInfo?.username || link.sender?.username || link.user?.username;
            if (username) {
              const userResponse = await axiosInstance.get(`/users/${username}`);
              return { ...link, userDetails: userResponse.data };
            }
            return { ...link, userDetails: null };
          } catch (error) {
            const username = link.alumniInfo?.username || link.sender?.username || link.user?.username;
            console.error(`Error fetching details for user ${username}:`, error);
            return { ...link, userDetails: null };
          }
        })
      );

      // Prepare data for Excel export
      const excelData = detailedUsers.map((link, index) => {
        // Handle both new API structure and legacy structure
        const user = link.userDetails || link.alumniInfo || link.sender || link.user || {};
        
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
          'Roll Number': link.rollNumber || link.academicDetails?.rollNumber || 'N/A',
          'Batch': link.batch || link.academicDetails?.batch || 'N/A',
          'Course Name': link.courseName || link.academicDetails?.courseName || 'N/A',
          'Selected Course': link.selectedCourse || link.academicDetails?.selectedCourse || 'Not specified',
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

  // Handle hierarchy management
  const handleHierarchyManagement = useCallback((link) => {
    setSelectedLinkForHierarchy(link);
    setHierarchyModalOpen(true);
  }, []);

  const handleHierarchyModalClose = useCallback(() => {
    setHierarchyModalOpen(false);
    setSelectedLinkForHierarchy(null);
  }, []);

  const handleHierarchySuccess = useCallback(() => {
    // Refresh the data to show updated hierarchy
    fetchUserLinks();
  }, [fetchUserLinks]);

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
                        placeholder="Search by name, roll number, batch..."
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
                  <div className="relative">
                    <select
                      value={selectedCourse}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fe6019]/20 focus:border-[#fe6019] min-w-[180px] cursor-pointer transition-colors duration-200"
                    >
                      {availableCourses.map((course) => (
                        <option key={course} value={course}>
                          {course}
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
                        {selectedCourse !== 'All Courses' && (
                          <span className="text-gray-500"> for {selectedCourse} course</span>
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
                        {selectedCourse !== 'All Courses' && (
                          <span className="text-gray-500"> for {selectedCourse} course</span>
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
                    {selectedCourse !== 'All Courses' && (
                      <span> for {selectedCourse} course</span>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Hierarchy</th>
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
                      onClick={() => handleUserProfileClick(link.alumniInfo?.username || link.sender?.username || link.user?.username)}
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
                          {(link.alumniInfo?.profilePicture || link.sender?.profilePicture || link.user?.profilePicture) ? (
                            <img
                              src={link.alumniInfo?.profilePicture || link.sender?.profilePicture || link.user?.profilePicture}
                              alt={(link.alumniInfo?.name || link.sender?.name || link.user?.name) || "User"}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <User size={18} className="text-[#fe6019]" />
                          )}
                          <div>
                            <HighlightedText
                              text={(link.alumniInfo?.name || link.sender?.name || link.user?.name) || "Unknown User"}
                              searchTerm={searchQuery}
                              className="text-sm text-gray-900 font-medium block"
                            />
                            <HighlightedText
                              text={`@${link.alumniInfo?.username || link.sender?.username || link.user?.username || "username"}`}
                              searchTerm={searchQuery}
                              className="text-xs text-gray-500"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <HierarchyBadge 
                          hierarchy={link.adminHierarchy || 'alumni'} 
                          size="sm"
                          showIcon={true}
                        />
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
                            text={(link.alumniInfo?.location || link.sender?.location || link.user?.location) || 'N/A'}
                            searchTerm={searchQuery}
                            className="text-sm text-gray-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center space-x-2">
                          {/* Reset to Pending Button */}
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
                          
                          {/* Hierarchy Management Button */}
                          <motion.button
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
                            aria-label="Manage Hierarchy"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHierarchyManagement(link);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <UserCog size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-6xl">👥</div>
                        <div className="text-lg font-medium text-gray-700">
                          {searchQuery ? `No connections found matching "${searchQuery}"` : "No Managed Alumni Yet"}
                        </div>
                        {!searchQuery && (
                          <div className="text-sm text-gray-500 max-w-md text-center">
                            You'll see alumni connections here once users request access and you accept their requests. 
                            Alumni can request connections through the main platform.
                          </div>
                        )}
                      </div>
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

      {/* Hierarchy Management Modal */}
      <HierarchyManagementModal
        isOpen={hierarchyModalOpen}
        onClose={handleHierarchyModalClose}
        linkRequest={selectedLinkForHierarchy}
        onSuccess={handleHierarchySuccess}
      />
    </div>
  );
};


export default UserLinks;
