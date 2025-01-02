import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import MyLinksButton from "@/components/MyLinksButton";

const NetworkPage = () => {
	const queryClient = useQueryClient();

	// Fetch Links
	const { data: Links } = useQuery({
		queryKey: ["Links"],
		queryFn: () => axiosInstance.get("/Links"),
	});

	const handleRemoveLink = async (linkId) => {
		try {
			await axiosInstance.delete(`/Links/${linkId}`);
			queryClient.invalidateQueries("Links"); // Refetch Links data
		} catch (error) {
			console.error("Failed to remove link:", error);
		}
	};

	const handleOpenUserAccount = (username) => {
		window.location.href = `/profile/${username}`;
	};

	return (
		<div className="flex flex-col items-center">
			<div className="bg-secondary rounded-lg shadow p-6 mb-6 w-full max-w-2xl">
				<h1 className="text-2xl font-bold mb-6 text-center">My Network</h1>

				{/* My Links */}
				{Links?.data?.length > 0 && (
					<MyLinksButton
						links={Links.data}
						onRemoveLink={handleRemoveLink}
						onOpenUserAccount={handleOpenUserAccount}
					/>
				)}
			</div>
		</div>
	);
};

export default NetworkPage;
