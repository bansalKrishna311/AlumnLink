import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios"; // Import the axios instance
import toast from "react-hot-toast"; // Importing react-hot-toast

const ManageUsers = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch the network requests from the backend
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/network-requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      // Update the status of the request in the backend
      await axiosInstance.patch(`/network-requests/${id}`, { status });

      // Removing the request from the list (approved or rejected)
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id)
      );
      
      // Show success toast for the action
      toast.success(`Request ${status === "Approved" ? "approved" : "rejected"} successfully!`);
    } catch (error) {
      // Show error toast if there's an issue with the request
      console.error("Error updating request status:", error);
      toast.error("Error updating request status.");
    }
  };

  return (
    <div className="p-6 w-[85vw]">
      <h1 className="text-2xl font-bold mb-4">Manage User Requests</h1>
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
            {requests
              .filter((request) => request.status === "Pending") // Only show requests with Pending status
              .map((request) => (
                <tr key={request._id} className="border-t bg-white">
                  <td className="px-6 py-4">{request.name}</td>
                  <td className="px-6 py-4">{request.rollNumber}</td>
                  <td className="px-6 py-4">{request.batch}</td>
                  <td className="px-6 py-4">{request.courseName}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    {/* Accept button */}
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded"
                      aria-label="Accept"
                      onClick={() => handleStatusUpdate(request._id, "Approved")}
                    >
                      <FaCheck />
                    </button>
                    {/* Reject button */}
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                      aria-label="Reject"
                      onClick={() => handleStatusUpdate(request._id, "Rejected")}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
