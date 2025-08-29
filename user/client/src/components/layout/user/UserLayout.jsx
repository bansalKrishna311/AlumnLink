import React from 'react';
import { useNetworkAccess } from '@/hooks/useNetworkAccess';
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
  Home,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';

const UserLayout = ({ children }) => {
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
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getNavigationItems = () => {
    const items = [
      { title: "Dashboard", url: "/access-dashboard", icon: Home, accessRequired: "level0" }
    ];

    if (isModerator()) {
      items.push(
        { title: "Network Members", url: "/access/network-members", icon: Users, accessRequired: "level1" },
        { title: "Content Moderation", url: "/access/moderation", icon: Shield, accessRequired: "level1" }
      );
    }

    if (isManager()) {
      items.push(
        { title: "User Management", url: "/access/user-management", icon: UserPlus, accessRequired: "level2" }
      );
    }

    if (isEditor()) {
      items.push(
        { title: "Network Settings", url: "/access/network-settings", icon: Settings, accessRequired: "level3" }
      );
    }

    if (isAdmin()) {
      items.push(
        { title: "Admin Panel", url: "/access/admin-panel", icon: Crown, accessRequired: "level4" }
      );
    }

    if (isSuperadmin()) {
      items.push(
        { title: "System Control", url: "/access/system-control", icon: Star, accessRequired: "level5" }
      );
    }

    return items;
  };

  const getAccessLevelIcon = () => {
    switch (accessLevel) {
      case 'level0':
        return <Users className="w-6 h-6 text-gray-600" />;
      case 'level1':
        return <Shield className="w-6 h-6 text-blue-600" />;
      case 'level2':
        return <Users className="w-6 h-6 text-green-600" />;
      case 'level3':
        return <Settings className="w-6 h-6 text-purple-600" />;
      case 'level4':
        return <Crown className="w-6 h-6 text-orange-600" />;
      case 'level5':
        return <Star className="w-6 h-6 text-red-600" />;
      default:
        return <Users className="w-6 h-6 text-gray-600" />;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#fe6019]"></div>
      </div>
    );
  }

  const navigationItems = getNavigationItems();

  return (
    <div className="flex w-full h-full bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        className="w-64 bg-white border-r border-gray-200 flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            {getAccessLevelIcon()}
            <div>
              <h1 className="text-xl font-bold text-gray-900">AlumnLink</h1>
              <p className="text-sm text-gray-600">User Portal</p>
            </div>
          </div>
          
          {/* Access Level Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 shadow-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor()}`}>
              {accessLevelLabel}
            </span>
            <span className="text-gray-600">Level {accessLevel}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <motion.li
                key={item.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  onClick={() => navigate(item.url + (location.search || ''))}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-[#fe6019]/10 hover:text-[#fe6019] rounded-lg transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex-1 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default UserLayout;
