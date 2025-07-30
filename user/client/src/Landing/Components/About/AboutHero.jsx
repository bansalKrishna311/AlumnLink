import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  return (
    <div className="bg-gradient-to-b from-[#fe6019]/5 to-white py-16 relative overflow-hidden">
      <motion.div 
        className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#fe6019]/20 to-[#fe6019]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-0 left-20 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
      ></motion.div>

      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm mb-4 border border-[#fe6019]/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(254, 96, 25, 0.1)" }}
          >
            <motion.span 
              className="h-2 w-2 rounded-full bg-[#fe6019]"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            ></motion.span>
            <span className="text-sm font-medium text-gray-600">Our Story & Mission</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#fe6019] to-orange-600">About AlumnLink</h1>
          <p className="text-lg text-gray-600 mb-8">
            The first social networking platform tailored specifically for alumni communities. Built for meaningful connections, direct opportunities, and lifelong value.
          </p>
          <div className="w-24 h-1 bg-[#fe6019] mx-auto rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutHero;