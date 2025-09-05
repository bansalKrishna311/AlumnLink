import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import Post from "../../components/Post";
import { useSubAdmin } from "../context/SubAdminContext";
import { Loader2 } from "lucide-react";

const SubAdminPosts = () => {
    const { targetAdminId } = useSubAdmin();

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ["subadmin-posts", targetAdminId],
        queryFn: async () => {
            if (!targetAdminId) return [];
            try {
                const res = await axiosInstance.get(`/posts/admin/recent?adminId=${targetAdminId}`);
                console.log('Posts API response:', res.data);
                // The API returns { posts: [...], stats: {...} }
                if (res.data && Array.isArray(res.data.posts)) {
                    return res.data.posts;
                } else {
                    console.warn('Unexpected API response structure:', res.data);
                    return [];
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                throw error;
            }
        },
        enabled: !!targetAdminId,
    });

    if (!targetAdminId) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No admin selected</p>
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
                    <h2 className="text-2xl font-bold text-gray-900">Admin Posts</h2>
                    <p className="text-gray-600">Posts created by and for the admin</p>
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