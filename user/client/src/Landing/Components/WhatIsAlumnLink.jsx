
import React from 'react';
import { motion } from 'framer-motion';
import { Network, Users, Briefcase, GraduationCap, Shield, Zap } from 'lucide-react';

const WhatIsAlumnLink = () => {
  const features = [
    {
      icon: <Network size={24} />,
      title: "Professional Networking",
      description: "Connect with alumni across industries and graduation years"
    },
    {
      icon: <Users size={24} />,
      title: "Mentorship Programs", 
      description: "Foster meaningful mentor-mentee relationships"
    },
    {
      icon: <Briefcase size={24} />,
      title: "Career Opportunities",
      description: "Unlock exclusive job postings and business partnerships"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <motion.section 
      className="py-16 bg-white relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header with Question Mark Image */}
        <motion.div 
          className="mb-12 grid lg:grid-cols-12 gap-8 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Content - Left Side */}
          <div className="lg:col-span-8">
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              What is AlumnLink?
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              AlumnLink is a modern networking platform, think{" "}
              <span className="font-medium text-blue-600">LinkedIn</span> meets{" "}
              <span className="font-medium text-blue-500">Facebook</span>, but built exclusively for alumni communities. 
              We help educational institutions reconnect their graduates, foster meaningful mentorships, and unlock career opportunities through one secure, easy to use platform.
            </motion.p>
          </div>

          {/* Question Mark Image - Right Side */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <motion.div
              className="relative w-40 h-40 lg:w-48 lg:h-48"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <motion.img
                src="/quesmark.png"
                alt="Question mark illustration"
                className="w-full h-full object-contain drop-shadow-lg"
                animate={{ 
                  y: [-3, 3, -3],
                  rotate: [-2, 2, -2]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#fe6019]/10 via-transparent to-[#fe6019]/10 rounded-full blur-xl scale-110" />
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid - Simplified */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-200"
              variants={itemVariants}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
            >
              <div className="w-12 h-12 bg-[#fe6019]/10 rounded-lg flex items-center justify-center text-[#fe6019] mb-4">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Simple Benefits List */}
        <motion.div 
          className="bg-gray-50 rounded-xl p-8 border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Why Choose AlumnLink
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield size={18} />, text: "Secure alumni-only environment" },
              { icon: <Zap size={18} />, text: "Easy connections across graduation years" },
              { icon: <Network size={18} />, text: "Built specifically for institutions" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.4 }}
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#fe6019] flex-shrink-0">
                  {benefit.icon}
                </div>
                <span className="text-gray-700 text-sm font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhatIsAlumnLink;
