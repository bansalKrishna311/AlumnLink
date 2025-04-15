"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useQueryClient } from "@tanstack/react-query"

import JoinNetwork from "./joinNetwork"
import JNImageSlider from "./JNImageSlider"

const JoinNetworkCalling = () => {
  const queryClient = useQueryClient() // Optional use later
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const [particles, setParticles] = useState([])
  const [floatingOrbs, setFloatingOrbs] = useState([])
  const [glowingLines, setGlowingLines] = useState([])

  useEffect(() => {
    // Create enhanced particles with more varied properties
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      speed: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: ["blue", "purple", "indigo", "cyan", "violet"][Math.floor(Math.random() * 5)],
      delay: Math.random() * 3,
      rotation: Math.random() * 360,
      movePattern: ["circular", "wave", "zigzag", "bounce"][Math.floor(Math.random() * 4)],
      blur: Math.random() > 0.7 ? Math.random() * 3 + 1 : 0,
    }))
    setParticles(newParticles)

    // Create floating orbs for additional depth
    const newOrbs = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      size: Math.random() * 120 + 60,
      speed: Math.random() + 0.5,
      opacity: Math.random() * 0.15 + 0.05,
      gradient: ["blue-purple", "indigo-cyan", "violet-blue", "cyan-indigo"][Math.floor(Math.random() * 4)],
      delay: Math.random() * 2,
      blur: Math.random() * 30 + 15,
    }))
    setFloatingOrbs(newOrbs)

    // Create glowing network lines
    const newLines = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      thickness: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.2 + 0.05,
      color: ["blue", "purple", "indigo"][Math.floor(Math.random() * 3)],
      delay: Math.random() * 2,
      duration: Math.random() * 8 + 6,
    }))
    setGlowingLines(newLines)
  }, [])

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.2,
      },
    },
  }

  const buttonContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.4,
      },
    },
  }

  const sliderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.6,
      },
    },
  }

  return (
    <motion.div
      className="w-full h-full flex flex-col justify-start items-center pt-8 pb-16 relative bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      ref={ref}
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent"></div>

      {/* Network connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -3 }}>
        {glowingLines.map((line) => (
          <motion.line
            key={`line-${line.id}`}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke={line.color === "blue" ? "#3b82f6" : line.color === "purple" ? "#a855f7" : "#6366f1"}
            strokeWidth={line.thickness}
            strokeOpacity={line.opacity}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, line.opacity, line.opacity, 0],
              x1: [`${line.x1}%`, `${line.x1}%`, `${(line.x1 + 10) % 100}%`],
              y1: [`${line.y1}%`, `${line.y1}%`, `${(line.y1 + 15) % 100}%`],
              x2: [`${line.x2}%`, `${(line.x2 + 15) % 100}%`, `${(line.x2 + 20) % 100}%`],
              y2: [`${line.y2}%`, `${(line.y2 + 10) % 100}%`, `${(line.y2 + 5) % 100}%`],
            }}
            transition={{
              duration: line.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
              delay: line.delay,
              times: [0, 0.4, 0.8, 1],
            }}
          />
        ))}
      </svg>

      {/* Large floating gradient orbs for depth */}
      {floatingOrbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className={`absolute rounded-full ${
            orb.gradient === "blue-purple"
              ? "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
              : orb.gradient === "indigo-cyan"
                ? "bg-gradient-to-r from-indigo-400/20 to-cyan-300/20"
                : orb.gradient === "violet-blue"
                  ? "bg-gradient-to-r from-violet-400/20 to-blue-300/20"
                  : "bg-gradient-to-r from-cyan-400/20 to-indigo-300/20"
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
            filter: `blur(${orb.blur}px)`,
          }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: [orb.opacity, orb.opacity * 1.5, orb.opacity * 0.7, orb.opacity],
          }}
          transition={{
            duration: 20 / orb.speed,
            repeat: Number.POSITIVE_INFINITY,
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
                ? "bg-blue-400/40"
                : particle.color === "purple"
                  ? "bg-purple-400/40"
                  : particle.color === "cyan"
                    ? "bg-cyan-400/40"
                    : particle.color === "violet"
                      ? "bg-violet-400/40"
                      : "bg-indigo-400/40"
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
              filter: particle.blur ? `blur(${particle.blur}px)` : "none",
            }}
            animate={{
              top:
                particle.movePattern === "circular"
                  ? [`${particle.y}%`, `${(particle.y + 15) % 100}%`, `${particle.y}%`]
                  : particle.movePattern === "zigzag"
                    ? [`${particle.y}%`, `${(particle.y + 10) % 100}%`, `${(particle.y - 5) % 100}%`, `${particle.y}%`]
                    : particle.movePattern === "bounce"
                      ? [
                          `${particle.y}%`,
                          `${(particle.y - 15) % 100}%`,
                          `${(particle.y + 15) % 100}%`,
                          `${particle.y}%`,
                        ]
                      : [`${particle.y}%`, `${(particle.y + 20) % 100}%`, `${particle.y}%`],
              left:
                particle.movePattern === "circular"
                  ? [`${particle.x}%`, `${(particle.x + 15) % 100}%`, `${particle.x}%`]
                  : particle.movePattern === "zigzag"
                    ? [`${particle.x}%`, `${(particle.x - 8) % 100}%`, `${(particle.x + 8) % 100}%`, `${particle.x}%`]
                    : particle.movePattern === "bounce"
                      ? [
                          `${particle.x}%`,
                          `${(particle.x + 10) % 100}%`,
                          `${(particle.x - 10) % 100}%`,
                          `${particle.x}%`,
                        ]
                      : [`${particle.x}%`, `${(particle.x + 10) % 100}%`, `${particle.x}%`],
              opacity: [particle.opacity, particle.opacity * 0.7, particle.opacity * 1.2, particle.opacity],
              scale: [1, 1.4, 0.8, 1],
              rotate: [`${particle.rotation}deg`, `${particle.rotation + 180}deg`, `${particle.rotation + 360}deg`],
              filter: particle.blur
                ? [`blur(${particle.blur}px)`, `blur(${particle.blur * 1.5}px)`, `blur(${particle.blur}px)`]
                : ["blur(0px)", "blur(2px)", "blur(0px)"],
            }}
            transition={{
              duration: 12 / particle.speed,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease:
                particle.movePattern === "circular"
                  ? "circIn"
                  : particle.movePattern === "zigzag"
                    ? "easeInOut"
                    : particle.movePattern === "bounce"
                      ? "easeOut"
                      : "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Shimmering effect overlays with enhanced gradients */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-300/10 to-transparent"
        animate={{
          opacity: [0, 0.12, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-300/8 to-transparent"
        animate={{
          opacity: [0, 0.08, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 4,
        }}
      />

      {/* Subtle light beam effect */}
      <motion.div
        className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-blue-200/10 via-transparent to-transparent"
        animate={{
          opacity: [0, 0.15, 0],
          x: ["-50%", "0%", "50%"],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ zIndex: -2 }}
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
        Build meaningful connections with alumni, mentors, and peers from your institution.
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
              damping: 10,
            },
          }}
          whileTap={{
            scale: 0.97,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 10,
            },
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
              damping: 10,
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
            damping: 15,
          },
        }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <JNImageSlider />
      </motion.div>

      {/* Enhanced floating gradients with smoother animations */}
      <motion.div
        className="absolute right-8 top-24 w-24 h-24 rounded-full bg-gradient-to-r from-purple-400/40 via-blue-500/40 to-indigo-400/40 blur-xl"
        animate={{
          y: [0, -16, 0],
          x: [0, 8, 0],
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-12 bottom-24 w-20 h-20 rounded-full bg-gradient-to-r from-blue-300/40 via-purple-300/40 to-cyan-300/40 blur-xl"
        animate={{
          y: [0, 12, 0],
          x: [0, -6, 0],
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
          rotate: [0, -60, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Add a subtle pulsing glow effect */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-96 rounded-full bg-blue-400/10 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ zIndex: -3 }}
      />

      {/* Subtle network nodes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-2 h-2 rounded-full bg-blue-500/60"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.7, 0.4],
            boxShadow: [
              "0 0 0 rgba(59, 130, 246, 0.4)",
              "0 0 10px rgba(59, 130, 246, 0.7)",
              "0 0 0 rgba(59, 130, 246, 0.4)",
            ],
          }}
          transition={{
            duration: 3 + i,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          zIndex: -4,
        }}
      />
    </motion.div>
  )
}

export default JoinNetworkCalling
