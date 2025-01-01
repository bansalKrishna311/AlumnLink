import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

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
    onSuccess: (data) => {
      resetForm();
      // Update success message to reflect pending status
      toast.success(
        data.status === "pending" 
          ? "Post submitted for review. You'll be notified once it's approved." 
          : "Post created successfully"
      );
      // Only invalidate queries if the post is immediately visible (for admins)
      if (data.status === "approved") {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
      // Add query invalidation for pending posts if user is admin
      if (user.isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["pendingPosts"] });
      }
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

  // Close modal when clicking outside the modal
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

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

  const handleFileButtonClick = () => {
    document.getElementById("fileInput").click();
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
          <>
            <input
              type="text"
              placeholder="Personal Details"
              className="w-full p-2 rounded-lg mb-2 border border-gray-300"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </>
        );
      default:
        return null;
    }
  };

  const getButtonGradient = () => {
    switch (type) {
      case "discussion":
        return "bg-gradient-to-r from-orange-400 to-yellow-400";
      case "job":
        return "bg-gradient-to-r from-indigo-400 to-purple-400";
      case "internship":
        return "bg-gradient-to-r from-green-600 to-green-300";
      case "event":
        return "bg-gradient-to-r from-blue-400 to-blue-200";
      case "personal":
        return "bg-gradient-to-r from-pink-500 to-pink-300";
      case "other":
        return "bg-gradient-to-r from-blue-500 to-blue-300";
      default:
        return "";
    }
  };

  const getInputBackground = () => {
    switch (type) {
      case "discussion":
        return "bg-yellow-100 opacity-80";
      case "job":
        return "bg-purple-100 opacity-80";
      case "internship":
        return "bg-green-100 opacity-80";
      case "event":
        return "bg-blue-100 opacity-80";
      case "personal":
        return "bg-pink-100 opacity-80";
      case "other":
        return "bg-blue-200 opacity-80";
      default:
        return "opacity-80";
    }
  };
  const getStatusBadge = () => {
    return (
      <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded-lg text-sm text-yellow-700">
        Note: Your post will be reviewed by an admin before being published.
      </div>
    );
  };
  return (
    <>
      {selectedPostType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-8 overflow-y-auto max-h-[90vh]"
            style={{
              backgroundImage: "url('../../public/background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className={`text-xl font-semibold mb-4 text-white py-2 px-4 rounded-lg ${getButtonGradient()}`}
            >
              Create a Post
            </div>

            {/* Add status badge for non-admin users */}
            {!user.isAdmin && getStatusBadge()}

            <div className="flex items-start space-x-3 mb-4">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <textarea
                placeholder="What's on your mind?"
                className={`w-full p-3 rounded-lg bg-opacity-80 focus:outline-none resize-none min-h-[100px] transition duration-200 ${getInputBackground()}`}
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
              </div>
            )}

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              onClick={handleFileButtonClick}
              className="flex items-center space-x-2 mb-4 p-2 rounded-lg"
            >
              <Image size={20} color="red" />
              <span>Upload Photo</span>
            </button>

            {renderAdditionalInputs()}

            <button
              onClick={handlePostCreation}
              disabled={isPending}
              className={`w-full py-2 rounded-lg transition duration-300 flex justify-center items-center ${getButtonGradient()}`}
            >
              {isPending ? <Loader className="animate-spin" /> : "Submit Post"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCreation;