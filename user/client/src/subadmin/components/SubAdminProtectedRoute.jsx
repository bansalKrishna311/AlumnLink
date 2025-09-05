import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { hasPageAccess, PAGE_PERMISSIONS } from '../utils/accessControl';
import AccessDenied from './AccessDenied';

const SubAdminProtectedRoute = ({ children, requiredPath }) => {
  // Get current user data
  const { data: authUser, isLoading: authLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/me").then((res) => res.data),
  });

  // Get user hierarchy from the new dedicated endpoint
  const { data: hierarchyData, isLoading: hierarchyLoading, error: hierarchyError } = useQuery({
    queryKey: ["currentUserHierarchy"],
    queryFn: () => axiosInstance.get('/links/hierarchy/my-hierarchy').then((res) => res.data),
    enabled: !!authUser?._id,
    retry: false,
  });

  if (authLoading || hierarchyLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#fe6019] animate-spin" />
      </div>
    );
  }

  // Get hierarchy from new API endpoint
  const userHierarchy = hierarchyData?.adminHierarchy || authUser?.adminHierarchy || 'hod'; // Temporary fallback to 'hod' for testing
  
  // Check if user has access to the requested page
  const hasAccess = hasPageAccess(userHierarchy, requiredPath);

  console.log('SubAdminProtectedRoute - Access Check:', {
    requiredPath,
    userHierarchy,
    hierarchyData,
    hierarchySource: hierarchyData?.source,
    hierarchyError: hierarchyError?.response?.data || hierarchyError?.message,
    authUserHierarchy: authUser?.adminHierarchy,
    hasAccess
  });

  if (!hasAccess) {
    return (
      <AccessDenied 
        requiredLevel={PAGE_PERMISSIONS[requiredPath]}
        userHierarchy={userHierarchy}
      />
    );
  }

  return children;
};

export default SubAdminProtectedRoute;
