import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UserCog, 
  Shield, 
  Crown, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

const HierarchyManagementModal = ({ isOpen, onClose, linkRequest, onSuccess }) => {
  const [availableHierarchies, setAvailableHierarchies] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHierarchies, setIsLoadingHierarchies] = useState(false); // Start as false
  const [currentUser, setCurrentUser] = useState(null);

  // Get hierarchy icon based on level
  const getHierarchyIcon = (hierarchy) => {
    const lowerHierarchy = hierarchy?.toLowerCase() || '';
    if (lowerHierarchy.includes('management') || lowerHierarchy.includes('director')) {
      return <Crown className="w-5 h-5 text-yellow-500" />;
    } else if (lowerHierarchy.includes('hod') || lowerHierarchy.includes('principal')) {
      return <Shield className="w-5 h-5 text-purple-500" />;
    } else if (lowerHierarchy.includes('faculty') || lowerHierarchy.includes('lead')) {
      return <Users className="w-5 h-5 text-blue-500" />;
    } else {
      return <UserCog className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get hierarchy color based on level
  const getHierarchyColor = (hierarchy) => {
    const lowerHierarchy = hierarchy?.toLowerCase() || '';
    if (lowerHierarchy.includes('management') || lowerHierarchy.includes('director')) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    } else if (lowerHierarchy.includes('hod') || lowerHierarchy.includes('principal')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    } else if (lowerHierarchy.includes('faculty') || lowerHierarchy.includes('lead')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    } else {
      return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Format hierarchy display name
  const formatHierarchyName = (hierarchy) => {
    if (!hierarchy) return '';
    return hierarchy.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!isOpen) return;
      
      try {
        console.log('Fetching current user...');
        const response = await axiosInstance.get('/auth/me');
        console.log('Current user response:', response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast.error('Failed to fetch user information');
      }
    };

    fetchCurrentUser();
  }, [isOpen]);

  // Fetch available hierarchies when modal opens and user data is ready
  useEffect(() => {
    const fetchAvailableHierarchies = async () => {
      if (!isOpen || !currentUser) {
        console.log('Skipping hierarchy fetch - Missing requirements:', { isOpen, currentUser: !!currentUser });
        return;
      }
      
      // Check if user has adminType, if not try to infer it or set a default
      let adminType = currentUser.adminType;
      if (!adminType) {
        console.log('User missing adminType, checking other fields...');
        // Try to infer from other fields or set a default
        adminType = 'institute'; // Default to institute for now
        console.log('Using default adminType:', adminType);
      }
      
      try {
        setIsLoadingHierarchies(true);
        console.log('Fetching hierarchies for admin type:', adminType);
        console.log('Current user data:', currentUser);
        
        const response = await axiosInstance.get(`/links/hierarchy/available?adminType=${adminType}`);
        console.log('Hierarchy API response:', response.data);
        
        if (response.data.success) {
          // Get current user's hierarchy level with proper fallback
          let currentUserLevel = currentUser.adminHierarchy;
          
          // If adminHierarchy is missing, set appropriate default
          if (!currentUserLevel) {
            if (adminType === 'institute') currentUserLevel = 'institute_management';
            else if (adminType === 'school') currentUserLevel = 'school_management';
            else if (adminType === 'corporate') currentUserLevel = 'corporate_management';
            else currentUserLevel = 'alumni';
          }
          
          console.log('Current user level determined as:', currentUserLevel);
          
          const allHierarchies = response.data.hierarchies;
          console.log('All available hierarchies:', allHierarchies);
          
          // Get the target user's current hierarchy level
          const targetUserCurrentLevel = linkRequest?.adminHierarchy || linkRequest?.sender?.adminHierarchy || linkRequest?.user?.adminHierarchy || 'alumni';
          console.log('Target user current level:', targetUserCurrentLevel);
          
          // Find current user's index
          const currentUserIndex = allHierarchies.findIndex(h => h.level === currentUserLevel);
          console.log('Current user index:', currentUserIndex);
          
          let availableOptions = [];
          
          // If user is management level, they can grant all levels
          if (currentUserLevel.includes('management')) {
            availableOptions = [...allHierarchies];
            console.log('Management user - showing all levels');
          } else if (currentUserIndex > 0) {
            // Regular admins can only grant levels below their own
            availableOptions = allHierarchies.filter((_, index) => index < currentUserIndex);
            console.log('Regular admin - showing levels below current');
          } else {
            // If user is at lowest level, show limited options
            availableOptions = allHierarchies.slice(0, 1); // At least show first level
            console.log('Lowest level user - showing first level only');
          }
          
          // Store the target user's current level for disabling in UI
          availableOptions = availableOptions.map(option => ({
            ...option,
            isCurrentLevel: option.level === targetUserCurrentLevel
          }));
          
          // Sort by index to maintain hierarchy order
          availableOptions.sort((a, b) => a.index - b.index);
          console.log('Final available options with current level marked:', availableOptions);
          
          setAvailableHierarchies(availableOptions);
        } else {
          console.error('API returned success=false:', response.data);
          setAvailableHierarchies([]);
        }
      } catch (error) {
        console.error('Error fetching available hierarchies:', error);
        toast.error('Failed to fetch available hierarchy levels');
        setAvailableHierarchies([]);
      } finally {
        setIsLoadingHierarchies(false);
      }
    };

    if (isOpen && currentUser) {
      fetchAvailableHierarchies();
    }
  }, [isOpen, currentUser]); // Depend on currentUser to trigger when it's loaded

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedHierarchy('');
      setReason('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedHierarchy) {
      toast.error('Please select a hierarchy level');
      return;
    }

    if (!linkRequest?._id) {
      toast.error('Invalid link request');
      return;
    }

    try {
      setIsLoading(true);
      
      // Direct hierarchy update - simplified approach
      const response = await axiosInstance.put(`/links/hierarchy/approve/${linkRequest._id}`, {
        approved: true,
        newHierarchy: selectedHierarchy
      });

      if (response.data) {
        toast.success(`Hierarchy upgraded to ${formatHierarchyName(selectedHierarchy)} successfully!`);
        
        // Call success callback and close modal
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error updating hierarchy:', error);
      
      let errorMessage = 'Failed to update hierarchy';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Validate linkRequest prop
  if (!linkRequest || !linkRequest._id) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid Request</h3>
              <p className="text-gray-600 mb-4">No valid link request data found.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
                 className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"

          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#fe6019] mx-auto mb-2" />
                <p className="text-sm text-gray-600">Updating hierarchy...</p>
              </div>
            </div>
          )}
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#fe6019]/10 rounded-full flex items-center justify-center">
                <UserCog className="w-5 h-5 text-[#fe6019]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Manage Hierarchy</h2>
                <p className="text-sm text-gray-500">Grant admin privileges</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                {(linkRequest?.sender?.profilePicture || linkRequest?.user?.profilePicture) ? (
                  <img
                    src={linkRequest.sender?.profilePicture || linkRequest.user?.profilePicture}
                    alt={linkRequest.sender?.name || linkRequest.user?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {linkRequest?.sender?.name || linkRequest?.user?.name || linkRequest?.name || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    @{linkRequest?.sender?.username || linkRequest?.user?.username || linkRequest?.username || 'unknown'}
                  </p>
                </div>
              </div>
              
              {/* Current Hierarchy */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Current Level:</span>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-medium ${getHierarchyColor(linkRequest?.adminHierarchy || linkRequest?.sender?.adminHierarchy || linkRequest?.user?.adminHierarchy)}`}>
                  {getHierarchyIcon(linkRequest?.adminHierarchy || linkRequest?.sender?.adminHierarchy || linkRequest?.user?.adminHierarchy)}
                  <span>{formatHierarchyName(linkRequest?.adminHierarchy || linkRequest?.sender?.adminHierarchy || linkRequest?.user?.adminHierarchy || 'alumni')}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hierarchy Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Hierarchy Level
                </label>
                {isLoadingHierarchies ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#fe6019]" />
                  </div>
                ) : availableHierarchies.length > 0 ? (
                  <div className="grid gap-2">
                    {availableHierarchies.map((hierarchy) => (
                      <label
                        key={hierarchy.level}
                        className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                          hierarchy.isCurrentLevel
                            ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                            : selectedHierarchy === hierarchy.level
                            ? 'border-[#fe6019] bg-[#fe6019]/5 shadow-sm cursor-pointer hover:shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 cursor-pointer hover:shadow-sm'
                        }`}
                      >
                        <input
                          type="radio"
                          name="hierarchy"
                          value={hierarchy.level}
                          checked={selectedHierarchy === hierarchy.level}
                          onChange={(e) => setSelectedHierarchy(e.target.value)}
                          disabled={hierarchy.isCurrentLevel}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3 flex-1">
                          {getHierarchyIcon(hierarchy.level)}
                          <div>
                            <div className={`font-medium ${hierarchy.isCurrentLevel ? 'text-gray-500' : 'text-gray-900'}`}>
                              {hierarchy.displayName}
                              {hierarchy.isCurrentLevel && (
                                <span className="ml-2 text-xs text-blue-600 font-medium">(Current Level)</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Level {hierarchy.index}
                            </div>
                          </div>
                        </div>
                        {selectedHierarchy === hierarchy.level && !hierarchy.isCurrentLevel && (
                          <CheckCircle className="w-5 h-5 text-[#fe6019]" />
                        )}
                        {hierarchy.isCurrentLevel && (
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                ) : !currentUser ? (
                  <div className="text-center py-8 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#fe6019]" />
                    <p className="font-medium">Loading user information...</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium">No hierarchy changes available</p>
                    <p className="text-xs mt-1">
                      {availableHierarchies.length === 0 
                        ? 'This user already has the highest level you can grant, or no other levels are available for upgrade.'
                        : 'You can only grant levels below your current level and different from the user\'s current level'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Current User Info */}
              {currentUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-900">Your Authority Level</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    {formatHierarchyName(currentUser.adminHierarchy || 
                      (currentUser.adminType === 'institute' ? 'institute_management' :
                       currentUser.adminType === 'school' ? 'school_management' :
                       currentUser.adminType === 'corporate' ? 'corporate_management' : 'alumni')
                    )} - {currentUser.adminType || 'Unknown'} Admin
                  </div>
                  {(currentUser.adminHierarchy?.includes('management') || 
                    (!currentUser.adminHierarchy && currentUser.adminType)) && (
                    <div className="text-xs text-green-600 mt-1 font-medium">
                      ✓ Full Management Access - Can grant all hierarchy levels
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Fixed Footer */}
          <div className="border-t border-gray-200 p-6 bg-white rounded-b-xl">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !selectedHierarchy}
                className="flex-1 px-4 py-2 bg-[#fe6019] hover:bg-[#e55517] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Grant Hierarchy</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HierarchyManagementModal;
