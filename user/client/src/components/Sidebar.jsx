import { useState } from "react";
import { Link } from "react-router-dom";
import PostCreation from "./PostCreation"; // Import PostCreation component

// Import your images
import discussionImg from "/images/discussion.png";
import jobImg from "/images/job.png";
import internshipImg from "/images/internship.png";
import eventImg from "/images/event.png";
import personalImg from "/images/personal.png";
import otherImg from "/images/other.png";

const categoryImages = {
  discussion: discussionImg,
  job: jobImg,
  internship: internshipImg,
  event: eventImg,
  personal: personalImg,
  other: otherImg,
};

export default function Sidebar({ user }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState("");

  const openPostCreation = (type) => {
    setSelectedPostType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="bg-secondary rounded-lg shadow-lg sticky top-16 z-20">
      {" "}
      {/* Adjust top value to prevent overlap with navbar */}
      <div className="p-4 text-center">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
          }}
        />
        <Link to={`/profile/${user.username}`}>
          <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto mt-[-40px] shadow-md border-2 border-[#fe6019]"
          />
          <h2 className="text-xl font-semibold mt-2 text-[#fe6019]">{user.name}</h2>
        </Link>
        <p className="text-info">{user.headline}</p>
        <p className="text-info text-xs">{user.Links.length} Links</p>
      </div>
      {/* New Section for Categories with Images */}
      <div className="border-t border-base-100 p-4">
        <h3 className="text-lg font-semibold mb-2 text-[#fe6019]">Post </h3>
        <ul className="space-y-2">
          {[
            "discussion",
            "job",
            "internship",
            "event",
            "personal",
            "other",
          ].map((type) => (
            <li key={type}>
              <button
                onClick={() => openPostCreation(type)}
                className="flex items-center justify-center p-0 transition-all duration-200 hover:bg-[#fe6019]/20 hover:shadow-md"
                style={{ height: "50px" }} // Make button full width
              >
                <img
                  src={categoryImages[type]}
                  alt={type}
                  className="w-full h-full rounded-md transition-transform duration-200 transform hover:scale-105" // Adjust image styling with hover effect
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {isModalOpen && (
        <PostCreation
          user={user}
          selectedPostType={selectedPostType}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
