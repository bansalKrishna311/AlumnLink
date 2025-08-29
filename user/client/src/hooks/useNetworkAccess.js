import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';

export const useNetworkAccess = () => {
  const [accessLevel, setAccessLevel] = useState('level0');
  const [accessLevelLabel, setAccessLevelLabel] = useState('Member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const forUserId = searchParams.get('forUserId');

  useEffect(() => {
    const fetchUserAccessLevel = async () => {
      try {
        setLoading(true);
        console.log('Fetching user access level...');
        
        // Get user's network access level from their accepted links
        const response = await axiosInstance.get(`/link-access/network-members?page=1&limit=50${forUserId ? `&forUserId=${forUserId}` : ''}`);
        console.log('Network members response:', response.data);
        
        if (response.data.success && response.data.data.length > 0) {
          // Get the highest access level from all user's networks
          const userNetworks = response.data.data;
          console.log('User networks found:', userNetworks);
          
          const highestLevel = userNetworks.reduce((highest, network) => {
            const currentLevel = parseInt(network.accessLevel.replace('level', ''));
            const highestLevelNum = parseInt(highest.replace('level', ''));
            console.log(`Comparing: current=${currentLevel}, highest=${highestLevelNum}, network=${network.accessLevel}`);
            return currentLevel > highestLevelNum ? network.accessLevel : highest;
          }, 'level0');
          
          console.log('Highest access level found:', highestLevel);
          setAccessLevel(highestLevel);
          
          // Get the label for the access level
          const labels = {
            'level0': 'Member',
            'level1': 'Moderator',
            'level2': 'Manager',
            'level3': 'Editor',
            'level4': 'Admin',
            'level5': 'Superadmin'
          };
          setAccessLevelLabel(labels[highestLevel] || 'Member');
        } else {
          console.log('No networks found, defaulting to Member level');
          // Default to Member level if no networks found
          setAccessLevel('level0');
          setAccessLevelLabel('Member');
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching user access level:', error);
        console.error('Error response:', error.response?.data);
        
        // Try alternative approach - get user's own profile to check access level
        try {
          console.log('Trying alternative approach...');
          const userResponse = await axiosInstance.get('/auth/me');
          console.log('User profile response:', userResponse.data);
          
          // Check if user has any special role or access level
          if (userResponse.data.role === 'admin' || userResponse.data.role === 'superadmin') {
            const level = userResponse.data.role === 'superadmin' ? 'level5' : 'level4';
            setAccessLevel(level);
            setAccessLevelLabel(level === 'level5' ? 'Superadmin' : 'Admin');
            console.log('Set access level from user role:', level);
          } else {
            // Default to Member level on error
            setAccessLevel('level0');
            setAccessLevelLabel('Member');
            console.log('Defaulting to Member level');
          }
        } catch (profileError) {
          console.error('Profile fetch also failed:', profileError);
          // Default to Member level on error
          setAccessLevel('level0');
          setAccessLevelLabel('Member');
          setError('Failed to fetch access level');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAccessLevel();
  }, [forUserId]);

  // Helper function to check if user has required access level
  const hasAccess = (requiredLevel) => {
    const userLevel = parseInt(accessLevel.replace('level', ''));
    const required = parseInt(requiredLevel.replace('level', ''));
    console.log(`Checking access: userLevel=${userLevel}, required=${required}, result=${userLevel >= required}`);
    return userLevel >= required;
  };

  // Helper function to check specific access levels
  const isMember = () => hasAccess('level0');
  const isModerator = () => hasAccess('level1');
  const isManager = () => hasAccess('level2');
  const isEditor = () => hasAccess('level3');
  const isAdmin = () => hasAccess('level4');
  const isSuperadmin = () => hasAccess('level5');

  // Debug logging
  useEffect(() => {
    console.log('Current access level state:', { accessLevel, accessLevelLabel, loading, error });
  }, [accessLevel, accessLevelLabel, loading, error]);

  return {
    accessLevel,
    accessLevelLabel,
    loading,
    error,
    hasAccess,
    isMember,
    isModerator,
    isManager,
    isEditor,
    isAdmin,
    isSuperadmin
  };
};
