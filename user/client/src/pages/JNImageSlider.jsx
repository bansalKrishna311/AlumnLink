import React from "react";

// College-related images data
const images = [
  {
    url: "https://img.freepik.com/free-photo/group-diverse-grads-throwing-caps-up-sky_53876-56031.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Graduation ceremony",
    caption: "Celebrating Success",
  },
  {
    url: "https://img.freepik.com/free-photo/arrangement-with-microscope-plant_23-2148785050.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Students studying in library",
    caption: "Academic Excellence",
  },
  {
    url: "https://img.freepik.com/free-photo/close-up-happy-people-with-placards_23-2149163196.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Campus life",
    caption: "Vibrant Community",
  },
  {
    url: "https://img.freepik.com/free-photo/global-communication-background-business-network-design_53876-153359.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Alumni networking event",
    caption: "Strong Connections",
  },
  {
    url: "https://img.freepik.com/free-photo/executive-manager-wearing-virtual-reality-headset_482257-77677.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Research presentation",
    caption: "Innovation",
  },
  {
    url: "https://img.freepik.com/free-photo/football-background-with-frame_23-2147832085.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Sports team",
    caption: "Athletic Achievement",
  },
  {
    url: "https://img.freepik.com/free-photo/diverse-friends-students-shoot_53876-47012.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Cultural festival",
    caption: "Diversity Celebration",
  },
  {
    url: "https://img.freepik.com/free-photo/metaverse-concept-collage-design_23-2149419858.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Career fair",
    caption: "Future Opportunities",
  },
  {
    url: "https://img.freepik.com/free-photo/medium-shot-queer-students-outdoors_23-2150405204.jpg?uid=R100560778&ga=GA1.1.439306962.1724921372&semt=ais_hybrid",
    alt: "Alumni donation",
    caption: "Giving Back",
  },
];

const JNImageSlider = () => {
  return (
    <div className="relative overflow-hidden w-full py-8">
      {/* Wrapper for continuous scrolling effect */}
      <div
        className="flex"
        style={{
          animation: "scrollLeft 40s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {/* Duplicate images to create the loop */}
        {[...images, ...images].map((image, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between border border-gray-200 shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 mx-4"
            style={{ width: "300px", height: "300px", flexShrink: 0 }}
          >
            {/* Image */}
            <div className="w-full h-3/4 overflow-hidden">
              <img
                src={image.url} // The image URL from the array
                className="w-full h-full object-cover"
                alt={image.alt} // The alt text from the array
              />
            </div>
            {/* Caption */}
            <div className="w-full h-1/4 flex items-center justify-center">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 truncate text-center">
                {image.caption} {/* The caption from the array */}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Keyframe animation for smooth and continuous scrolling */}
      <style jsx>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-300px * ${images.length}));
          }
        }
      `}</style>
    </div>
  );
};

export default JNImageSlider;
