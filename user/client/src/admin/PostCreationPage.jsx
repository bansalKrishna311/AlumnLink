import { Image } from "lucide-react";
import React, { useState } from "react";

const CreatePostPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState("discussion");
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [image, setImage] = useState(null);
  const [timestamp, setTimestamp] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenForm = (postType) => {
    setSelectedPostType(postType);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmitPost = () => {
    if (postContent.trim() === "" || !image) {
      alert("Post content and image are required!");
    } else {
      setTimestamp(new Date().toLocaleString());
      setIsSuccess(true);
      resetForm();
    }
  };

  const resetForm = () => {
    setPostContent("");
    setPostTitle("");
    setCompanyName("");
    setDuration("");
    setSkills("");
    setEventDate("");
    setEventVenue("");
    setImage(null);
    setShowForm(false);
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="text-center lg:text-left lg:ml-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-300 to-gray-900 text-transparent bg-clip-text mb-4">
          Create a Post
        </h1>
        <p className="text-gray-600">
          Share your ideas, opportunities, and events with the community.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4">
        {["discussion", "job", "internship", "event", "others"].map((type) => (
          <button
            key={type}
            onClick={() => handleOpenForm(type)}
            className={`w-36 h-10 px-3 py-2 text-white rounded-full shadow-md hover:opacity-90 transition duration-300 ${
              type === "discussion"
                ? "bg-gradient-to-r from-orange-400 to-yellow-400"
                : type === "job"
                ? "bg-gradient-to-r from-indigo-400 to-purple-400"
                : type === "internship"
                ? "bg-gradient-to-r from-green-700 to-green-500"
                : type === "event"
                ? "bg-gradient-to-r from-blue-600 to-blue-400"
                : "bg-gradient-to-r from-pink-500 to-pink-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="mt-8 mx-auto lg:ml-4 max-w-md lg:max-w-lg">
          <div
            className={`p-6 rounded-lg shadow-md ${
              selectedPostType === "discussion"
                ? "bg-gradient-to-r from-orange-200 to-yellow-200"
                : selectedPostType === "job"
                ? "bg-gradient-to-r from-indigo-200 to-purple-200"
                : selectedPostType === "internship"
                ? "bg-gradient-to-r from-green-400 to-green-200"
                : selectedPostType === "event"
                ? "bg-gradient-to-r from-blue-300 to-blue-100"
                : "bg-gradient-to-r from-pink-300 to-pink-100"
            }`}
          >
            <h2 className="text-xl font-bold mb-4 capitalize text-center lg:text-left text-white">
              Create a {selectedPostType}
            </h2>
            <input
              type="text"
              placeholder="Post Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`Write your ${selectedPostType}...`}
              rows="3"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />

            {/* Fields specific to post types */}
            {(selectedPostType === "job" ||
              selectedPostType === "internship") && (
              <>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                {selectedPostType === "job" && (
                  <input
                    type="text"
                    placeholder="Skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                  />
                )}
              </>
            )}

            {selectedPostType === "event" && (
              <>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Venue"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
              </>
            )}

            {/* Image Upload */}
            <div className="mb-4">
              <button
                onClick={handleImageChange}
                className="flex items-center space-x-2 mb-4 p-2 rounded-lg"
              >
                <Image size={20} color="red" />
                <span>Upload Photo</span>
              </button>
            </div>

            <button
              onClick={handleSubmitPost}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:opacity-90 transition duration-300"
            >
              Submit Post
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="mt-6 mx-auto lg:ml-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-md text-center lg:text-left max-w-md">
          <p>Your post was successfully created!</p>
          <p>
            <strong>Timestamp:</strong> {timestamp}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;
