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
      default:
        return null;
    }
  };

  return (
    <>
      {selectedPostType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-8 overflow-y-auto max-h-[90vh]" // added max-height and overflow-y for scrolling
            style={{
              backgroundImage: "url('../../public/background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-white py-2 px-4 rounded-lg">
              Create a Post
            </div>
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
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden" // Hide the actual input
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
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white font-semibold py-2 rounded-lg transition duration-300 flex justify-center items-center"
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
