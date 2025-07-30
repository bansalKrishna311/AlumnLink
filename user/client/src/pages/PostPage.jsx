import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import toast from "react-hot-toast";

const PostPage = () => {
	const { postId } = useParams();
	const navigate = useNavigate();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: post, isLoading, error, isError } = useQuery({
		queryKey: ["post", postId],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get(`/posts/${postId}`);
				return response;
			} catch (error) {
				throw error;
			}
		},
		retry: false, // Don't retry on error
	});

	// Handle post not found or other errors
	useEffect(() => {
		if (isError && error) {
			if (error.response?.status === 404) {
				toast.error("Post not found. It may have been deleted.");
			} else {
				toast.error("Failed to load post. Please try again.");
			}
			
			// Redirect to home page after a short delay
			const timer = setTimeout(() => {
				navigate("/", { replace: true });
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [isError, error, navigate]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe6019] mx-auto mb-4"></div>
					<p className="text-gray-600">Loading post...</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<div className="text-6xl mb-4">😔</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Available</h2>
					<p className="text-gray-600 mb-4">
						{error?.response?.status === 404 
							? "This post has been deleted or doesn't exist."
							: "Something went wrong while loading the post."
						}
					</p>
					<p className="text-sm text-gray-500">Redirecting you back to the home page...</p>
				</div>
			</div>
		);
	}

	if (!post?.data) {
		// Fallback if post data is somehow missing
		toast.error("Post data is not available.");
		navigate("/", { replace: true });
		return null;
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-3'>
				<Post post={post.data} />
			</div>
		</div>
	);
};
export default PostPage;
