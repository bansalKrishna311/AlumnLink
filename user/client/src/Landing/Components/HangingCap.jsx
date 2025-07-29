import React from 'react';
import { motion } from 'framer-motion';

const HangingCap = () => {
  return (
    <div className="absolute top-12 right-20 hidden lg:block">
      {/* Enhanced Hanging Rope */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: '250px', opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mx-auto"
      >
        {/* Main rope strand */}
        <div className="w-1 h-full bg-gradient-to-b from-amber-800 via-amber-700 to-amber-600 mx-auto rounded-full shadow-sm"></div>
      </motion.div>

      {/* Cap */}
      <motion.div
        initial={{ y: -80, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.5 }}
        className="relative -mt-2"
      >
        <div className="relative w-[100px] h-[64px] mx-auto">

          {/* Top Board */}
          <div
            className="absolute top-0 left-0 w-full h-[22px]"
            style={{
              background: 'linear-gradient(to right, #fe6019, #e55017)',
              clipPath: 'polygon(0% 100%, 10% 0%, 90% 0%, 100% 100%)',
              border: '2.5px solid #d94515',
              borderBottom: 'none',
              zIndex: 10,
              borderRadius: '1px',
            }}
          />

          {/* Cap Base */}
          <div
            className="absolute top-[16px] left-[12px] w-[76px] h-[34px]"
            style={{
              background: 'linear-gradient(to bottom, #fe6019, #e55017)',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
              border: '2.5px solid #d94515',
              borderTop: 'none',
              zIndex: 5,
            }}
          />

          {/* Tassel */}
          <motion.div
            animate={{ rotate: [0, 4, -4, 4, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-[-2px] left-[8px] z-20"
          >
            {/* String */}
            <div className="w-0.5 h-[36px] bg-[#d94515] mx-auto rounded-full" />
            {/* Bulb */}
            <div className="w-2.5 h-4 bg-gradient-to-b from-[#fe6019] to-[#e55017] border-[2.5px] border-[#d94515] rounded-b-md mx-auto mt-1 shadow-sm" />
          </motion.div>
        </div>
      </motion.div>

      {/* Shadow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="w-20 h-3 bg-[#fe6019] rounded-full mx-auto mt-2 blur-[2px] opacity-20"
      />
    </div>
  );
};

export default HangingCap;
