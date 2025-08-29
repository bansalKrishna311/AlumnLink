import React from 'react';
import { useNetworkAccess } from '@/hooks/useNetworkAccess';

const AccessControl = ({ 
  children, 
  requiredLevel, 
  fallback = null, 
  showAccessDenied = false 
}) => {
  const { hasAccess, loading, accessLevel, accessLevelLabel } = useNetworkAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fe6019]"></div>
      </div>
    );
  }

  if (!hasAccess(requiredLevel)) {
    if (showAccessDenied) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Access Denied</p>
              <p className="text-sm">
                This feature requires {requiredLevel.replace('level', 'Level ')} access. 
                Your current level: {accessLevelLabel} ({accessLevel})
              </p>
            </div>
          </div>
        </div>
      );
    }
    return fallback;
  }

  return children;
};

export default AccessControl;
