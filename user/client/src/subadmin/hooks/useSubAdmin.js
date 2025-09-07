import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';

// Custom hook for SubAdmin authentication
export const useSubAdminAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/me").then((res) => res.data),
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    },
  });

  return {
    user: authUser,
    isLoading,
    error,
    logout,
    isSubAdmin: authUser?.role === 'subadmin' || authUser?.adminHierarchy
  };
};

// Custom hook for SubAdmin dashboard stats
export const useSubAdminStats = () => {
  return useQuery({
    queryKey: ["subadmin-stats"],
    queryFn: () => axiosInstance.get("/links/dashboard-stats").then((res) => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
