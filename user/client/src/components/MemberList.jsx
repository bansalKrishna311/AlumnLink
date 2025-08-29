import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import { motion } from 'framer-motion';
import { Users, Shield, Settings, Crown, Star, Search, Edit, User, MapPin, Calendar } from 'lucide-react';
import AccessLevelDropdown from './AccessLevelDropdown';
import toast from 'react-hot-toast';
import Pagination from './Pagination';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [editingMember, setEditingMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const forUserId = searchParams.get('forUserId');
  const recipientId = forUserId || null;

  useEffect(() => {
    fetchMembers();
  }, [page, searchTerm, forUserId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/link-access/network-members?page=${page}&limit=10&search=${encodeURIComponent(searchTerm)}${forUserId ? `&forUserId=${forUserId}` : ''}${recipientId ? `&recipientId=${recipientId}` : ''}`);
      
      if (response.data.success) {
        setMembers(response.data.data);
        setPagination(response.data.pagination);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      if (error.response?.status === 404) {
        setMembers([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        });
        setError(null);
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccessLevelUpdate = async (memberId, newAccessLevel) => {
    try {
      // Find the member to get their linkId
      const member = members.find(m => m._id === memberId);
      if (!member) {
        toast.error('Member not found');
        return;
      }

      const response = await axiosInstance.patch(`/link-access/access-level/${member.linkId}`, {
        networkAccessLevel: newAccessLevel
      });

      if (response.data.success) {
        // Update the member in the local state
        setMembers(prevMembers => 
          prevMembers.map(member => 
            member._id === memberId 
              ? { ...member, accessLevel: newAccessLevel, accessLevelLabel: response.data.data.label }
              : member
          )
        );

        toast.success(`Access level updated to ${response.data.data.label} successfully!`);
        setShowEditModal(false);
        setEditingMember(null);
      } else {
        toast.error(response.data.message || 'Failed to update access level');
      }
    } catch (error) {
      console.error('Error updating access level:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update access level');
      }
    }
  };

  const getAccessLevelIcon = (accessLevel) => {
    switch (accessLevel) {
      case 'level0':
        return <Users className="w-4 h-4 text-gray-600" />;
      case 'level1':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'level2':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'level3':
        return <Settings className="w-4 h-4 text-purple-600" />;
      case 'level4':
        return <Crown className="w-4 h-4 text-orange-600" />;
      case 'level5':
        return <Star className="w-4 h-4 text-red-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAccessLevelColor = (accessLevel) => {
    switch (accessLevel) {
      case 'level0':
        return 'bg-gray-100 text-gray-800';
      case 'level1':
        return 'bg-blue-100 text-blue-800';
      case 'level2':
        return 'bg-green-100 text-green-800';
      case 'level3':
        return 'bg-purple-100 text-purple-800';
      case 'level4':
        return 'bg-orange-100 text-orange-800';
      case 'level5':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 50,
        damping: 10
      }
    }
  };

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-[#fe6019]" />
          <h1 className="text-3xl font-bold text-gray-800">Network Members</h1>
        </div>
        <p className="text-gray-600">Manage access levels for your network members</p>
      </motion.div>

      {error && (
        <motion.div 
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            className="rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#fe6019]"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.2, 
              ease: "linear", 
              repeat: Infinity 
            }}
          />
        </div>
      ) : (
        <>
          <motion.div 
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#fff5f0]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Connected Since</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Access Level</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                className="divide-y divide-gray-200 bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {members.map((member, index) => (
                  <motion.tr 
                    key={member._id} 
                    className="hover:bg-[#fff5f0] transition-all duration-200"
                    variants={rowVariants}
                    custom={index}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          {member.profilePicture ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={member.profilePicture} 
                              alt={member.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#fe6019] flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">@{member.username}</div>
                          {member.headline && (
                            <div className="text-xs text-gray-400 truncate max-w-[200px]">
                              {member.headline}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {member.location || 'Not specified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(member.connectedSince).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getAccessLevelIcon(member.accessLevel)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelColor(member.accessLevel)}`}>
                          {member.accessLevelLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#fff5f0] text-[#fe6019] hover:bg-[#fe6019] hover:text-white transition-colors duration-200"
                        aria-label="Edit Access Level"
                        onClick={() => {
                          setEditingMember(member);
                          setShowEditModal(true);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={14} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                      No members found
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </motion.div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </motion.div>
          )}
        </>
      )}

      {/* Edit Access Level Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Edit className="w-6 h-6 text-[#fe6019]" />
              <h3 className="text-lg font-semibold text-gray-900">Update Access Level</h3>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                {editingMember.profilePicture ? (
                  <img 
                    className="h-12 w-12 rounded-full object-cover" 
                    src={editingMember.profilePicture} 
                    alt={editingMember.name}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[#fe6019] flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{editingMember.name}</div>
                  <div className="text-sm text-gray-500">@{editingMember.username}</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Current access level: <span className="font-medium">{editingMember.accessLevelLabel}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Access Level
              </label>
              <AccessLevelDropdown
                selectedLevel={editingMember.accessLevel}
                onLevelChange={(level) => setEditingMember(prev => ({ ...prev, accessLevel: level }))}
                showLabels={true}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMember(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAccessLevelUpdate(editingMember._id, editingMember.accessLevel)}
                className="flex-1 px-4 py-2 bg-[#fe6019] text-white rounded-lg hover:bg-[#e05617] transition-colors"
              >
                Update Access Level
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MemberList;
