import React, { useEffect, useState } from "react";
import { FaSearch, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [requests, setRequests] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRejected, setLoadingRejected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
    fetchRejectedUsers();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/links/pending");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setError("Error fetching pending requests.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectedUsers = async () => {
    setLoadingRejected(true);
    try {
      const response = await axiosInstance.get("/links/rejected");
      setRejectedUsers(response.data);
    } catch (error) {
      console.error("Error fetching rejected users:", error);
      setError("Error fetching rejected users.");
    } finally {
      setLoadingRejected(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/links/${id}/status`, { status });
      setRejectedUsers((prev) => prev.filter((user) => user._id !== id));
      if (status === "accepted") fetchPendingRequests();
      toast.success(`Request ${status} successfully!`);
    } catch (error) {
      console.error(`Error updating request to ${status}:`, error);
      toast.error(`Error updating request to ${status}.`);
    }
  };


  const deleteRequest = async (id) => {
    try {
      await axiosInstance.delete(`/links/${id}`);
      setRejectedUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Error deleting request.");
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(searchTerm) ||
    request.rollNumber.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="p-6 w-[80vw]">
      <h1 className="text-2xl font-bold mb-4">Manage User Requests</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-4 flex space-x-4 items-center">
            <div className="flex items-center border border-gray-300 rounded">
              <FaSearch className="ml-2" />
              <input
                type="text"
                placeholder="Search"
                className="px-2 py-1"
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Roll Number</th>
                  <th className="px-6 py-3 font-medium">Batch</th>
                  <th className="px-6 py-3 font-medium">Course</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request._id} className="border-t bg-white">
                      <td className="px-6 py-4">{request.name}</td>
                      <td className="px-6 py-4">{request.rollNumber}</td>
                      <td className="px-6 py-4">{request.batch}</td>
                      <td className="px-6 py-4">{request.courseName}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded"
                          aria-label="Accept"
                          onClick={() => updateRequestStatus(request._id, "accepted")}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                          aria-label="Reject"
                          onClick={() => updateRequestStatus(request._id, "rejected")}
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No pending requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mb-4">Rejected Users</h2>
          {loadingRejected ? (
            <div>Loading rejected users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-800 text-white text-left">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Roll Number</th>
                    <th className="px-6 py-3 font-medium">Batch</th>
                    <th className="px-6 py-3 font-medium">Course</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedUsers.length > 0 ? (
                    rejectedUsers.map((user) => (
                      <tr key={user._id} className="border-t bg-white">
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.rollNumber}</td>
                        <td className="px-6 py-4">{user.batch}</td>
                        <td className="px-6 py-4">{user.courseName}</td>
                        <td className="px-6 py-4 flex space-x-2">
                          <button
                            className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded"
                            aria-label="Accept"
                            onClick={() => updateRequestStatus(user._id, "accepted")}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                            aria-label="Delete"
                            onClick={() => deleteRequest(user._id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No rejected users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageUsers;
