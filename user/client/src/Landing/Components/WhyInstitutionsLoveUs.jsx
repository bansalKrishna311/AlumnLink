import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Trophy, Heart } from 'lucide-react';

const WhyInstitutionsLoveUs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const benefits = [
    {
      icon: <TrendingUp size={32} />,
      title: "Massive Profit Margins",
      description: "Institutions earn much more than they invest",
      highlight: "High ROI"
    },
    {
      icon: <Award size={32} />,
      title: "Value-Added Service", 
      description: "Alumni networks that truly matter",
      highlight: "Real value"
    },
    {
      icon: <Trophy size={32} />,
      title: "Competitive Advantage",
      description: "Our college has the best alumni network",
      highlight: "Stand out"
    },
    {
      icon: <Heart size={32} />,
      title: "Better Retention",
      description: "Keep alumni loyal and engaged",
      highlight: "Long-term bonds"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  return (
    <motion.section 
      className="py-16 bg-gradient-to-br from-[#fe6019]/5 to-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#fe6019] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Center Aligned */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Why Schools, Corporates &{" "}
            <span className="text-[#fe6019] relative">
              Colleges Love Us
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-[#fe6019]/30 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Results that speak louder than promises - institutions see real impact
          </motion.p>
        </motion.div>

        {/* Benefits Grid - Enhanced Design */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={itemVariants}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
            >
              {/* Card with enhanced styling */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center border border-[#fe6019]/10 hover:border-[#fe6019]/20 hover:bg-white/80 transition-all duration-200 h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#fe6019]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with enhanced animations */}
                  <motion.div
                    className="w-12 h-12 bg-[#fe6019]/10 rounded-lg flex items-center justify-center text-[#fe6019] mx-auto mb-4 group-hover:bg-[#fe6019]/20 transition-colors duration-200"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -3, 3, -3, 3, 0],
                    }}
                    transition={{ 
                      scale: { duration: 0.3 },
                      rotate: { duration: 0.8, ease: "easeInOut" }
                    }}
                    animate={hoveredCard === index ? {
                      y: [-2, 2, -2],
                    } : {}}
                  >
                    <motion.div
                      animate={hoveredCard === index ? {
                        scale: [1, 1.1, 1],
                      } : {}}
                      transition={{ 
                        repeat: hoveredCard === index ? Infinity : 0,
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    >
                      {benefit.icon}
                    </motion.div>
                  </motion.div>
                  
                  {/* Highlight badge */}
                  <motion.div 
                    className="inline-block px-3 py-1 bg-[#fe6019]/10 text-[#fe6019] text-xs font-medium rounded-full mb-3 group-hover:bg-[#fe6019]/20 transition-colors duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    {benefit.highlight}
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#fe6019] transition-colors duration-200">
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyInstitutionsLoveUs;
