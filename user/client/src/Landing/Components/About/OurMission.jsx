import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const OurMission = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              At AlumnLink, we're dedicated to transforming how educational institutions connect with their alumni networks. Our mission is to create a seamless digital ecosystem that fosters meaningful relationships between institutions and their graduates.
            </p>
            <p className="text-lg text-gray-600">
              We believe that strong alumni connections lead to thriving educational communities, enhanced career opportunities for graduates, and sustainable growth for institutions. Through our innovative platform, we're making this vision a reality.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-video bg-gradient-to-br from-[#ffe8de] to-white rounded-xl overflow-hidden shadow-lg border border-orange-100">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fe6019]/20 to-orange-300/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users size={80} className="text-[#fe6019] opacity-80" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OurMission;