import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import Post from "../../components/Post";
import { useSubAdmin } from "../context/SubAdminContext";
import { Loader2 } from "lucide-react";

const SubAdminPosts = () => {
    const { targetAdminId } = useSubAdmin();

    // Get current user data
    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: () => axiosInstance.get("/auth/me").then((res) => res.data),
    });

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ["subadmin-posts", targetAdminId, authUser?._id],
        queryFn: async () => {
            try {
                // Use targetAdminId if available, otherwise use current user's ID
                const adminId = targetAdminId || authUser?._id;
                
                if (!adminId) {
                    console.log('No admin ID available');
                    return [];
                }

                console.log('Fetching posts for admin ID:', adminId);
                
                try {
                    // Try the admin endpoint first
                    const res = await axiosInstance.get(`/posts/admin/recent?adminId=${adminId}`);
                    console.log('Posts API response (admin endpoint):', res.data);
                    
                    if (res.data && Array.isArray(res.data.posts)) {
                        return res.data.posts;
                    } else {
                        console.warn('Unexpected API response structure:', res.data);
                        return [];
                    }
                } catch (adminError) {
                    console.log('Admin endpoint failed, trying fallback. Error:', adminError.response?.status);
                    
                    // If admin endpoint fails (403), fallback to regular feed
                    if (adminError.response?.status === 403) {
                        console.log('Using fallback: regular feed endpoint');
                        const fallbackRes = await axiosInstance.get('/posts/');
                        console.log('Posts API response (fallback):', fallbackRes.data);
                        return Array.isArray(fallbackRes.data) ? fallbackRes.data : [];
                    } else {
                        throw adminError;
                    }
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                throw error;
            }
        },
        enabled: !!(targetAdminId || authUser?._id),
    });

    if (!targetAdminId && !authUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading user information...</span>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading posts...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Error loading posts</p>
                    <p className="text-gray-500 text-sm">{error.message}</p>
                </div>
            </div>
        );
    }

    // Ensure posts is always an array
    const postsArray = Array.isArray(posts) ? posts : [];

    return (
        <div className='flex justify-center'>
            <div className='col-span-1 lg:col-span-2 w-full max-w-4xl overflow-x-auto'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {targetAdminId ? "Admin Posts" : "Recent Posts"}
                    </h2>
                    <p className="text-gray-600">
                        {targetAdminId 
                            ? "Posts created by and for the selected admin" 
                            : "Recent posts from your network"
                        }
                    </p>
                    <p className="text-sm text-gray-400">Found {postsArray.length} posts</p>
                </div>
                
                {postsArray.map((post) => (
                    <Post key={post._id} post={post} />
                ))}

                {postsArray.length === 0 && (
                    <div className='bg-white rounded-lg shadow p-8 text-center'>
                        <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
                        <p className='text-gray-600'>No posts found for this admin!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubAdminPosts;