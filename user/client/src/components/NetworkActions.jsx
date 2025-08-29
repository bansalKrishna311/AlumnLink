import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Settings, 
  Crown, 
  Star, 
  Edit, 
  Trash2, 
  UserPlus, 
  FileText, 
  Calendar,
  Bell,
  BarChart3
} from 'lucide-react';

const NetworkActions = ({ userAccessLevel, onActionClick }) => {
  // Define actions based on access levels
  const getAvailableActions = (accessLevel) => {
    const actions = [];

    // Level 0: Member (basic access)
    if (accessLevel >= 0) {
      actions.push({
        id: 'view-members',
        label: 'View Members',
        description: 'Browse network members',
        icon: Users,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 hover:bg-gray-100',
        accessRequired: 0
      });
    }

    // Level 1: Moderator (moderate content)
    if (accessLevel >= 1) {
      actions.push(
        {
          id: 'moderate-posts',
          label: 'Moderate Posts',
          description: 'Review and moderate content',
          icon: Shield,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 hover:bg-blue-100',
          accessRequired: 1
        },
        {
          id: 'view-analytics',
          label: 'View Analytics',
          description: 'Access basic network statistics',
          icon: BarChart3,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 hover:bg-blue-100',
          accessRequired: 1
        }
      );
    }

    // Level 2: Manager (manage users)
    if (accessLevel >= 2) {
      actions.push(
        {
          id: 'manage-users',
          label: 'Manage Users',
          description: 'Approve/reject requests, assign roles',
          icon: UserPlus,
          color: 'text-green-600',
          bgColor: 'bg-green-50 hover:bg-green-100',
          accessRequired: 2
        },
        {
          id: 'manage-content',
          label: 'Manage Content',
          description: 'Edit and manage network content',
          icon: FileText,
          color: 'text-green-600',
          bgColor: 'bg-green-50 hover:bg-green-100',
          accessRequired: 2
        }
      );
    }

    // Level 3: Editor (manage network settings)
    if (accessLevel >= 3) {
      actions.push(
        {
          id: 'edit-network',
          label: 'Edit Network',
          description: 'Modify network settings and configuration',
          icon: Settings,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 hover:bg-purple-100',
          accessRequired: 3
        },
        {
          id: 'manage-events',
          label: 'Manage Events',
          description: 'Create and manage network events',
          icon: Calendar,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 hover:bg-purple-100',
          accessRequired: 3
        }
      );
    }

    // Level 4: Admin (full network admin)
    if (accessLevel >= 4) {
      actions.push(
        {
          id: 'manage-admins',
          label: 'Manage Admins',
          description: 'Assign and manage admin roles',
          icon: Crown,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 hover:bg-orange-100',
          accessRequired: 4
        },
        {
          id: 'network-settings',
          label: 'Network Settings',
          description: 'Full network configuration access',
          icon: Settings,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 hover:bg-orange-100',
          accessRequired: 4
        }
      );
    }

    // Level 5: Superadmin (system-wide control)
    if (accessLevel >= 5) {
      actions.push(
        {
          id: 'system-control',
          label: 'System Control',
          description: 'Full system-wide administrative access',
          icon: Star,
          color: 'text-red-600',
          bgColor: 'bg-red-50 hover:bg-red-100',
          accessRequired: 5
        },
        {
          id: 'override-all',
          label: 'Override All',
          description: 'Bypass all restrictions and permissions',
          icon: Star,
          color: 'text-red-600',
          bgColor: 'bg-red-50 hover:bg-red-100',
          accessRequired: 5
        }
      );
    }

    return actions;
  };

  const getAccessLevelLabel = (level) => {
    const labels = {
      0: 'Member',
      1: 'Moderator',
      2: 'Manager',
      3: 'Editor',
      4: 'Admin',
      5: 'Superadmin'
    };
    return labels[level] || 'Unknown';
  };

  const getAccessLevelColor = (level) => {
    const colors = {
      0: 'text-gray-600',
      1: 'text-blue-600',
      2: 'text-green-600',
      3: 'text-purple-600',
      4: 'text-orange-600',
      5: 'text-red-600'
    };
    return colors[level] || 'text-gray-600';
  };

  const availableActions = getAvailableActions(userAccessLevel);

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      console.log(`Action clicked: ${action.label}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Access Level Display */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${getAccessLevelColor(userAccessLevel).replace('text-', 'bg-').replace('-600', '-100')}`}>
            {userAccessLevel >= 5 && <Star className={`w-6 h-6 ${getAccessLevelColor(userAccessLevel)}`} />}
            {userAccessLevel === 4 && <Crown className={`w-6 h-6 ${getAccessLevelColor(userAccessLevel)}`} />}
            {userAccessLevel === 3 && <Settings className={`w-6 h-6 ${getAccessLevelColor(userAccessLevel)}`} />}
            {userAccessLevel === 2 && <Users className={`w-6 h-6 ${getAccessLevelColor(userAccessLevel)}`} />}
            {userAccessLevel === 1 && <Shield className={`w-6 h-6 ${getAccessLevelColor(userAccessLevel)}`} />}
            {userAccessLevel === 0 && <Users className={`w-6 h-6 ${getAccessLevelColor(userAccessLevel)}`} />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {getAccessLevelLabel(userAccessLevel)}
            </h2>
            <p className="text-sm text-gray-600">
              Access Level {userAccessLevel} • {availableActions.length} actions available
            </p>
          </div>
        </div>
      </motion.div>

      {/* Available Actions Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {availableActions.map((action, index) => (
          <motion.div
            key={action.id}
            className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer transition-all duration-200 ${action.bgColor}`}
            onClick={() => handleActionClick(action)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${action.bgColor.replace('hover:', '').replace('100', '200')}`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {action.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${action.bgColor.replace('hover:', '').replace('100', '200')} ${action.color}`}>
                    {getAccessLevelLabel(action.accessRequired)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Level {action.accessRequired}+
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Actions Available Message */}
      {availableActions.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Actions Available</h3>
          <p className="text-gray-600">
            Your current access level doesn't have any available actions.
          </p>
        </motion.div>
      )}

      {/* Access Level Information */}
      <motion.div
        className="bg-gray-50 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Level Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { level: 0, label: 'Member', description: 'Basic network access, view members and content' },
            { level: 1, label: 'Moderator', description: 'Can moderate posts, view members, access basic analytics' },
            { level: 2, label: 'Manager', description: 'Can approve/reject requests, assign roles, manage content' },
            { level: 3, label: 'Editor', description: 'Can edit network settings, manage events, moderate content' },
            { level: 4, label: 'Admin', description: 'Full network admin, manage other admins, full configuration' },
            { level: 5, label: 'Superadmin', description: 'System-wide control, override all restrictions' }
          ].map((info) => (
            <div key={info.level} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium ${info.level <= userAccessLevel ? 'text-green-600' : 'text-gray-400'}`}>
                  {info.label}
                </span>
                {info.level <= userAccessLevel && (
                  <span className="text-green-500">✓</span>
                )}
              </div>
              <p className="text-gray-600 text-xs">{info.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NetworkActions;
