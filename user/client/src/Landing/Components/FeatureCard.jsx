import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

// Animation variants for cards to be used consistently
export const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5, 
      delay: 0.1 + (index * 0.1)
    }
  })
};

const FeatureCard = ({ 
  index = 0,
  icon,
  title,
  description,
  features = [],
  limitations = [],
  isPopular = false,
  className = "",
  hoverEffect = true,
  iconBackground = "bg-[#fe6019]/10 text-[#fe6019]",
  children
}) => {
  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${hoverEffect ? 'hover:shadow-md transition-all hover:-translate-y-1' : ''} ${isPopular ? 'border-[#fe6019] shadow-xl ring-2 ring-[#fe6019]/20' : ''} ${className}`}
    >
      {icon && (
        <div className={`${iconBackground} w-12 h-12 rounded-lg flex items-center justify-center mb-5`}>
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      {description && <p className="text-gray-600 mb-5">{description}</p>}
      
      {features.length > 0 && (
        <div className="space-y-2 mb-5">
          {features.length > 0 && <div className="text-sm font-medium text-gray-700 mb-2">What's included:</div>}
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {limitations.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Limitations:</div>
          <ul className="space-y-2">
            {limitations.map((limitation, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <X size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-500">{limitation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {children}
    </motion.div>
  );
};

export default FeatureCard;