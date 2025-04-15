import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

import JoinNetwork from "./joinNetwork";
import JNImageSlider from "./JNImageSlider";

const JoinNetworkCalling = () => {
  const queryClient = useQueryClient(); // Optional use later
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const [particles, setParticles] = useState([]);
  const [floatingOrbs, setFloatingOrbs] = useState([]);

  useEffect(() => {
    // Create enhanced particles with more varied properties
    const newParticles = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.4 + 0.05,
      color: ["blue", "purple", "indigo", "cyan"][Math.floor(Math.random() * 4)],
      delay: Math.random() * 3,
      rotation: Math.random() * 360,
      movePattern: ["circular", "wave", "zigzag"][Math.floor(Math.random() * 3)],
    }));
    setParticles(newParticles);

    // Create floating orbs for additional depth
    const newOrbs = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      size: Math.random() * 60 + 40,
      speed: Math.random() + 0.5,
      opacity: Math.random() * 0.12 + 0.04,
      gradient: Math.random() > 0.5 ? "blue-purple" : "indigo-cyan",
      delay: Math.random() * 2,
    }));
    setFloatingOrbs(newOrbs);
  }, []);

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.2 
      },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.4 
      },
    },
  };

  const sliderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.6 
      },
    },
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col justify-start items-center pt-8 pb-16 relative bg-transparent overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      ref={ref}
    >
      {/* Large floating gradient orbs for depth */}
      {floatingOrbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className={`absolute rounded-full ${
            orb.gradient === "blue-purple"
              ? "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
              : "bg-gradient-to-r from-indigo-400/20 to-cyan-300/20"
          }`}
          style={{
            position: "absolute",
            pointerEvents: "none",
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            opacity: orb.opacity,
            zIndex: -2,
            filter: "blur(20px)",
          }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: [orb.opacity, orb.opacity * 1.5, orb.opacity * 0.7, orb.opacity],
          }}
          transition={{
            duration: 20 / orb.speed,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* Enhanced background particles with more dynamic animations */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className={`absolute rounded-full ${
              particle.color === "blue"
                ? "bg-blue-400/30"
                : particle.color === "purple"
                ? "bg-purple-400/30"
                : particle.color === "cyan"
                ? "bg-cyan-400/30"
                : "bg-indigo-400/30"
            }`}
            style={{
              position: "absolute",
              pointerEvents: "none",
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              zIndex: -1,
              rotate: `${particle.rotation}deg`,
            }}
            animate={{
              top: 
                particle.movePattern === "circular"
                  ? [
                      `${particle.y}%`,
                      `${(particle.y + 15) % 100}%`,
                      `${particle.y}%`,
                    ]
                  : particle.movePattern === "zigzag"
                  ? [
                      `${particle.y}%`,
                      `${(particle.y + 10) % 100}%`,
                      `${(particle.y - 5) % 100}%`,
                      `${particle.y}%`,
                    ]
                  : [
                      `${particle.y}%`,
                      `${(particle.y + 20) % 100}%`,
                      `${particle.y}%`,
                    ],
              left:
                particle.movePattern === "circular"
                  ? [
                      `${particle.x}%`,
                      `${(particle.x + 15) % 100}%`,
                      `${particle.x}%`,
                    ]
                  : particle.movePattern === "zigzag"
                  ? [
                      `${particle.x}%`,
                      `${(particle.x - 8) % 100}%`,
                      `${(particle.x + 8) % 100}%`,
                      `${particle.x}%`,
                    ]
                  : [
                      `${particle.x}%`,
                      `${(particle.x + 10) % 100}%`,
                      `${particle.x}%`,
                    ],
              opacity: [
                particle.opacity,
                particle.opacity * 0.7,
                particle.opacity * 1.2,
                particle.opacity,
              ],
              scale: [1, 1.4, 0.8, 1],
              rotate: [
                `${particle.rotation}deg`,
                `${particle.rotation + 180}deg`,
                `${particle.rotation + 360}deg`,
              ],
              filter: [
                "blur(0px)",
                "blur(2px)",
                "blur(0px)",
              ],
            }}
            transition={{
              duration: 12 / particle.speed,
              repeat: Infinity,
              repeatType: "loop",
              ease: particle.movePattern === "circular" ? "circIn" : 
                    particle.movePattern === "zigzag" ? "easeInOut" : "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Shimmering effect overlays */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-300/5 to-transparent"
        animate={{
          opacity: [0, 0.08, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.div 
        className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-300/5 to-transparent"
        animate={{
          opacity: [0, 0.05, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 4,
        }}
      />

      {/* Heading with improved gradient */}
      <motion.p
        className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-black via-gray-800 to-blue-700 bg-clip-text text-transparent mb-2 px-4"
        variants={paragraphVariants}
      >
        Stay connected with your alumni network
      </motion.p>
      {/* Subtext with adjusted spacing */}
      <motion.p
        className="text-base text-gray-700 text-center max-w-xl px-4 font-medium mb-4"
        variants={paragraphVariants}
      >
        Build meaningful connections with alumni, mentors, and peers from your
        institution.
      </motion.p>

      {/* Button with reduced spacing */}
      <motion.div
        className="flex flex-row gap-4 justify-center items-center mb-6 "
        variants={buttonContainerVariants}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="relative"
          whileHover={{ 
            scale: 1.03,
            transition: { 
              type: "spring",
              stiffness: 400,
              damping: 10 
            }
          }}
          whileTap={{ 
            scale: 0.97,
            transition: { 
              type: "spring",
              stiffness: 300,
              damping: 10 
            }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-blue-400/40 rounded-lg blur-md -z-10"
            animate={{
              opacity: isHovered ? 0.7 : 0,
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          />
          <JoinNetwork />
        </motion.div>
      </motion.div>

      {/* Image Slider with smooth entrance */}
      <motion.div
        className="w-full max-w-4xl mx-auto relative overflow-x-hidden"
        variants={sliderVariants}
        initial="hidden"
        animate="visible"
        whileInView={{ 
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
          }
        }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <JNImageSlider />
      </motion.div>

      {/* Enhanced floating gradients with smoother animations */}
      <motion.div
        className="absolute right-8 top-24 w-16 h-16 rounded-full bg-gradient-to-r from-purple-400/30 via-blue-500/30 to-indigo-400/30 blur-xl"
        animate={{
          y: [0, -16, 0],
          x: [0, 8, 0],
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-12 bottom-24 w-12 h-12 rounded-full bg-gradient-to-r from-blue-300/30 via-purple-300/30 to-cyan-300/30 blur-xl"
        animate={{
          y: [0, 12, 0],
          x: [0, -6, 0],
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
          rotate: [0, -60, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Add a subtle pulsing glow effect */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-96 rounded-full bg-blue-400/5 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ zIndex: -3 }}
      />
    </motion.div>
  );
};

export default JoinNetworkCalling;