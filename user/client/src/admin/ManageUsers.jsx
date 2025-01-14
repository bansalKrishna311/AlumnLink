import React, { useEffect, useState, useCallback, memo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

// Memoized table row component to prevent unnecessary re-renders
const RequestRow = memo(({ request, onStatusChange, actionLoading }) => (
  <TableRow>
    <TableCell>
      <div>
        <div className="font-medium">{request.sender?.name}</div>
        <div className="text-sm text-gray-500">{request.sender?.email}</div>
      </div>
    </TableCell>
    <TableCell>{request.academicDetails.rollNumber}</TableCell>
    <TableCell>{request.academicDetails.batch}</TableCell>
    <TableCell>{request.academicDetails.courseName}</TableCell>
    <TableCell>
      {new Date(request.createdAt).toLocaleDateString()}
    </TableCell>
    <TableCell>{request.sender?.location}</TableCell> {/* Added location column */}
    <TableCell>
      <div className="space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-green-50 text-green-600 hover:bg-green-100 min-w-[80px]"
          onClick={() => onStatusChange(request._id, "accepted")}
          disabled={actionLoading[request._id]}
        >
          {actionLoading[request._id] ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            "Accept"
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-red-50 text-red-600 hover:bg-red-100 min-w-[80px]"
          onClick={() => onStatusChange(request._id, "rejected")}
          disabled={actionLoading[request._id]}
        >
          {actionLoading[request._id] ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            "Reject"
          )}
        </Button>
      </div>
    </TableCell>
  </TableRow>
));

RequestRow.displayName = 'RequestRow';

// Memoized pagination component
const Pagination = memo(({ pagination, onPageChange }) => (
  <div className="flex justify-between items-center mt-4">
    <p className="text-sm text-gray-500">
      Page {pagination.currentPage} of {pagination.totalPages}
    </p>
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!pagination.hasPreviousPage}
        onClick={() => onPageChange(pagination.currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!pagination.hasNextPage}
        onClick={() => onPageChange(pagination.currentPage + 1)}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  </div>
));

Pagination.displayName = 'Pagination';

const LinkRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchRequests = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/links/link-requests?page=${page}&limit=10`);
  
      if (response.data.success) {
        setRequests(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setRequests([]);
        setError("Failed to fetch requests");
      }
    } catch (error) {
      setError("Error fetching link requests");
      console.error("Error fetching link requests:", error);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, setRequests, setPagination, setError, setLoading]);
  

  useEffect(() => {
    fetchRequests(pagination.currentPage);
  }, [pagination.currentPage, fetchRequests]);

  const handleStatusChange = useCallback(async (requestId, action) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
  
    try {
      const endpoint = action === "accepted" ? `/links/accept/${requestId}` : `/links/reject/${requestId}`;
      const response = await axiosInstance.put(endpoint);
  
      if (response.data.success) {
        setPagination(prev => ({
          ...prev,
          totalRequests: prev.totalRequests - 1,
          currentPage: prev.totalRequests === 1 && prev.currentPage > 1 ? prev.currentPage - 1 : prev.currentPage,
        }));
        setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
      }
    } catch (error) {
      console.error(`Error ${action}ing request ${requestId}:`, error);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  }, [requests, pagination]);
  

  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 text-red-600">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Link Requests</h2>
        <div className="text-sm text-gray-500">
          Total Requests: {pagination.totalRequests}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead> {/* Added Location Header */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <RequestRow
                    key={request._id}
                    request={request}
                    onStatusChange={handleStatusChange}
                    actionLoading={actionLoading}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No link requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {requests.length > 0 && (
        <Pagination 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default LinkRequestsTable;
