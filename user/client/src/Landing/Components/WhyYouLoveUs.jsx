import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, Zap, Users, TrendingUp } from 'lucide-react';

const WhyYouLoveUs = () => {
  const reasons = [
    {
      icon: <Repeat size={28} />,
      title: "Recurring Revenue every semester",
      description: "Predictable income stream that grows with your institution"
    },
    {
      icon: <Zap size={28} />,
      title: "Instant Scalability across multiple schools/institutions",
      description: "Expand to new institutions without technical complexity"
    },
    {
      icon: <Users size={28} />,
      title: "High Retention Value: Institutions and alumni stick for years",
      description: "Long-term partnerships that compound over time"
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Stronger Networks, Greater Value: The more alumni, the better it gets",
      description: "Network effects create exponential value growth"
    }
  ];

  return (
    <motion.section 
      className="py-16 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#fe6019] rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Left Aligned */}
        <motion.div 
          className="text-left mb-12"
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
            Why You'll{" "}
            <span className="text-[#fe6019]">Love Us</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mr-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Built for long-term success with sustainable growth models
          </motion.p>
        </motion.div>

        {/* Reasons in Vertical Timeline Layout */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#fe6019]/30 via-[#fe6019]/50 to-[#fe6019]/30"></div>
          
          {/* Reasons List */}
          <div className="space-y-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="relative flex items-start gap-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                {/* Timeline Node */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    className="w-12 h-12 bg-white border-4 border-[#fe6019] rounded-full flex items-center justify-center text-[#fe6019] shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    {reason.icon}
                  </motion.div>
                </div>

                {/* Content */}
                <motion.div 
                  className="flex-1 bg-gradient-to-r from-[#fe6019]/5 to-transparent rounded-lg p-6 border-l-4 border-[#fe6019]/30"
                  whileHover={{ x: 10, backgroundColor: "rgba(254, 96, 25, 0.08)" }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>

                {/* Number Badge */}
                <motion.div 
                  className="flex-shrink-0 w-8 h-8 bg-[#fe6019] text-white rounded-full flex items-center justify-center text-sm font-bold"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.4, type: "spring" }}
                >
                  {index + 1}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Summary */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#fe6019]/10 rounded-full border border-[#fe6019]/20">
            <div className="w-6 h-6 bg-[#fe6019] rounded-full flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="text-[#fe6019] font-medium text-sm">
              Designed for sustainable, scalable growth
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyYouLoveUs;
