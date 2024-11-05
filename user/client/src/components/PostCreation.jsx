import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader, X } from "lucide-react";

const PostCreation = ({ user, selectedPostType, closeModal }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [type, setType] = useState(selectedPostType || "discussion");

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

  useEffect(() => {
    if (selectedPostType) {
      setType(selectedPostType);
    }
  }, [selectedPostType]);

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
    closeModal();
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
    <>
      {selectedPostType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-8"
            style={{
              backgroundImage: "url('../../public/background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 font-bold text-xl"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-white py-2 px-4 rounded-lg">
              Create a Post
            </h2>
            <div className="flex items-start space-x-3 mb-4">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-3 rounded-lg bg-purple-50 focus:bg-purple-100 focus:outline-none resize-none min-h-[100px] transition duration-200"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {imagePreview && (
              <div className="relative mt-2 mb-4">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center text-blue-500 hover:text-blue-600 cursor-pointer transition duration-200">
                  <Image size={20} className="mr-2" />
                  <span>Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-blue-50 border border-gray-300 rounded-lg p-2 text-gray-700 transition duration-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="discussion">Discussion</option>
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                  <option value="event">Event</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200"
                onClick={handlePostCreation}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader size={16} className="animate-spin mr-2" />
                ) : (
                  "Share"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCreation;
