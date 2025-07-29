import React from 'react';
import { motion } from 'framer-motion';

const HangingCap = () => {
  return (
    <motion.div 
      className="absolute top-12 right-20 hidden lg:block"
      animate={{ 
        x: [-2, 2, -2],
        y: [-1, 1, -1] 
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 8, 
        ease: "easeInOut",
        delay: 2
      }}
    >
      {/* Enhanced Hanging Rope */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: '250px', opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mx-auto"
      >
        {/* Main rope strand with swaying */}
        <motion.div 
          className="w-1 h-full bg-gradient-to-b from-amber-800 via-amber-700 to-amber-600 mx-auto rounded-full shadow-sm"
          animate={{ 
            rotateZ: [-1, 1, -1],
            scaleY: [1, 1.02, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8, 
            ease: "easeInOut",
            delay: 2
          }}
        ></motion.div>
      </motion.div>

      {/* Cap */}
      <motion.div
        initial={{ y: -80, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.5 }}
        className="relative -mt-2"
      >
        <motion.div 
          className="relative w-[100px] h-[64px] mx-auto"
          animate={{ 
            rotateZ: [-2, 2, -2],
            y: [-2, 2, -2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8, 
            ease: "easeInOut",
            delay: 2
          }}
        >

          {/* Top Board */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[22px]"
            style={{
              background: 'linear-gradient(to right, #fe6019, #e55017)',
              clipPath: 'polygon(0% 100%, 10% 0%, 90% 0%, 100% 100%)',
              border: '2.5px solid #d94515',
              borderBottom: 'none',
              zIndex: 10,
              borderRadius: '1px',
            }}
            animate={{ 
              rotateX: [-2, 2, -2],
              scale: [1, 1.01, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5, 
              ease: "easeInOut",
              delay: 5
            }}
          />

          {/* Cap Base */}
          <motion.div
            className="absolute top-[16px] left-[12px] w-[76px] h-[34px]"
            style={{
              background: 'linear-gradient(to bottom, #fe6019, #e55017)',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
              border: '2.5px solid #d94515',
              borderTop: 'none',
              zIndex: 5,
            }}
            animate={{ 
              scaleX: [1, 1.02, 1],
              y: [0, 1, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6, 
              ease: "easeInOut",
              delay: 3.5
            }}
          />

          {/* Tassel */}
          <motion.div
            animate={{ rotate: [0, 4, -4, 4, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-[16px] left-[8px] z-20"
          >
            {/* String */}
            <motion.div 
              className="w-0.5 h-[42px] bg-[#d94515] mx-auto rounded-full"
              animate={{ 
                scaleY: [1, 1.05, 1],
                rotateZ: [-2, 2, -2]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4, 
                ease: "easeInOut",
                delay: 6
              }}
            />
            {/* Bulb */}
            <motion.div 
              className="w-2.5 h-4 bg-gradient-to-b from-[#fe6019] to-[#e55017] border-[2.5px] border-[#d94515] rounded-b-md mx-auto mt-1 shadow-sm"
              animate={{ 
                rotateZ: [-5, 5, -5],
                scale: [1, 1.03, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut",
                delay: 7
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Shadow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="w-20 h-3 bg-[#fe6019] rounded-full mx-auto mt-2 blur-[2px] opacity-20"
      />
    </motion.div>
  );
};

export default HangingCap;
