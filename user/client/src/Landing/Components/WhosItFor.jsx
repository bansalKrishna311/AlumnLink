import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Building2, Target } from 'lucide-react';

const WhosItFor = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const audiences = [
    {
      icon: <GraduationCap size={32} />,
      title: "Alumni",
      description: "Graduates looking to maintain and leverage their professional networks",
      highlight: "Stay connected"
    },
    {
      icon: <Building2 size={32} />,
      title: "Educational Institutes", 
      description: "Universities and colleges wanting to engage their alumni community",
      highlight: "Build community"
    },
    {
      icon: <Users size={32} />,
      title: "Schools",
      description: "Academic institutions seeking to connect students with alumni mentors",
      highlight: "Enable mentorship"
    },
    {
      icon: <Target size={32} />,
      title: "Corporates",
      description: "Companies looking to recruit talent through trusted alumni networks",
      highlight: "Find talent"
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
      className="py-20 bg-gradient-to-br from-[#fe6019]/5 to-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#fe6019] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Right Aligned with Orange Theme */}
        <motion.div 
          className="text-right mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Who's it{" "}
            <span className="text-[#fe6019] relative">
              For?
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
            className="text-xl text-gray-600 max-w-2xl ml-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            AlumnLink serves four key stakeholders in the alumni ecosystem
          </motion.p>
        </motion.div>

        {/* Audiences Grid - Enhanced Design */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
        >
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={itemVariants}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, type: "spring", stiffness: 300 }
              }}
            >
              {/* Card with enhanced styling */}
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 hover:border-[#fe6019]/40 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#fe6019]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with enhanced animations */}
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-[#fe6019]/10 to-[#fe6019]/20 rounded-2xl flex items-center justify-center text-[#fe6019] mx-auto mb-6 group-hover:bg-gradient-to-br group-hover:from-[#fe6019]/20 group-hover:to-[#fe6019]/30 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -3, 3, -3, 3, 0],
                    }}
                    transition={{ 
                      scale: { duration: 0.3 },
                      rotate: { duration: 0.8, ease: "easeInOut" }
                    }}
                    animate={hoveredCard === index ? {
                      y: [-3, 3, -3],
                    } : {}}
                  >
                    <motion.div
                      animate={hoveredCard === index ? {
                        scale: [1, 1.15, 1],
                      } : {}}
                      transition={{ 
                        repeat: hoveredCard === index ? Infinity : 0,
                        duration: 2,
                        ease: "easeInOut"
                      }}
                    >
                      {audience.icon}
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
                    {audience.highlight}
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#fe6019] transition-colors duration-300">
                    {audience.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {audience.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe6019] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhosItFor;
