import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios"; // Adjust the path if necessary

const ManageUsers = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/links/pending");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/links/${id}/status`, { status });
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      console.error(`Error updating request to ${status}:`, error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Manage User Requests</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Batch</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request._id}>
                <td>{request.name}</td>
                <td>{request.rollNumber}</td>
                <td>{request.batch}</td>
                <td>{request.courseName}</td>
                <td>
                  <button
                    onClick={() => updateRequestStatus(request._id, "accepted")}
                    style={{ marginRight: "10px", color: "green" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateRequestStatus(request._id, "rejected")}
                    style={{ color: "red" }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No pending requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
