import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Zap, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const ObviousChoice = () => {
  const [hoveredReason, setHoveredReason] = useState(null);

  const reasons = [
    {
      icon: <AlertTriangle size={28} />,
      title: "Fear of Missing Out (FOMO)",
      subtitle: "Don't Get Left Behind",
      description: "Other colleges are already building smarter alumni communities. While you wait, they're creating stronger networks, better opportunities, and deeper institutional loyalty.",
      urgency: "Act Now",
      color: "from-red-500/20 to-orange-500/20",
      iconColor: "text-red-600"
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Clear ROI",
      subtitle: "Make Money While Adding Value",
      description: "Institutions make money while offering genuine value to alumni. Our pricing model ensures you profit from every semester while building meaningful connections.",
      urgency: "Profitable",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-600"
    },
    {
      icon: <Zap size={28} />,
      title: "Effortless Tech",
      subtitle: "Zero Hassle Implementation",
      description: "We handle everything; institutions simply benefit. No technical team needed, no maintenance headaches, no complex setup. Just results.",
      urgency: "Plug & Play",
      color: "from-blue-500/20 to-purple-500/20",
      iconColor: "text-blue-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
        stiffness: 120,
        damping: 15,
        duration: 0.6
      }
    }
  };

  return (
    <motion.section 
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-[#fe6019]/5 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-[#fe6019]/20 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Right Aligned */}
        <motion.div 
          className="text-right mb-16"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#fe6019]/10 text-[#fe6019] text-sm font-medium rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Clock size={16} />
            Decision Time
          </motion.div>
          
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            What Makes AlumnLink{" "}
            <span className="text-[#fe6019] relative">
              the Obvious Choice?
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#fe6019] to-orange-400 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl ml-auto leading-relaxed"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Three compelling reasons why forward-thinking institutions choose AlumnLink
          </motion.p>
        </motion.div>

        {/* Reasons Grid - Asymmetric Layout */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className={`relative group cursor-pointer transform-gpu ${
                index === 1 ? 'md:mt-8' : index === 2 ? 'md:mt-4' : ''
              }`}
              variants={itemVariants}
              onMouseEnter={() => setHoveredReason(index)}
              onMouseLeave={() => setHoveredReason(null)}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              {/* Main Card */}
              <div className={`relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 ${
                hoveredReason === index ? 'shadow-2xl border-[#fe6019]/20' : ''
              }`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon & Urgency Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center ${reason.iconColor} group-hover:bg-white/80 transition-colors duration-300`}>
                      {reason.icon}
                    </div>
                    <motion.span 
                      className="px-3 py-1 bg-[#fe6019] text-white text-xs font-semibold rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    >
                      {reason.urgency}
                    </motion.span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                      {reason.title}
                    </h3>
                    <p className="text-sm font-medium text-[#fe6019] uppercase tracking-wider">
                      {reason.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {reason.description}
                  </p>

                  {/* Action Indicator */}
                  <motion.div 
                    className="flex items-center gap-2 text-[#fe6019] font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  >
                    <CheckCircle size={16} />
                    <span className="text-sm">Smart Choice</span>
                    <motion.div
                      className="ml-2"
                      animate={{ x: hoveredReason === index ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Hover Effect Border */}
                <motion.div
                  className="absolute inset-0 border-2 border-[#fe6019] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </div>

              {/* Floating Element */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-[#fe6019] rounded-full opacity-0 group-hover:opacity-100"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: hoveredReason === index ? 1 : 0,
                  rotate: hoveredReason === index ? 360 : 0
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#fe6019] to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>The choice is obvious</span>
            <ArrowRight size={20} />
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.section>
  );
};

export default ObviousChoice;
