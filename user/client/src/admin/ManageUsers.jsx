import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

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

    const fetchRequests = async (page = 1) => {
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
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusChange = async (requestId, action) => {
        setActionLoading((prev) => ({ ...prev, [requestId]: true }));
    
        try {
            // Determine the appropriate endpoint based on the action
            const endpoint = action === "accepted" ? `/links/accept/${requestId}` : `/links/reject/${requestId}`;
    
            // Make the API request
            const response = await axiosInstance.put(endpoint);
    
            if (response.data.success) {
                // Update local state immediately
                setRequests((prevRequests) =>
                    prevRequests.filter((request) => request._id !== requestId)
                );
    
                // Update pagination count
                setPagination((prev) => ({
                    ...prev,
                    totalRequests: Math.max(0, prev.totalRequests - 1),
                }));
    
                // Fetch new page if necessary
                if (requests.length === 1 && pagination.currentPage > 1) {
                    fetchRequests(pagination.currentPage - 1);
                }
            } else {
                console.error(`Failed to ${action} the request.`);
            }
        } catch (error) {
            console.error(`Error ${action}ing request ${requestId}:`, error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [requestId]: false }));
        }
    };
    

    const handlePageChange = (newPage) => {
        fetchRequests(newPage);
    };

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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <TableRow key={request._id}>
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
                                        <TableCell>
                                            <div className="space-x-2">
                                            <Button
    size="sm"
    variant="outline"
    className="bg-green-50 text-green-600 hover:bg-green-100 min-w-[80px]"
    onClick={() => handleStatusChange(request._id, "accepted")}
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
    onClick={() => handleStatusChange(request._id, "rejected")}
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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No link requests found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {requests.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-500">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!pagination.hasPreviousPage}
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!pagination.hasNextPage}
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkRequestsTable;
