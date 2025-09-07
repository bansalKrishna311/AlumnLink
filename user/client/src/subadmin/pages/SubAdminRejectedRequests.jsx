import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaEye } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { User, MapPin, Calendar, BookOpen, Code, AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Pagination from "@/components/Pagination";

const SubAdminRejectedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [networkInfo, setNetworkInfo] = useState({});

  useEffect(() => {
    const fetchRejectedRequests = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/links/subadmin/rejected?page=${page}&limit=10`);
        setRequests(response.data.data);
        setPagination(response.data.pagination);
        setNetworkInfo(response.data.networkInfo || {});
        setError(null);
      } catch (error) {
        console.error("Error fetching rejected requests:", error);
        if (error.response && error.response.status === 404) {
          setRequests([]);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false
          });
          setError(null);
        } else {
          setError("Unable to connect to the server. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedRequests();
  }, [page]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredRequests = requests.filter(
    (request) =>
      request?.user?.name?.toLowerCase().includes(searchTerm) ||
      request?.rollNumber?.toLowerCase().includes(searchTerm) ||
      request?.recipient?.name?.toLowerCase().includes(searchTerm)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHierarchyDisplayName = (hierarchy) => {
    if (!hierarchy) return 'Alumni';
    return hierarchy.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

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
        Rejected Requests
      </motion.h1>

      <motion.div
        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            <p>Viewing rejected requests within your network - {networkInfo.rejectedRequestsInNetwork || 0} total rejected requests</p>
          </div>
          <div className="text-sm text-red-600">
            Network size: {networkInfo.connectedUsers || 0} users
          </div>
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
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  {filteredRequests.length} rejected requests
                </span>
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
                <tr className="bg-red-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Request Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Sender → Recipient</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Academic Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Hierarchy</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Rejected Date</th>
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
                    className="hover:bg-red-50 transition-all duration-200"
                    variants={rowVariants}
                    custom={index}
                    layout
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Code size={16} className="text-red-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {request?.rollNumber || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin size={16} className="text-red-500" />
                          <span className="text-sm text-gray-600">
                            {request?.user?.location || 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-red-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {request?.user?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>→</span>
                          <span className="ml-1">{request?.recipient?.name || 'Unknown'}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Calendar size={16} className="text-red-500" />
                          <span className="text-sm text-gray-600">
                            Batch: {request?.batch || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <BookOpen size={16} className="text-red-500" />
                          <span className="text-sm text-gray-600">
                            {request?.courseName || 'N/A'}
                          </span>
                        </div>
                        {request?.selectedCourse && (
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {request.selectedCourse}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {getHierarchyDisplayName(request?.adminHierarchy)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Calendar size={16} className="text-red-500" />
                        <span className="text-sm text-gray-600">
                          {formatDate(request.updatedAt)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                      {requests.length === 0 ? "No rejected requests found in your network" : "No requests match your search"}
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </motion.div>
          
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
    </div>
  );
};

export default SubAdminRejectedRequests;
