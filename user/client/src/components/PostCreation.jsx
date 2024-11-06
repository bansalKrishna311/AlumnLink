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
  
  // State variables for additional fields
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [internshipDuration, setInternshipDuration] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  
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

      // Add additional fields based on type
      if (type === "job") {
        postData.jobDetails = {
          companyName,
          jobTitle,
          jobLocation,
        };
      } else if (type === "internship") {
        postData.internshipDetails = {
          companyName,
          internshipDuration,
        };
      } else if (type === "event") {
        postData.eventDetails = {
          eventName,
          eventDate,
          eventLocation,
        };
      }

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
    
    // Reset additional fields
    setCompanyName("");
    setJobTitle("");
    setJobLocation("");
    setInternshipDuration("");
    setEventName("");
    setEventDate("");
    setEventLocation("");
    
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

  const renderAdditionalInputs = () => {
    switch (type) {
      case "job":
        return (
          <>
            <input
              type="text"
              placeholder="Company Name"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Job Title"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Job Location"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
            />
          </>
        );
      case "internship":
        return (
          <>
            <input
              type="text"
              placeholder="Company Name"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Internship Duration"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={internshipDuration}
              onChange={(e) => setInternshipDuration(e.target.value)}
            />
          </>
        );
      case "event":
        return (
          <>
            <input
              type="text"
              placeholder="Event Name"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <input
              type="datetime-local"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Event Location"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </>
        );
      case "personal":
        return (
          <input
            type="text"
            placeholder="Personal Thoughts"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        );
      case "other":
        return (
          <textarea
            placeholder="Other Details"
            className="w-full p-3 rounded-lg mb-2 border border-gray-300"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        );
      default:
        return null;
    }
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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
            />
            {renderAdditionalInputs()}
            <button
              onClick={handlePostCreation}
              disabled={isPending}
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {isPending ? <Loader className="animate-spin" /> : "Post"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCreation;
