import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

const RecommendedUser = ({ user }) => {
	const queryClient = useQueryClient();

	const { data: Linkstatus, isLoading } = useQuery({
		queryKey: ["Linkstatus", user._id],
		queryFn: () => axiosInstance.get(`/Links/status/${user._id}`),
	});

	const { mutate: sendLinkRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/Links/request/${userId}`),
		onSuccess: () => {
			toast.success("Link request sent successfully");
			queryClient.invalidateQueries({ queryKey: ["Linkstatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/Links/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Link request accepted");
			queryClient.invalidateQueries({ queryKey: ["Linkstatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/Links/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Link request rejected");
			queryClient.invalidateQueries({ queryKey: ["Linkstatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const renderButton = () => {
		if (isLoading) {
			return (
				<button className='px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500' disabled>
					Loading...
				</button>
			);
		}

		switch (Linkstatus?.data?.status) {
			case "pending":
				return (
					<button
						className='px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center'
						disabled
					>
						<Clock size={16} className='mr-1' />
						Pending
					</button>
				);
			case "received":
				return (
					<div className='flex gap-2 justify-center'>
						<button
							onClick={() => acceptRequest(Linkstatus.data.requestId)}
							className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
						>
							<Check size={16} />
						</button>
						<button
							onClick={() => rejectRequest(Linkstatus.data.requestId)}
							className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
						>
							<X size={16} />
						</button>
					</div>
				);
			case "Linked":
				return (
					<button
						className='px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center'
						disabled
					>
						<UserCheck size={16} className='mr-1' />
						Linked
					</button>
				);
			default:
				return (
					<button
						className='px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center'
						onClick={handleLink}
					>
						<UserPlus size={16} className='mr-1' />
						Link
					</button>
				);
		}
	};

	const handleLink = () => {
		if (Linkstatus?.data?.status === "not_Linked") {
			sendLinkRequest(user._id);
		}
	};

	return (
		<div className='flex items-center justify-between mb-4'>
			<Link to={`/profile/${user.username}`} className='flex items-center flex-grow'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-12 h-12 rounded-full mr-3 object-cover'
				/>
				<div>
					<h3 className='font-semibold text-sm'>{user.name}</h3>
					<p className='text-xs text-info'>{user.headline}</p>
				</div>
			</Link>
			{renderButton()}
		</div>
	);
};
export default RecommendedUser;




