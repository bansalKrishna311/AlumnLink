import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import { useNetworkAccess } from '@/hooks/useNetworkAccess';

const AccessLevelDebug = () => {
  const { accessLevel, accessLevelLabel, loading, error } = useNetworkAccess();
  const [debugInfo, setDebugInfo] = useState({});
  const [manualCheck, setManualCheck] = useState({});

  const checkAccessLevelManually = async () => {
    try {
      console.log('=== MANUAL ACCESS LEVEL CHECK ===');
      
      // Check network members
      const networkResponse = await axiosInstance.get('/link-access/network-members?page=1&limit=50');
      console.log('Network members response:', networkResponse.data);
      
      // Check user profile
      const userResponse = await axiosInstance.get('/auth/me');
      console.log('User profile response:', userResponse.data);
      
      // Check if user has any links
      const linksResponse = await axiosInstance.get('/links');
      console.log('User links response:', linksResponse.data);
      
      setManualCheck({
        networkMembers: networkResponse.data,
        userProfile: userResponse.data,
        userLinks: linksResponse.data,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Manual check failed:', error);
      setManualCheck({ error: error.message });
    }
  };

  useEffect(() => {
    checkAccessLevelManually();
  }, []);

  return (
    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h2 className="text-xl font-bold text-yellow-800 mb-4">🔍 Access Level Debug</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-yellow-700">Current Hook State:</h3>
          <div className="bg-white p-3 rounded border text-sm">
            <p><strong>Access Level:</strong> {accessLevel}</p>
            <p><strong>Label:</strong> {accessLevelLabel}</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-yellow-700">Manual API Check:</h3>
          <div className="bg-white p-3 rounded border text-sm">
            {manualCheck.error ? (
              <p className="text-red-600">Error: {manualCheck.error}</p>
            ) : manualCheck.timestamp ? (
              <div>
                <p><strong>Timestamp:</strong> {manualCheck.timestamp}</p>
                <p><strong>Network Members Count:</strong> {manualCheck.networkMembers?.data?.length || 0}</p>
                <p><strong>User Role:</strong> {manualCheck.userProfile?.role || 'None'}</p>
                <p><strong>User Links Count:</strong> {manualCheck.userLinks?.data?.length || 0}</p>
                
                {manualCheck.networkMembers?.data?.length > 0 && (
                  <div className="mt-2">
                    <p><strong>Network Access Levels:</strong></p>
                    <ul className="list-disc list-inside ml-2">
                      {manualCheck.networkMembers.data.map((network, index) => (
                        <li key={index}>
                          {network.name || network.username}: {network.accessLevel || 'level0'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>

        <button
          onClick={checkAccessLevelManually}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Refresh Debug Info
        </button>

        <div className="text-xs text-yellow-600">
          <p><strong>Note:</strong> Check the browser console for detailed logging.</p>
          <p>This component helps debug why the access level might not be showing correctly.</p>
        </div>
      </div>
    </div>
  );
};

export default AccessLevelDebug;
