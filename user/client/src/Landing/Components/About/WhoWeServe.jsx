import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../SectionHeading';

const WhoWeServe = ({ whoWeServeItems, containerVariants, itemVariants }) => {
  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeading 
          badge="Our Focus"
          badgeColor="orange"
          title="Who We Serve"
          description="AlumnLink is designed to support the entire educational ecosystem through specialized solutions."
        />

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {whoWeServeItems.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm transition-all"
            >
              <div className="bg-[#fe6019]/10 rounded-full p-4 w-fit mb-6 text-[#fe6019]">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WhoWeServe;