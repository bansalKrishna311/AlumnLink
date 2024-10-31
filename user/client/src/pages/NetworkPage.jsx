import { useEffect, useState } from "react"; // Import useEffect and useState
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { UserPlus, Loader } from "lucide-react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import RecommendedUser from "../components/RecommendedUser"; // Import the RecommendedUser component
import { FiArrowRight } from "react-icons/fi"; // Import the FiArrowRight icon

const NetworkPage = () => {
	const { data: user } = useQuery({ queryKey: ["authUser"] });
	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: () => axiosInstance.get("/Links/requests"),
	});
	const { data: Links } = useQuery({
		queryKey: ["Links"],
		queryFn: () => axiosInstance.get("/Links"),
	});

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

	// Fetch recommended users when the component mounts
	useEffect(() => {
		fetchRecommendedUsers(); // Fetch initial recommendations
	}, []); // Empty dependency array to run only on mount

	const debouncedSearch = debounce((query) => {
		setOffset(0);
		setSearchQuery(query);
		setRecommendedUsers([]);
		fetchRecommendedUsers(); // Fetch with new search query
	}, 300);

	const handleShowMore = () => {
		const newOffset = offset + initialLimit;
		setOffset(newOffset);
		fetchRecommendedUsers(newOffset);
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

				{/* Connection Requests */}
				{connectionRequests?.data?.length > 0 ? (
					<div className='mb-8'>
						<h2 className='text-xl font-semibold mb-2'>Connection Requests</h2>
						<div className='space-y-4'>
							{connectionRequests.data.map((request) => (
								<div key={request.id} className="p-4 border rounded-lg">
									<h3 className="font-semibold">{request.name}</h3>
									<p className="text-gray-600">{request.bio}</p>
									<div className="flex space-x-2 mt-2">
										<button className="px-4 py-1 bg-blue-500 text-white rounded">Accept</button>
										<button className="px-4 py-1 bg-red-500 text-white rounded">Decline</button>
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className='bg-white rounded-lg shadow p-6 text-center mb-6'>
						<UserPlus size={48} className='mx-auto text-gray-400 mb-4' />
						<h3 className='text-xl font-semibold mb-2'>No Connection Requests</h3>
						<p className='text-gray-600'>Explore suggested Links above to expand your network!</p>
					</div>
				)}

				{/* My Links */}
				{Links?.data?.length > 0 && (
	<div>
		{/* Update the styling of the header to include the arrow icon */}
		<h2 className='text-xl font-semibold mb-4 cursor-pointer text-blue-600 underline hover:text-blue-800 transition duration-200 flex items-center' onClick={() => setIsModalOpen(true)}>
			My Links
			<FiArrowRight className="ml-2" size={20} /> {/* Arrow icon with margin */}
		</h2>
		{isModalOpen && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
				<div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
					<h2 className="text-xl font-semibold mb-4">Connections</h2>
					<div className="space-y-4 max-h-80 overflow-y-auto">
						{Links.data.map((connection) => (
							<div key={connection._id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200">
								<h3 className="font-semibold">{connection.name}</h3>
								<p className="text-gray-600">{connection.bio}</p>
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
