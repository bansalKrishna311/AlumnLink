import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ 
  badge,
  badgeColor = "blue",
  title, 
  description,
  centered = true,
  delay = 0 
}) => {
  // Determine badge background color based on color prop
  const getBadgeBgColor = () => {
    switch (badgeColor) {
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'green': return 'bg-green-50 text-green-600';
      case 'purple': return 'bg-purple-50 text-purple-600';
      case 'yellow': return 'bg-yellow-50 text-yellow-600';
      case 'gray': return 'bg-gray-100 text-gray-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay }}
      className={`${centered ? 'text-center' : ''} max-w-4xl ${centered ? 'mx-auto' : ''} mb-16`}
    >
      {badge && (
        <motion.div 
          className={`inline-flex items-center gap-2 ${getBadgeBgColor()} py-1.5 px-4 rounded-full mb-4`}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
        >
          <span className="text-sm font-medium">{badge}</span>
        </motion.div>
      )}
      <motion.h2 
        className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p 
          className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;