import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [type, setType] = useState("discussion");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const queryClient = useQueryClient();

	const { mutate: createPostMutation, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to create post");
		},
	});

	const handlePostCreation = async () => {
		try {
			const postData = { content, type };

			if (image) postData.image = await readFileAsDataURL(image);

			createPostMutation(postData);
		} catch (error) {
			console.error("Error in handlePostCreation:", error);
		}
	};

	const resetForm = () => {
		setContent("");
		setImage(null);
		setImagePreview(null);
		setType("discussion");
		setIsModalOpen(false);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleCardClick = (postType) => {
		setType(postType);
		setIsModalOpen(true);
	};

	return (
		<>
			{/* Post Type Cards */}
			<div className="grid grid-cols-2 gap-4 mb-4">
				{["discussion", "job", "internship", "event","personal","Other"].map((postType) => (
					<div
						key={postType}
						className="p-4 border rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-center"
						onClick={() => handleCardClick(postType)}
					>
						<span className="text-lg font-semibold">
							{postType.charAt(0).toUpperCase() + postType.slice(1)}
						</span>
					</div>
				))}
			</div>

			{/* Modal for post creation */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg shadow-lg p-6 relative">
						<button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2">
							&times;
						</button>
						<div>
							<div className='flex space-x-3'>
								<img src={user.profilePicture || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />
								<textarea
									placeholder="What's on your mind?"
									className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
									value={content}
									onChange={(e) => setContent(e.target.value)}
								/>
							</div>

							{imagePreview && (
								<div className='mt-4'>
									<img src={imagePreview} alt='Selected' className='w-full h-auto rounded-lg' />
								</div>
							)}

							<div className='flex justify-between items-center mt-4'>
								<div className='flex space-x-4'>
									<label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
										<Image size={20} className='mr-2' />
										<span>Photo</span>
										<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
									</label>
									<select
										value={type}
										onChange={(e) => setType(e.target.value)}
										className='bg-base-100 rounded-lg p-2'
									>
										<option value="discussion">Discussion</option>
										<option value="job">Job</option>
										<option value="internship">Internship</option>
										<option value="event">Event</option>
										<option value="event">Other</option>
										<option value="personal">Personal</option>
									</select>
								</div>

								<button
									className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'
									onClick={handlePostCreation}
									disabled={isPending}
								>
									{isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PostCreation;
