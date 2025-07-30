import React from 'react';
import { motion } from 'framer-motion';

const WhoWeServe = ({ whoWeServeItems, containerVariants, itemVariants }) => {
  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#fe6019]/10 text-[#fe6019] text-sm font-medium rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Our Focus
          </motion.div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Who We{" "}
            <span className="text-[#fe6019] relative">
              Help
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-[#fe6019]/30 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AlumnLink is designed to support the entire educational ecosystem through specialized solutions.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
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
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm transition-all group hover:border-[#fe6019]/20"
            >
              <div className="bg-[#fe6019]/10 rounded-full p-4 w-fit mb-6 text-[#fe6019] group-hover:bg-[#fe6019] group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WhoWeServe;