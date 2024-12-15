import { useState } from "react";
import PostCreation from "../components/PostCreation";  // Adjust the import path according to your project structure

const PostPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);  // To control modal visibility
  const [selectedPostType, setSelectedPostType] = useState("discussion");  // Default post type (can be dynamic)

  const user = {
    profilePicture: "/avatar.png",  // Sample user data, replace with actual data
    name: "John Doe",
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Close modal
  };

  return (
    <div className="container mx-auto p-4">
      {/* Conditionally render PostCreation component */}
      {isModalOpen && (
        <PostCreation
          user={user}
          selectedPostType={selectedPostType}
          closeModal={closeModal}
        />
      )}

      {/* Example button to open modal with a specific post type */}
      <button
        onClick={() => {
          setSelectedPostType("job"); // Set selected post type dynamically
          setIsModalOpen(true);  // Open the modal
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Create Job Post
      </button>

      <button
        onClick={() => {
          setSelectedPostType("event");  // Example: change post type to event
          setIsModalOpen(true);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Create Event Post
      </button>
    </div>
  );
};

export default PostPage;
