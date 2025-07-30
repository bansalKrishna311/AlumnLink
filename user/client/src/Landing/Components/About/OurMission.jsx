import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';

const OurMission = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16">
        {/* Mission Section */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#fe6019]/10 rounded-xl flex items-center justify-center">
                <Target size={24} className="text-[#fe6019]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Empower alumni communities to unlock lifelong value—professionally, personally, and collectively. AlumnLink is built for meaningful connections, direct opportunities, and giving graduates and institutions the platform they need to thrive together.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-video bg-gradient-to-br from-[#ffe8de] to-white rounded-xl overflow-hidden shadow-xl border border-orange-100">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fe6019]/20 to-orange-300/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target size={80} className="text-[#fe6019] opacity-80" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision Section */}
        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye size={24} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              A world where every graduate, from every institution, can instantly tap into a vibrant alumni network—finding mentors, sharing experiences, discovering opportunities, and never losing touch with their alma mater.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-video bg-gradient-to-br from-blue-50 to-white rounded-xl overflow-hidden shadow-xl border border-blue-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-300/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Eye size={80} className="text-blue-600 opacity-80" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OurMission;