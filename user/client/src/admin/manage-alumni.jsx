import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

const ApprovedUsers = () => {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApprovedUsers();
  }, []);

  const fetchApprovedUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/links/accepted");
      setApprovedUsers(response.data);
    } catch (error) {
      console.error("Error fetching approved users:", error);
      setError("Error fetching approved users.");
      toast.error("Failed to fetch approved users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectUser = async (id) => {
    try {
      await axiosInstance.patch(`/links/${id}/status`, { status: "rejected" });
      setApprovedUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User rejected successfully!");
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user.");
    }
  };

  return (
    <div className="p-6 w-[80vw]">
      <h1 className="text-2xl font-bold mb-4">Approved Users</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div>Loading...</div>
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
              {approvedUsers.length > 0 ? (
                approvedUsers.map((user) => (
                  <tr key={user._id} className="border-t bg-white">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.rollNumber}</td>
                    <td className="px-6 py-4">{user.batch}</td>
                    <td className="px-6 py-4">{user.courseName}</td>
                    <td className="px-6 py-4">
                      <button
                        className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                        aria-label="Reject"
                        onClick={() => handleRejectUser(user._id)}
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No approved users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovedUsers;
