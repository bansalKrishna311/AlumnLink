import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

import JoinNetwork from "./joinNetwork";
import JNImageSlider from "./JNImageSlider";

const JoinNetworkCalling = () => {
  const queryClient = useQueryClient(); // Optional use later
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // Smaller size range
      speed: Math.random() * 0.8 + 0.3, // Slower speed
      opacity: Math.random() * 0.2 + 0.05 // More subtle opacity
    }));
    setParticles(newParticles);
  }, []);

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
    }
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 0.4, ease: "easeOut" }
    }
  };

  const sliderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col justify-start items-center pt-8 pb-16 relative bg-transparent overflow-none"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      ref={ref}
    >
      {/* Background particles with improved animation */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/30"
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            zIndex: -1
          }}
          animate={{
            top: [`${particle.y}%`, `${(particle.y + 8) % 100}%`],
            left: [`${particle.x}%`, `${(particle.x + 4) % 100}%`],
            opacity: [particle.opacity, particle.opacity * 0.6, particle.opacity]
          }}
          transition={{
            duration: 12 / particle.speed,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Heading with improved gradient */}
      <motion.p
        className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-black via-gray-800 to-blue-700 bg-clip-text text-transparent mb-4 px-4"
        variants={paragraphVariants}
      >
        Stay connected with your alumni network
      </motion.p>

      {/* Button with reduced spacing */}
      <motion.div
        className="flex flex-row gap-4 justify-center items-center mb-6"
        variants={buttonContainerVariants}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="relative"
          whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div
            className="absolute inset-0 bg-blue-400/40 rounded-lg blur-md -z-10"
            animate={{
              opacity: isHovered ? 0.7 : 0,
              scale: isHovered ? 1.08 : 1
            }}
            transition={{ duration: 0.4 }}
          />
          <JoinNetwork />
        </motion.div>
      </motion.div>

      {/* Subtext with adjusted spacing */}
      <motion.p
        className="text-base text-gray-700 text-center mb-8 max-w-xl px-4 font-medium"
        variants={paragraphVariants}
      >
        Build meaningful connections with alumni, mentors, and peers from your institution.
      </motion.p>

      {/* Image Slider with smooth entrance */}
      <motion.div
        className="w-full max-w-4xl mx-auto"
        variants={sliderVariants}
      >
        <JNImageSlider />
      </motion.div>

      {/* Floating gradients with smoother animations */}
      <motion.div
        className="absolute right-8 top-24 w-12 h-12 rounded-full bg-gradient-to-r from-purple-400/30 to-blue-500/30 blur-xl"
        animate={{
          y: [0, -12, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute left-12 bottom-24 w-8 h-8 rounded-full bg-gradient-to-r from-blue-300/30 to-purple-300/30 blur-xl"
        animate={{
          y: [0, 10, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </motion.div>
  );
};

export default JoinNetworkCalling;
