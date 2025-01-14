import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import { UserCircle2, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const RejectedRequests = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserLinks();
  }, []);

  const fetchUserLinks = async () => {
    try {
      const response = await axiosInstance.get('/links/rejected');
      setLinks(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading connections: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Your Connections</h2>
      
      <div className="grid gap-4">
        {links.map((link) => (
          <div
            key={link._id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {link.user.profilePicture ? (
                  <img
                    src={link.user.profilePicture}
                    alt={link.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <UserCircle2 className="w-12 h-12 text-gray-400" />
                )}
                
                <div>
                  <h3 className="font-semibold text-lg">{link.user.name}</h3>
                  <p className="text-gray-600">@{link.user.username}</p>
                  {link.user.headline && (
                    <p className="text-sm text-gray-500 mt-1">{link.user.headline}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    link.connection === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {link.connection === 'sent' ? 'Sent' : 'Received'}
                  </span>
                  {getStatusIcon(link.status)}
                </div>
                <div className="text-sm text-gray-500">
                  {link.courseName} • {link.batch}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Roll Number:</span>
                  <span className="ml-2 font-medium">{link.rollNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500">Connected:</span>
                  <span className="ml-2 font-medium">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Chapter:</span>
                  <span className="ml-2 font-medium">{link.chapter || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <UserCircle2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Link Requests Rejected</h3>
          <p className="mt-2 text-gray-500">Start connecting with other users to build your network.</p>
        </div>
      )}
    </div>
  );
};

export default RejectedRequests;
