import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSearch, FaCheckSquare } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { User, MapPin, Calendar, BookOpen, Code, AlertTriangle, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Pagination from "@/components/Pagination";
import AccessLevelDropdown from "@/components/AccessLevelDropdown";

const ManageUsers = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [accessLevels, setAccessLevels] = useState({});
  const [showAccessLevelModal, setShowAccessLevelModal] = useState(false);
  const [selectedRequestForAccess, setSelectedRequestForAccess] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/links/link-requests?page=${page}&limit=10`);
        setRequests(response.data.data);
        setPagination(response.data.pagination);
        
        // Initialize access levels for each request
        const initialAccessLevels = {};
        response.data.data.forEach(request => {
          initialAccessLevels[request._id] = 'level0';
        });
        setAccessLevels(initialAccessLevels);
        
        setError(null);
      } catch (error) {
        console.error("Error fetching requests:", error);
        // Handle 404 specifically as "no data" rather than an error
        if (error.response && error.response.status === 404) {
          setRequests([]);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalRequests: 0,
            hasNextPage: false,
            hasPreviousPage: false
          });
          setError(null);
        } else {
          setError("Unable to connect to the server. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [page]);

  const handleStatusUpdate = async (id, status) => {
    try {
      if (status === "Approved") {
        // Show access level modal for approval
        setSelectedRequestForAccess({ id, status });
        setShowAccessLevelModal(true);
      } else {
        // Direct rejection
        await axiosInstance.put(`/links/reject/${id}`);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== id)
        );
        toast.success(`Request rejected successfully!`);
        
        // Update pagination after removing item
        setPagination(prev => ({
          ...prev,
          totalRequests: Math.max(0, prev.totalRequests - 1)
        }));
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Error updating request status.");
    }
  };

  const handleApproveWithAccessLevel = async () => {
    if (!selectedRequestForAccess) return;
    
    try {
      const { id } = selectedRequestForAccess;
      const accessLevel = accessLevels[id] || 'level0';
      
      // Accept the request with the selected access level
      await axiosInstance.put(`/links/accept/${id}`, {
        networkAccessLevel: accessLevel
      });
      
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id)
      );
      
      toast.success(`Request approved with ${accessLevel} access level!`);
      
      // Update pagination after removing item
      setPagination(prev => ({
        ...prev,
        totalRequests: Math.max(0, prev.totalRequests - 1)
      }));
      
      // Close modal and reset
      setShowAccessLevelModal(false);
      setSelectedRequestForAccess(null);
      
    } catch (error) {
      console.error("Error approving request with access level:", error);
      toast.error("Error approving request.");
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one request");
      return;
    }

    if (status === "Approved") {
      // For bulk approval, use default level0 access level
      setProcessing(true);
      const successCount = { value: 0 };
      const failCount = { value: 0 };

      try {
        const updatePromises = selectedRequests.map(async (id) => {
          try {
            await axiosInstance.put(`/links/accept/${id}`, {
              networkAccessLevel: 'level0'
            });
            successCount.value++;
            return id;
          } catch (error) {
            console.error(`Error approving request ${id}:`, error);
            failCount.value++;
            return null;
          }
        });

        const successfulIds = (await Promise.all(updatePromises)).filter(id => id !== null);
        
        setRequests(prevRequests => 
          prevRequests.filter(request => !successfulIds.includes(request._id))
        );
        
        setSelectedRequests([]);
        
        // Update pagination after removing items
        setPagination(prev => ({
          ...prev,
          totalRequests: Math.max(0, prev.totalRequests - successCount.value)
        }));
        
        if (successCount.value > 0) {
          toast.success(`${successCount.value} request${successCount.value > 1 ? 's' : ''} approved successfully with Member access level!`);
        }
        
        if (failCount.value > 0) {
          toast.error(`Failed to approve ${failCount.value} request${failCount.value > 1 ? 's' : ''}`);
        }
      } catch (error) {
        console.error(`Error in bulk approval:`, error);
        toast.error("An error occurred during batch processing");
      } finally {
        setProcessing(false);
      }
    } else {
      // Bulk rejection
      setProcessing(true);
      const route = "/reject";
      const successCount = { value: 0 };
      const failCount = { value: 0 };

      try {
        const updatePromises = selectedRequests.map(async (id) => {
          try {
            await axiosInstance.put(`/links${route}/${id}`);
            successCount.value++;
            return id;
          } catch (error) {
            console.error(`Error ${status === "Approved" ? "approving" : "rejecting"} request ${id}:`, error);
            failCount.value++;
            return null;
          }
        });

        const successfulIds = (await Promise.all(updatePromises)).filter(id => id !== null);
        
        setRequests(prevRequests => 
          prevRequests.filter(request => !successfulIds.includes(request._id))
        );
        
        setSelectedRequests([]);
        
        // Update pagination after removing items
        setPagination(prev => ({
          ...prev,
          totalRequests: Math.max(0, prev.totalRequests - successCount.value)
        }));
        
        if (successCount.value > 0) {
          toast.success(`${successCount.value} request${successCount.value > 1 ? 's' : ''} ${status === "Approved" ? "approved" : "rejected"} successfully!`);
        }
        
        if (failCount.value > 0) {
          toast.error(`Failed to ${status === "Approved" ? "approve" : "reject"} ${failCount.value} request${failCount.value > 1 ? 's' : ''}`);
        }
      } catch (error) {
        console.error(`Error in bulk ${status}:`, error);
        toast.error("An error occurred during batch processing");
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const toggleRequestSelection = (id) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(requestId => requestId !== id)
        : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(request => request._id));
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      request?.sender?.name?.toLowerCase().includes(searchTerm) ||
      request?.rollNumber?.toLowerCase().includes(searchTerm)
  );

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
        Manage User Requests
      </motion.h1>

      <motion.div
        className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
          <p>Pending requests will be automatically deleted after 30 days. Please review them in a timely manner.</p>
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

      {loading ? (
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
                  placeholder="Search by name or roll number..."
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  className="px-4 py-2 bg-[#fe6019] text-white rounded-lg font-medium shadow-sm hover:bg-[#e05617] transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => handleBulkStatusUpdate("Approved")}
                  disabled={processing || selectedRequests.length === 0}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaCheck size={14} />
                  {processing ? 'Processing...' : 'Accept Selected'}
                </motion.button>

                <motion.button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow-sm hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => handleBulkStatusUpdate("Rejected")}
                  disabled={processing || selectedRequests.length === 0}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaTimes size={14} />
                  {processing ? 'Processing...' : 'Reject Selected'}
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
                          checked={filteredRequests.length > 0 && selectedRequests.length === filteredRequests.length}
                          onChange={toggleAllSelection}
                        />
                      </label>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Selected Course</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                className="divide-y divide-gray-200 bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredRequests.map((request, index) => (
                  <motion.tr 
                    key={request._id} 
                    className={`hover:bg-[#fff5f0] transition-all duration-200 ${
                      selectedRequests.includes(request._id) ? 'bg-[#fff5f0]' : ''
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
                            checked={selectedRequests.includes(request._id)}
                            onChange={() => toggleRequestSelection(request._id)}
                          />
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <User size={18} className="text-[#fe6019]" />
                        <span className="text-sm text-gray-900 font-medium">{request?.sender?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Code size={18} className="text-[#fe6019]" />
                        <span className="text-sm text-gray-600">{request?.rollNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Calendar size={18} className="text-[#fe6019]" />
                        <span className="text-sm text-gray-600">{request?.batch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <BookOpen size={18} className="text-[#fe6019]" />
                        <span className="text-sm text-gray-600">{request?.courseName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <BookOpen size={18} className="text-[#fe6019]" />
                        <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-md">
                          {request?.selectedCourse || 'Not specified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <MapPin size={18} className="text-[#fe6019]" />
                        <span className="text-sm text-gray-600">{request?.sender?.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Calendar size={18} className="text-[#fe6019]" />
                        <span className="text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <motion.button
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#fff5f0] text-[#fe6019] hover:bg-[#fe6019] hover:text-white transition-colors duration-200"
                          aria-label="Accept"
                          onClick={() => handleStatusUpdate(request._id, "Approved")}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaCheck size={14} />
                        </motion.button>
                        <motion.button
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                          aria-label="Reject"
                          onClick={() => handleStatusUpdate(request._id, "Rejected")}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTimes size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-gray-500 italic">
                      No requests found
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </motion.div>

          {selectedRequests.length > 0 && (
            <motion.div 
              className="mt-4 p-3 bg-[#fff5f0] rounded-lg border border-[#fe6019]/20 text-sm text-gray-700 flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div>
                <span className="font-medium text-[#fe6019]">{selectedRequests.length}</span> request{selectedRequests.length !== 1 ? 's' : ''} selected
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 underline text-sm"
                onClick={() => setSelectedRequests([])}
              >
                Clear selection
              </button>
            </motion.div>
          )}
          
          {/* Pagination Component */}
          {pagination.totalPages > 1 && (
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </motion.div>
          )}
        </>
      )}

      {/* Access Level Modal */}
      {showAccessLevelModal && selectedRequestForAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#fe6019]" />
              <h3 className="text-lg font-semibold text-gray-900">Set Access Level</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Choose the network access level for this user when approving their request.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network Access Level
              </label>
              <AccessLevelDropdown
                selectedLevel={accessLevels[selectedRequestForAccess.id] || 'level0'}
                onLevelChange={(level) => setAccessLevels(prev => ({ ...prev, [selectedRequestForAccess.id]: level }))}
                showLabels={true}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAccessLevelModal(false);
                  setSelectedRequestForAccess(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveWithAccessLevel}
                className="flex-1 px-4 py-2 bg-[#fe6019] text-white rounded-lg hover:bg-[#e05617] transition-colors"
              >
                Approve Request
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;