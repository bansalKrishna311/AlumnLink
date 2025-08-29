import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, Shield, Settings, BarChart3, AlertTriangle, CheckCircle, XCircle, Eye, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import AccessLevelDropdown from './AccessLevelDropdown';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingRequests: 0,
    flaggedContent: 0,
    totalPosts: 0,
    totalEvents: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // This would be your actual API calls
      const [statsResponse, activityResponse, requestsResponse, flaggedResponse] = await Promise.all([
        axiosInstance.get('/admin/stats'),
        axiosInstance.get('/admin/recent-activity'),
        axiosInstance.get('/admin/pending-requests'),
        axiosInstance.get('/admin/flagged-content')
      ]);
      
      if (statsResponse.data.success) setStats(statsResponse.data.data);
      if (activityResponse.data.success) setRecentActivity(activityResponse.data.data);
      if (requestsResponse.data.success) setPendingRequests(requestsResponse.data.data);
      if (flaggedResponse.data.success) setFlaggedContent(flaggedResponse.data.data);
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Mock data for demonstration
      setStats({
        totalUsers: 1250,
        activeUsers: 890,
        pendingRequests: 23,
        flaggedContent: 7,
        totalPosts: 456,
        totalEvents: 12
      });
      
      setRecentActivity([
        {
          id: 1,
          type: 'user_joined',
          description: 'John Doe joined the network',
          timestamp: new Date().toISOString(),
          severity: 'info'
        },
        {
          id: 2,
          type: 'post_flagged',
          description: 'Post "Sample Post" was flagged by 3 users',
          timestamp: new Date().toISOString(),
          severity: 'warning'
        },
        {
          id: 3,
          type: 'access_level_changed',
          description: 'Jane Smith promoted to Moderator',
          timestamp: new Date().toISOString(),
          severity: 'info'
        }
      ]);
      
      setPendingRequests([
        {
          id: 1,
          type: 'link_request',
          user: 'Alice Johnson',
          details: 'Requesting connection with Bob Smith',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'event_approval',
          user: 'Charlie Brown',
          details: 'Event: Alumni Meetup 2024',
          timestamp: new Date().toISOString()
        }
      ]);
      
      setFlaggedContent([
        {
          id: 1,
          type: 'post',
          title: 'Sample Post',
          author: 'User123',
          flags: 3,
          reason: 'Inappropriate content',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'comment',
          content: 'This comment was flagged',
          author: 'User456',
          flags: 2,
          reason: 'Spam',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      // This would be your actual API call
      await axiosInstance.patch(`/admin/requests/${requestId}`, { action: 'approve' });
      
      // Update local state
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      // This would be your actual API call
      await axiosInstance.patch(`/admin/requests/${requestId}`, { action: 'reject' });
      
      // Update local state
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleUpdateAccessLevel = async (userId, newLevel) => {
    try {
      // This would be your actual API call
      await axiosInstance.patch(`/admin/users/${userId}/access-level`, {
        networkAccessLevel: newLevel
      });
      
      setShowEditModal(false);
      setEditingUser(null);
      // Refresh data
      fetchAdminData();
    } catch (error) {
      console.error('Error updating access level:', error);
    }
  };

  const handleRemoveFlaggedContent = async (contentId) => {
    try {
      // This would be your actual API call
      await axiosInstance.delete(`/admin/flagged-content/${contentId}`);
      
      // Update local state
      setFlaggedContent(prev => prev.filter(content => content.id !== contentId));
      setStats(prev => ({ ...prev, flaggedContent: prev.flaggedContent - 1 }));
    } catch (error) {
      console.error('Error removing flagged content:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'info': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#fe6019]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Crown className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600">Full administrative control and oversight</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-red-600">{stats.flaggedContent}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Posts</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalPosts}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Events</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalEvents}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getSeverityColor(activity.severity)}`}>
                    {getSeverityIcon(activity.severity)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pending Requests */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending requests</p>
              ) : (
                pendingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{request.user}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(request.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{request.details}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Flagged Content */}
      <motion.div
        className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Flagged Content</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flaggedContent.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No flagged content
                    </td>
                  </tr>
                ) : (
                  flaggedContent.map((content) => (
                    <tr key={content.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {content.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {content.title || content.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {content.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {content.flags}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {content.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedItem(content)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveFlaggedContent(content.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Update User Role</h3>
              <p className="text-sm text-gray-600 mt-1">
                Change access level for {editingUser.name}
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role: {editingUser.accessLevel}
                </label>
                <AccessLevelDropdown
                  value={editingUser.accessLevel}
                  onChange={(newLevel) => setEditingUser({ ...editingUser, accessLevel: newLevel })}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateAccessLevel(editingUser.id, editingUser.accessLevel)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Update Role
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Content Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Content Details</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600">{selectedItem.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Author:</span>
                  <span className="ml-2 text-gray-600">{selectedItem.author}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Flags:</span>
                  <span className="ml-2 text-gray-600">{selectedItem.flags}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Reason:</span>
                  <span className="ml-2 text-gray-600">{selectedItem.reason}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Content:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{selectedItem.title || selectedItem.content}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleRemoveFlaggedContent(selectedItem.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove Content
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
