import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader, XCircle } from "lucide-react";

const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [selectedType, setSelectedType] = useState(null);
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

	const openPostModal = (type) => {
		setSelectedType(type);
		setIsModalOpen(true);
	};

	const handlePostCreation = async () => {
		try {
			const postData = { content, type: selectedType };
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
		setSelectedType(null);
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

	return (
		<div className='bg-secondary rounded-lg shadow mb-4 p-4'>
			<h2 className='text-lg font-bold mb-4'>Create a Post</h2>
			<div className='grid grid-cols-2 gap-4'>
				{["discussion", "job", "internship", "event"].map((type) => (
					<div
						key={type}
						className={`cursor-pointer p-6 rounded-lg text-center bg-base-100 shadow-lg transition-transform transform hover:scale-105 ${type === selectedType ? "bg-primary text-white" : ""}`}
						onClick={() => openPostModal(type)}
					>
						<h3 className='capitalize text-lg font-semibold'>{type}</h3>
					</div>
				))}
			</div>

			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative'>
						<XCircle size={24} className='absolute top-4 right-4 cursor-pointer' onClick={resetForm} />
						<div className='flex items-center space-x-3 mb-4'>
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
							<label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
								<Image size={20} className='mr-2' />
								<span>Photo</span>
								<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
							</label>

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
			)}
		</div>
	);
};

export default PostCreation;
