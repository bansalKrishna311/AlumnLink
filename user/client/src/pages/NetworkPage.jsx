import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { FiArrowRight } from "react-icons/fi";

const NetworkPage = () => {
	const queryClient = useQueryClient();

	// Fetch Links
	const { data: Links } = useQuery({
		queryKey: ["Links"],
		queryFn: () => axiosInstance.get("/Links"),
	});

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleRemoveLink = async (linkId) => {
		// Add logic to remove the link
		await axiosInstance.delete(`/Links/${linkId}`);
		queryClient.invalidateQueries("Links"); // Refetch Links data
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
    <div>
        <h2
            className="text-xl font-semibold mb-4 cursor-pointer text-blue-600 underline hover:text-blue-800 transition duration-200 flex items-center"
            onClick={() => setIsModalOpen(true)}
        >
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
                                onClick={() => handleOpenUserAccount(link.user.username)}
                            >
                                <img
                                    src={link.user.profilePicture || "/avatar.png"}
                                    alt={link.user.name}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{link.user.name}</h3>
                                    <p className="text-gray-600">{link.user.headline}</p>
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
