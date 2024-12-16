import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios"; // Import the axios instance
import toast from "react-hot-toast"; // Importing react-hot-toast

const ManageAlumni = () => {
  const [approvedUsers, setApprovedUsers] = useState([]); // State for approved users only
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/network-requests");
        // Filter only approved users
        setApprovedUsers(response.data.filter((request) => request.status === "Approved"));
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError("Error fetching requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredApprovedUsers = approvedUsers
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm) || user.rollNumber.toLowerCase().includes(searchTerm)
    );

  const handleReject = async (id) => {
    try {
      await axiosInstance.patch(`/network-requests/${id}`, { status: "Rejected" });
      setApprovedUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
      toast.success("User rejected successfully!");
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Error rejecting user.");
    }
  };

  return (
    <div className="p-6 w-[80vw]">
      <h1 className="text-2xl font-bold mb-4">Manage Approved Alumni</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-4 flex space-x-4">
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

          <h2 className="text-xl font-semibold mb-4">Approved Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Admission No.</th>
                  <th className="px-6 py-3 font-medium">Batch</th>
                  <th className="px-6 py-3 font-medium">Course Name</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApprovedUsers.map((user) => (
                  <tr key={user._id} className="border-t bg-white">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.rollNumber}</td>
                    <td className="px-6 py-4">{user.batch}</td>
                    <td className="px-6 py-4">{user.courseName}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                        aria-label="Reject"
                        onClick={() => handleReject(user._id)}
                      >
                        <FaTimes />
                      </button>
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

export default ManageAlumni;
