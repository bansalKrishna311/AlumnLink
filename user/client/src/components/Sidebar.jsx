import { useState } from "react";
import { Link } from "react-router-dom";
import PostCreation from "./PostCreation"; // Import PostCreation component
import { MessageCircle, Briefcase, GraduationCap, CalendarDays, User, MoreHorizontal,MapPin } from "lucide-react";


// Import your images
// ...existing code...

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

  // Check if we're inside a Sheet component on mobile
  const isInSheet = window.innerWidth < 1024;

  return (
    <div className={`bg-secondary rounded-lg shadow-lg ${isInSheet ? "h-full" : "sticky top-16 z-20"}`}>
      <div className="p-4 text-center ">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `url("${user?.bannerImg || "/banner.png"}")`,
          }}
        />
        <Link to={`/profile/${user?.username}`}>
          <img
            src={user?.profilePicture || "/avatar.png"}
            alt={user?.name}
            className="w-20 h-20 rounded-full mx-auto mt-[-40px] shadow-md border-2 border-[#fe6019] object-cover"
          />
          <h2 className="text-xl font-semibold mt-2 text-[#fe6019]">{user?.name}</h2>
        </Link>
        <p className="text-info">{user?.headline}</p>
        {/* <p className="text-info text-xs">{user?.Links?.length} Links</p> */}
         <p className="text-info text-xs flex items-center justify-center font-medium">
           <MapPin className="w-4 h-4 text-[#fe6019] inline-block" />
           {user?.location}
         </p>
      </div>
      
      {/* Ultra-Professional Create Post Section */}
      <div className="border-t border-base-100 p-3">
        <h3 className="text-lg font-bold mb-3 text-[#fe6019] text-center tracking-wide uppercase">Create a Post</h3>
        <ul className="space-y-2">
          {[
            {
              type: "discussion",
              label: "Discussion",
              icon: <MessageCircle className="w-6 h-6" style={{ color: '#F5C75D' }} />,
              desc: "Start a discussion."
            },
            {
              type: "job",
              label: "Job Opportunity",
              icon: (
                <span className="group/job">
                  <Briefcase className="w-6 h-6 transition-colors duration-200" style={{ color: '#8e24aa' }} />
                  <style>{`
                    .group/job:hover .lucide-briefcase {
                      color: #d1aaff !important;
                    }
                  `}</style>
                </span>
              ),
              desc: "Share job openings."
            },
            {
              type: "internship",
              label: "Internship",
              icon: <GraduationCap className="w-6 h-6" style={{ color: '#057642' }} />,
              desc: "Post or search for internships."
            },
            {
              type: "event",
              label: "Event",
              icon: <CalendarDays className="w-6 h-6" style={{ color: '#38BDF8' }} />,
              desc: "Announce or join events."
            },
            {
              type: "personal",
              label: "Personal",
              icon: <User className="w-6 h-6 text-pink-500 group-hover:text-pink-600" />,
              desc: "Share personal updates."
            },
            {
              type: "other",
              label: "Other",
              icon: <MoreHorizontal className="w-6 h-6 text-blue-500 group-hover:text-blue-600" />,
              desc: "Anything else you want to share."
            },
          ].map(({ type, label, icon, desc }) => (
            <li key={type}>
              <button
                onClick={() => openPostCreation(type)}
                className="w-full flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-2 shadow-sm hover:shadow-md hover:border-[#fe6019] hover:bg-[#fe6019]/10 hover:text-[#fe6019] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fe6019] text-sm font-medium text-gray-800 group min-h-0"
                aria-label={`Create a ${label} post`}
                style={{ minHeight: 0 }}
              >
                <span className="flex-shrink-0">{icon}</span>
                <span className="flex flex-col items-start">
                  <span className="font-semibold leading-tight text-sm">{label}</span>
                  <span className="text-xs text-gray-500 group-hover:text-[#fe6019] leading-tight">{desc}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-gray-400 text-center">Select a category to start creating a post</p>
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
