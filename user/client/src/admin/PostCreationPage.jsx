import React, { useState } from "react";
import PostCreation from "@/components/PostCreation";

const CreatePostPage = () => {
  const [showModal, setShowModal] = useState(false);

  // Sample user object, replace with actual user data from your context or API
  const user = {
    name: "John Doe",
    profilePicture: "/path-to-profile-picture.jpg",
  };

  const handleOpenModal = (postType) => {
    setShowModal(true);
    setSelectedPostType(postType);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [selectedPostType, setSelectedPostType] = useState("discussion");

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold">Create a Post</h1>
      <div className="space-x-4 mt-4">
        <button
          onClick={() => handleOpenModal("discussion")}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          Discussion
        </button>
        <button
          onClick={() => handleOpenModal("job")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Job
        </button>
        <button
          onClick={() => handleOpenModal("internship")}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Internship
        </button>
        <button
          onClick={() => handleOpenModal("event")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Event
        </button>
      </div>

      {/* Render PostCreation component as a modal */}
      {showModal && (
        <PostCreation
          user={user}
          selectedPostType={selectedPostType}
          closeModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CreatePostPage;
