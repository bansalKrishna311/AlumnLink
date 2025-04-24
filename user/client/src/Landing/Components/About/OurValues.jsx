import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import SectionHeading from '../SectionHeading';

const OurValues = ({ ourValues, containerVariants, itemVariants }) => {
  return (
    <div className="py-16 bg-gradient-to-b from-white to-[#ffe8de]/50">
      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeading
          badge="What We Stand For"
          badgeColor="orange"
          title="Our Core Values"
          description="These principles guide everything we do at AlumnLink"
        />

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {ourValues.map((value, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div 
                  className="h-16 w-16 rounded-full bg-[#fe6019]/10 flex items-center justify-center text-[#fe6019]"
                  whileHover={{ 
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <Heart size={32} />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-[#fe6019]">{value.title}</h3>
              <p className="text-gray-600 text-center">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OurValues;