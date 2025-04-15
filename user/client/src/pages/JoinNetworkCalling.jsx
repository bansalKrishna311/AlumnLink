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
    // Create more particles with enhanced properties
    const newParticles = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.35 + 0.05,
      color: ['blue', 'purple', 'indigo'][Math.floor(Math.random() * 3)],
      delay: Math.random() * 2,
      rotation: Math.random() * 360,
      movePattern: Math.random() > 0.5 ? 'circular' : 'wave'
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
          className={`absolute rounded-full ${
            particle.color === 'blue' 
              ? 'bg-blue-400/30' 
              : particle.color === 'purple' 
                ? 'bg-purple-400/30'
                : 'bg-indigo-400/30'
          }`}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            zIndex: -1,
            rotate: `${particle.rotation}deg`
          }}
          animate={{
            top: particle.movePattern === 'circular' 
              ? [
                  `${particle.y}%`,
                  `${(particle.y + 10) % 100}%`,
                  `${particle.y}%`
                ]
              : [
                  `${particle.y}%`,
                  `${(particle.y + 15) % 100}%`,
                  `${particle.y}%`
                ],
            left: particle.movePattern === 'circular'
              ? [
                  `${particle.x}%`,
                  `${(particle.x + 10) % 100}%`,
                  `${particle.x}%`
                ]
              : [
                  `${particle.x}%`,
                  `${(particle.x + 8) % 100}%`,
                  `${particle.x}%`
                ],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
            scale: [1, 1.3, 1],
            rotate: [`${particle.rotation}deg`, `${particle.rotation + 180}deg`, `${particle.rotation + 360}deg`]
          }}
          transition={{
            duration: 10 / particle.speed,
            repeat: Infinity,
            repeatType: "reverse",
            ease: particle.movePattern === 'circular' ? "circIn" : "easeInOut",
            delay: particle.delay
          }}
        />
      ))}

      {/* Heading with improved gradient */}
      <motion.p
        className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-black via-gray-800 to-blue-700 bg-clip-text text-transparent mb-2 px-4"
        variants={paragraphVariants}
      >
        Stay connected with your alumni network
      </motion.p>
{/* Subtext with adjusted spacing */}
<motion.p
        className="text-base text-gray-700 text-center  max-w-xl px-4 font-medium"
        variants={paragraphVariants}
      >
        Build meaningful connections with alumni, mentors, and peers from your institution.
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
