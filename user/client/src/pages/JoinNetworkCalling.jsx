import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import JoinNetwork from "./joinNetwork";
import JNImageSlider from "./JNImageSlider";
import Doodles from "./auth/components/Doodles";

const JoinNetworkCalling = () => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  // Disable scrolling when component mounts
  useEffect(() => {
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
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
        delay: 0.2,
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
        delay: 0.4,
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
        delay: 0.6,
      },
    },
  };

  return (
    <>
    <Doodles/>
    <motion.div
      className="w-full h-full flex flex-col justify-start items-center pt-8 pb-16 relative bg-transparent overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      ref={ref}
    >
      <motion.p
        className="text-2xl p-2 md:text-3xl font-bold text-center bg-gradient-to-r from-[#fe6019] via-orange-600 to-amber-600 bg-clip-text text-transparent mb-2 "
        variants={paragraphVariants}
      >
        Stay connected with your alumni network
      </motion.p>

      <motion.p
        className="text-base text-gray-700 text-center max-w-xl px-4 font-medium mb-4"
        variants={paragraphVariants}
      >
        Build meaningful connections with alumni, mentors, and peers from your
        institution.
      </motion.p>

      <motion.div
        className="flex flex-row gap-4 justify-center items-center mb-6"
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
            className="absolute inset-0 bg-[#fe6019]/40 rounded-lg blur-md -z-10"
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
    </motion.div>
    </>
  );
};

export default JoinNetworkCalling;
