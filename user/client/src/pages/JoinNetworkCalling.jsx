import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import JoinNetwork from "./joinNetwork";
import JNImageSlider from "./JNImageSlider";
import { useQueryClient } from "@tanstack/react-query";

const JoinNetworkCalling = () => {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  // Particle effect state
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Create particles when component mounts
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.6 + 0.2
    }));
    
    setParticles(newParticles);
  }, []);

  // Text animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };
  
  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.3,
        ease: "easeOut" 
      }
    }
  };
  
  const buttonContainerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: 0.7,
        ease: "easeOut" 
      }
    }
  };
  
  const sliderVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        delay: 0.5 
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col justify-start items-center pt-0 relative overflow-hidden bg-gradient-to-b from-white to-blue-50"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      ref={ref}
    >
      {/* Background particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500"
          initial={{ 
            left: `${particle.x}%`, 
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
          animate={{ 
            top: [`${particle.y}%`, `${(particle.y + 10) % 100}%`],
            left: [`${particle.x}%`, `${(particle.x + 5) % 100}%`],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
          }}
          transition={{
            duration: 10 / particle.speed,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      ))}
      
      <motion.h1 
        className="text-5xl font-bold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-purple-400 to-blue-600 mt-16 mb-6"
        variants={headingVariants}
      >
        Want to be a part of Alumlink?
      </motion.h1>

      <motion.p 
        className="text-lg text-gray-700 text-center mb-8 max-w-2xl px-4"
        variants={paragraphVariants}
      >
        Join a growing network of alumni, professionals, and students. Expand
        your connections and opportunities through the Alumlink community.
      </motion.p>

      <motion.div 
        className="w-full max-w-4xl mx-auto"
        variants={sliderVariants}
      >
        <JNImageSlider />
      </motion.div>

      <motion.p 
        className="text-3xl font-bold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-600 to-blue-800 mt-12 mb-8"
        variants={paragraphVariants}
        transition={{ delay: 0.6 }}
      >
        Join Now and be part of your Alma Mater
      </motion.p>

      {/* Buttons Container */}
      <motion.div 
        className="flex flex-row gap-4 justify-center items-center mt-4 mb-16"
        variants={buttonContainerVariants}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div 
          className="relative"
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3 } 
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow effect */}
          <motion.div 
            className="absolute inset-0 bg-blue-400 rounded-lg blur-md -z-10"
            animate={{
              opacity: isHovered ? 0.7 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          />
          <JoinNetwork />
        </motion.div>
      </motion.div>
      
      {/* Floating elements */}
      <motion.div
        className="absolute right-8 top-32 w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 blur-sm"
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div
        className="absolute left-12 bottom-32 w-10 h-10 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 blur-sm"
        animate={{
          y: [0, 15, 0],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
    </motion.div>
  );
};

export default JoinNetworkCalling;