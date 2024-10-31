import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { UserPlus, Loader } from "lucide-react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import RecommendedUser from "../components/RecommendedUser";
import FriendRequest from "../components/FriendRequest";
import { FiArrowRight } from "react-icons/fi";

const NetworkPage = () => {
	const queryClient = useQueryClient();

	// Fetch user data, Link requests, and Links
	const { data: user } = useQuery({ queryKey: ["authUser"] });
	const { data: LinkRequests } = useQuery({
		queryKey: ["LinkRequests"],
		queryFn: () => axiosInstance.get("/Links/requests"),
	});
	const { data: Links } = useQuery({
		queryKey: ["Links"],
		queryFn: () => axiosInstance.get("/Links"),
	});

	// State for managing recommended users
	const [recommendedUsers, setRecommendedUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const initialLimit = 3;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchRecommendedUsers = async (newOffset = 0) => {
		setIsLoading(true);
		const res = await axiosInstance.get("/users/suggestions", {
			params: { search: searchQuery, offset: newOffset, limit: initialLimit },
		});
		setIsLoading(false);
		setRecommendedUsers((prev) => (newOffset === 0 ? res.data : [...prev, ...res.data]));
	};

	useEffect(() => {
		fetchRecommendedUsers();
	}, []);

	const debouncedSearch = debounce((query) => {
		setOffset(0);
		setSearchQuery(query);
		setRecommendedUsers([]);
		fetchRecommendedUsers();
	}, 300);

	const handleShowMore = () => {
		const newOffset = offset + initialLimit;
		setOffset(newOffset);
		fetchRecommendedUsers(newOffset);
	};

	const handleRemoveLink = async (linkId) => {
		// Add logic to remove the link
		await axiosInstance.delete(`/Links/${linkId}`);
		queryClient.invalidateQueries("Links"); // Refetch Links data
	};

	const handleOpenUserAccount = (userId) => {
		// Navigate to the user's account page
		window.location.href = `/user/${userId}`;
	};

	return (
		<div className='flex flex-col items-center'>
			<div className='bg-secondary rounded-lg shadow p-6 mb-6 w-full max-w-2xl'>
				<h1 className='text-2xl font-bold mb-6 text-center'>My Network</h1>

				{/* Explore Links */}
				<div className='bg-white rounded-lg shadow p-6 mb-8'>
					<h2 className='text-xl font-semibold mb-4'>Explore Links</h2>
					<input
						type="text"
						placeholder="Search users..."
						onChange={(e) => debouncedSearch(e.target.value)}
						className="mb-4 p-2 border rounded w-full"
					/>
					{isLoading ? (
						<div className="text-center text-gray-500 flex justify-center">
							<Loader size={24} className="animate-spin" />
							<span className="ml-2">Loading suggestions...</span>
						</div>
					) : recommendedUsers?.length > 0 ? (
						<div className="space-y-4">
							{recommendedUsers.map((user) => (
								<RecommendedUser key={user._id} user={user} />
							))}
						</div>
					) : (
						<div className="text-center text-gray-500">No users found</div>
					)}
					{recommendedUsers?.length % initialLimit === 0 && recommendedUsers.length > 0 && (
						<motion.button
							onClick={handleShowMore}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							disabled={isLoading}
							className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
						>
							{isLoading ? "Loading..." : "Show More"}
						</motion.button>
					)}
				</div>

				{/* Link Requests */}
				{LinkRequests?.data?.length > 0 ? (
					<div className='mb-8'>
						<h2 className='text-xl font-semibold mb-2'>Link Requests</h2>
						<div className='space-y-4'>
							{LinkRequests.data.map((request) => (
								<FriendRequest key={request.id} request={request} />
							))}
						</div>
					</div>
				) : (
					<div className='bg-white rounded-lg shadow p-6 text-center mb-6'>
						<UserPlus size={48} className='mx-auto text-gray-400 mb-4' />
						<h3 className='text-xl font-semibold mb-2'>No Link Requests</h3>
						<p className='text-gray-600'>
							You don&apos;t have any pending Link requests at the moment.
						</p>
						<p className='text-gray-600 mt-2'>
							Explore suggested Links above to expand your network!
						</p>
					</div>
				)}

				{/* My Links */}
				{Links?.data?.length > 0 && (
					<div>
						<h2 className='text-xl font-semibold mb-4 cursor-pointer text-blue-600 underline hover:text-blue-800 transition duration-200 flex items-center' onClick={() => setIsModalOpen(true)}>
							My Links
							<FiArrowRight className="ml-2" size={20} />
						</h2>
						{isModalOpen && (
							<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
								<div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
									<h2 className="text-xl font-semibold mb-4">My Links</h2>
									<div className="space-y-4 max-h-80 overflow-y-auto">
										{Links.data.map((link) => (
											<div
												key={link._id}
												className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
												onClick={() => handleOpenUserAccount(link.userId)} // Assuming each link has a userId field
											>
												<img
													src={link.profilePicture || "/avatar.png"} // Assuming link has userImage field
													alt={link.name}
													className="w-12 h-12 rounded-full mr-4"
												/>
												<div className="flex-1">
													<h3 className="font-semibold">{link.name}</h3>
													<p className="text-gray-600">{link.headline}</p> {/* Assuming link has a headline field */}
												</div>
												<button
													className="text-red-500"
													onClick={(e) => {
														e.stopPropagation(); // Prevent opening the user account
														handleRemoveLink(link._id);
													}}
												>
													Remove
												</button>
											</div>
										))}
									</div>
									<button
										className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
										onClick={() => setIsModalOpen(false)}
									>
										Close
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default NetworkPage;
