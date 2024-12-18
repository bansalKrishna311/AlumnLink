import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import { axiosInstance } from "@/lib/axios"; // Import the axios instance
import toast from "react-hot-toast"; // Importing react-hot-toast

const ManageUsers = () => {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true); // To track loading state
    const [error, setError] = useState(null); // To track errors

    useEffect(() => {
        // Fetch the link requests from the backend
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.get("/links/requests"); // Ensure correct endpoint
                setRequests(response.data);
                console.log("Fetched Requests:", response.data); // Debugging log
            } catch (error) {
                console.error("Error fetching requests:", error);
                setError("Error fetching requests.");
            } finally {
                setLoading(false); // Set loading to false once the fetch is complete
            }
        };

        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            // Update the status of the request in the backend
            await axiosInstance.put(`/links/accept/${id}`, { status });

            // Update the state to reflect changes
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request._id === id ? { ...request, status } : request
                )
            );

            // Show success toast for the action
            toast.success(`Request ${status === "accepted" ? "accepted" : "rejected"} successfully!`);
        } catch (error) {
            // Show error toast if there's an issue with the request
            console.error("Error updating request status:", error);
            toast.error("Error updating request status.");
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        try {
            await Promise.all(
                requests.map((request) =>
                    axiosInstance.put(`/links/accept/${request._id}`, { status })
                )
            );
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.status === "Pending" ? { ...request, status } : request
                )
            );
            toast.success(`All requests ${status === "accepted" ? "accepted" : "rejected"} successfully!`);
        } catch (error) {
            console.error("Error updating request statuses:", error);
            toast.error("Error updating request statuses.");
        }
    };

    const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

    const filteredRequests = requests
        .filter((request) =>
            request.name.toLowerCase().includes(searchTerm) || request.rollNumber.toLowerCase().includes(searchTerm)
        );

  return (
    <div className="p-6 w-[85vw]">
      <h1 className="text-2xl font-bold mb-4">Manage User Requests</h1>

            {/* Error Message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Loading Spinner */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {/* Search controls */}
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

                        {/* Accept all and Reject all buttons */}
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleBulkStatusUpdate("accepted")}
                        >
                            Accept All
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleBulkStatusUpdate("rejected")}
                        >
                            Reject All
                        </button>
                    </div>

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
                                {filteredRequests.map((request) => (
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
                                                onClick={() => handleStatusUpdate(request._id, "accepted")}
                                            >
                                                <FaCheck />
                                            </button>
                                            {/* Reject button */}
                                            <button
                                                className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                                                aria-label="Reject"
                                                onClick={() => handleStatusUpdate(request._id, "rejected")}
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

export default ManageUsers;
