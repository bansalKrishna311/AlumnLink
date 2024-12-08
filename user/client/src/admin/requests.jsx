import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const PendingRequests = () => {
	const [pendingUsers, setPendingUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPendingUsers = async () => {
			try {
				const { data } = await axiosInstance.get("/auth/pending-requests");
				setPendingUsers(data);
			} catch (error) {
				toast.error("Error fetching pending requests");
			} finally {
				setLoading(false);
			}
		};

		fetchPendingUsers();
	}, []);

	const approveUser = async (userId) => {
		try {
			await axiosInstance.patch(`/auth/approve/${userId}`);
			toast.success("User approved successfully");
			setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
		} catch (error) {
			toast.error("Error approving user");
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Pending User Approval Requests</h1>
			{loading ? (
				<p>Loading...</p>
			) : pendingUsers.length > 0 ? (
				<table className="table-auto w-full border-collapse border border-gray-300">
					<thead>
						<tr>
							<th className="border border-gray-300 px-4 py-2">Name</th>
							<th className="border border-gray-300 px-4 py-2">Email</th>
							<th className="border border-gray-300 px-4 py-2">Role</th>
							<th className="border border-gray-300 px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{pendingUsers.map((user) => (
							<tr key={user._id}>
								<td className="border border-gray-300 px-4 py-2">{user.name}</td>
								<td className="border border-gray-300 px-4 py-2">{user.email}</td>
								<td className="border border-gray-300 px-4 py-2">{user.role}</td>
								<td className="border border-gray-300 px-4 py-2">
									<button
										onClick={() => approveUser(user._id)}
										className="bg-green-500 text-white px-4 py-2 rounded"
									>
										Approve
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No pending requests</p>
			)}
		</div>
	);
};

export default PendingRequests;
