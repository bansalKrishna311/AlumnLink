import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Settings, 
  Crown, 
  Star, 
  UserPlus, 
  FileText, 
  Calendar,
  BarChart3,
  Bell,
  Edit,
  Trash2
} from 'lucide-react';
import { useNetworkAccess } from '@/hooks/useNetworkAccess';
import AccessControl from './AccessControl';
import NetworkActions from './NetworkActions';
import AccessLevelDebug from './AccessLevelDebug';

const UserDashboard = () => {
  const { 
    accessLevel, 
    accessLevelLabel, 
    loading, 
    isMember, 
    isModerator, 
    isManager, 
    isEditor, 
    isAdmin, 
    isSuperadmin 
  } = useNetworkAccess();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#fe6019]"></div>
      </div>
    );
  }

  const getAccessLevelIcon = () => {
    switch (accessLevel) {
      case 'level0':
        return <Users className="w-8 h-8 text-gray-600" />;
      case 'level1':
        return <Shield className="w-8 h-8 text-blue-600" />;
      case 'level2':
        return <Users className="w-8 h-8 text-green-600" />;
      case 'level3':
        return <Settings className="w-8 h-8 text-purple-600" />;
      case 'level4':
        return <Crown className="w-8 h-8 text-orange-600" />;
      case 'level5':
        return <Star className="w-8 h-8 text-red-600" />;
      default:
        return <Users className="w-8 h-8 text-gray-600" />;
    }
  };

  const getAccessLevelColor = () => {
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
          {getAccessLevelIcon()}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
            <p className="text-gray-600">Welcome to your personalized network dashboard</p>
          </div>
        </div>
        
        {/* Access Level Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 shadow-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor()}`}>
            {accessLevelLabel}
          </span>
          <span className="text-gray-600">Access Level {accessLevel}</span>
        </div>
      </motion.div>

      {/* Debug Component - Remove this after fixing the issue */}
      {/* <AccessLevelDebug /> */}

      {/* Network Actions Component */}
      <NetworkActions userAccessLevel={parseInt(accessLevel.replace('level', ''))} />

      {/* Feature Cards Based on Access Level */}
      <div className="mt-8 space-y-6">
        {/* Member Features (Level 0) */}
        <AccessControl requiredLevel="level0">
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-gray-600" />
              Member Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">View Network Members</h3>
                <p className="text-sm text-gray-600">Browse and connect with other network members</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Send Link Requests</h3>
                <p className="text-sm text-gray-600">Request connections with other alumni</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">View Content</h3>
                <p className="text-sm text-gray-600">Access network posts and announcements</p>
              </div>
            </div>
          </motion.div>
        </AccessControl>

        {/* Moderator Features (Level 1) */}
        <AccessControl requiredLevel="level1">
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Moderator Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Moderate Posts</h3>
                <p className="text-sm text-blue-700">Review and moderate network content</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">View Analytics</h3>
                <p className="text-sm text-blue-700">Access basic network statistics</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Member Management</h3>
                <p className="text-sm text-blue-700">View detailed member information</p>
              </div>
            </div>
          </motion.div>
        </AccessControl>

        {/* Manager Features (Level 2) */}
        <AccessControl requiredLevel="level2">
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-green-600" />
              Manager Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Approve Requests</h3>
                <p className="text-sm text-green-700">Approve or reject link requests</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Assign Roles</h3>
                <p className="text-sm text-green-700">Assign basic access levels to members</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Content Management</h3>
                <p className="text-sm text-green-700">Manage network content and posts</p>
              </div>
            </div>
          </motion.div>
        </AccessControl>

        {/* Editor Features (Level 3) */}
        <AccessControl requiredLevel="level3">
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-600" />
              Editor Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Network Settings</h3>
                <p className="text-sm text-purple-700">Modify network configuration</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Event Management</h3>
                <p className="text-sm text-purple-700">Create and manage network events</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Advanced Moderation</h3>
                <p className="text-sm text-purple-700">Full content moderation capabilities</p>
              </div>
            </div>
          </motion.div>
        </AccessControl>

        {/* Admin Features (Level 4) */}
        <AccessControl requiredLevel="level4">
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Crown className="w-6 h-6 text-orange-600" />
              Admin Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">Manage Admins</h3>
                <p className="text-sm text-orange-700">Assign and manage admin roles</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">Full Configuration</h3>
                <p className="text-sm text-orange-700">Complete network configuration access</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">System Override</h3>
                <p className="text-sm text-orange-700">Override lower-level restrictions</p>
              </div>
            </div>
          </motion.div>
        </AccessControl>

        {/* Superadmin Features (Level 5) */}
        <AccessControl requiredLevel="level5">
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-red-600" />
              Superadmin Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">System Control</h3>
                <p className="text-sm text-red-700">Full system-wide administrative access</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Override All</h3>
                <p className="text-sm text-red-700">Bypass all restrictions and permissions</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Global Management</h3>
                <p className="text-sm text-red-700">Manage all networks and users</p>
              </div>
            </div>
          </motion.div>
        </AccessControl>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AccessControl requiredLevel="level2">
            <button className="p-4 bg-[#fe6019] text-white rounded-lg hover:bg-[#e05617] transition-colors text-center">
              <UserPlus className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Manage Users</span>
            </button>
          </AccessControl>
          
          <AccessControl requiredLevel="level1">
            <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center">
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Moderate Content</span>
            </button>
          </AccessControl>
          
          <AccessControl requiredLevel="level3">
            <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center">
              <Settings className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Network Settings</span>
            </button>
          </AccessControl>
          
          <AccessControl requiredLevel="level4">
            <button className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center">
              <Crown className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Admin Panel</span>
            </button>
          </AccessControl>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
