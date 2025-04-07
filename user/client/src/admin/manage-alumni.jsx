import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import { 
  UserCircle2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  MapPin, 
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const UserLinks = () => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Helper function to safely convert to string and check if it includes search query
  const safeIncludes = (value, query) => {
    // Convert to string only if value exists and isn't already a string
    if (value === null || value === undefined) return false;
    
    const stringValue = typeof value === 'string' ? value : String(value);
    return stringValue.toLowerCase().includes(query.toLowerCase());
  };

  useEffect(() => {
    fetchUserLinks();
  }, []);

  useEffect(() => {
    // Safely filter links based on search query with type checking
    if (!links || !Array.isArray(links) || links.length === 0) {
      setFilteredLinks([]);
      return;
    }
    
    try {
      const filtered = links.filter(link => {
        if (!link) return false;
        
        // Use the safeIncludes helper for all checks
        const nameMatch = link.user && safeIncludes(link.user.name, searchQuery);
        const usernameMatch = link.user && safeIncludes(link.user.username, searchQuery);
        const locationMatch = link.user && safeIncludes(link.user.location, searchQuery);
        const courseMatch = safeIncludes(link.courseName, searchQuery);
        const batchMatch = safeIncludes(link.batch, searchQuery);
        const rollMatch = safeIncludes(link.rollNumber, searchQuery);
        
        return nameMatch || usernameMatch || locationMatch || courseMatch || batchMatch || rollMatch;
      });
      
      setFilteredLinks(filtered);
      setCurrentPage(1); // Reset to first page when search changes
    } catch (err) {
      console.error("Error in filtering:", err);
      // In case of error, don't change the current filtered list
    }
  }, [searchQuery, links]);

  const fetchUserLinks = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/links');
      
      // Ensure we have valid data before setting state
      if (response && response.data && Array.isArray(response.data)) {
        setLinks(response.data);
        setFilteredLinks(response.data);
      } else {
        setLinks([]);
        setFilteredLinks([]);
        setError("Received invalid data format");
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message || "An error occurred while fetching data");
      setLinks([]);
      setFilteredLinks([]);
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConnectionColor = (connection) => {
    return connection === 'sent' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  // Pagination logic with safeguards
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLinks?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.max(1, Math.ceil((filteredLinks?.length || 0) / itemsPerPage));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    try {
      setSearchQuery(e.target.value);
    } catch (err) {
      console.error("Error in search:", err);
      // Don't update state if there's an error
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center text-red-600">
            <XCircle className="h-5 w-5 mr-2" />
            <p>Error loading connections: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle className="text-2xl font-bold text-gray-900">Your Connections</CardTitle>
        
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search connections..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9 pr-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <Separator className="my-4" />

      <div className="space-y-4">
        {currentItems && currentItems.length > 0 ? (
          currentItems.map((link) => (
            <Card 
              key={link._id || Math.random().toString()} 
              className="border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow"
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {link.user?.profilePicture ? (
                      <img
                        src={link.user.profilePicture}
                        alt={link.user?.name || "User"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserCircle2 className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{link.user?.name || "Unknown User"}</h3>
                      <div className="flex items-center text-gray-500">
                        <span>@{link.user?.username || "username"}</span>
                      </div>
                     
                      {link.user?.location && (
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                          <span>{typeof link.user.location === 'string' ? link.user.location : 'Location'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={getConnectionColor(link.connection)}>
                        {link.connection === 'sent' ? 'Sent' : 'Received'}
                      </Badge>
                      <Badge className={getStatusColor(link.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(link.status)}
                          <span className="ml-1">{getStatusText(link.status)}</span>
                        </span>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {typeof link.courseName === 'string' ? link.courseName : 'Unknown Course'} • 
                      {typeof link.batch === 'string' ? link.batch : String(link.batch) || 'Unknown Batch'}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between md:block">
                    <span className="text-gray-500">Roll Number:</span>
                    <span className="font-medium text-gray-900">
                      {typeof link.rollNumber === 'string' ? link.rollNumber : String(link.rollNumber) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between md:block">
                    <span className="text-gray-500">Connected:</span>
                    <span className="font-medium text-gray-900">
                      {link.createdAt ? new Date(link.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : "Unknown date"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserCircle2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No connections found</h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery ? 'Try adjusting your search query.' : 'Start connecting with other users to build your network.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination controls */}
      {filteredLinks && filteredLinks.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLinks.length)} of {filteredLinks.length} connections
          </p>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              // Logic for showing pages around current page
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (currentPage <= 3) {
                pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = currentPage - 2 + index;
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(pageNumber)}
                  className="h-8 w-8 p-0"
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLinks;