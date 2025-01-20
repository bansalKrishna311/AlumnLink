import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { User, MapPin, Calendar, BookOpen, Code } from "lucide-react";

const ManageUsers = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get(`/links/link-requests?page=${page}&limit=10`);
        setRequests(response.data.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError("Error fetching requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [page]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const route = status === "Approved" ? "/accept" : "/reject";
      await axiosInstance.put(`/links${route}/${id}`);
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id)
      );
      toast.success(`Request ${status === "Approved" ? "approved" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Error updating request status.");
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredRequests = requests.filter(
    (request) =>
      request?.sender?.name?.toLowerCase().includes(searchTerm) ||
      request?.rollNumber?.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage User Requests</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or roll number..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <User size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-900 font-medium">{request?.sender?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Code size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{request?.rollNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Calendar size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{request?.batch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <BookOpen size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{request?.courseName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <MapPin size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{request?.sender?.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Calendar size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200"
                          aria-label="Accept"
                          onClick={() => handleStatusUpdate(request._id, "Approved")}
                        >
                          <FaCheck size={14} />
                        </button>
                        <button
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                          aria-label="Reject"
                          onClick={() => handleStatusUpdate(request._id, "Rejected")}
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;