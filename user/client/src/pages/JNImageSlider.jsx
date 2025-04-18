import React from "react";
import { motion } from "framer-motion";

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
    <div className="relative w-full py-8 overflow-hidden">
      <motion.div
        className="flex gap-8"
        style={{
          width: `calc(300px * ${images.length * 2 + 2})`,
        }}
        animate={{
          x: [`0%`, `-${(images.length * 300) + (images.length * 32)}px`]
        }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }}
        whileHover={{ 
          animationPlayState: "paused"
        }}
      >
        {[...images, ...images].map((image, index) => (
          <motion.div
            key={index}
            className="group flex flex-col items-center justify-between border border-orange-200 shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-orange-800"
            style={{ width: "300px", height: "300px", flexShrink: 0 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(254, 96, 25, 0.2), 0 8px 10px -6px rgba(254, 96, 25, 0.2)",
              border: "1px solid rgba(254, 96, 25, 0.3)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
          >
            {/* Image container with enhanced hover effect */}
            <motion.div className="w-full h-3/4 overflow-hidden rounded-t-md">
              <motion.img
                src={image.url}
                className="w-full h-full object-cover"
                alt={image.alt}
                loading="lazy"
                whileHover={{ 
                  scale: 1.1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                }}
              />
            </motion.div>
            
            {/* Caption with fade-in effect */}
            <motion.div 
              className="w-full h-1/4 flex items-center justify-center p-2 bg-opacity-90 backdrop-blur-sm"
              initial={{ opacity: 0.8 }}
              whileHover={{ 
                opacity: 1,
                backgroundColor: "rgba(254, 96, 25, 0.05)",
                transition: {
                  duration: 0.2
                }
              }}
            >
              <motion.p 
                className="text-lg font-semibold text-[#fe6019] text-center"
                whileHover={{
                  scale: 1.02,
                  transition: {
                    duration: 0.2
                  }
                }}
              >
                {image.caption}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default JNImageSlider;
