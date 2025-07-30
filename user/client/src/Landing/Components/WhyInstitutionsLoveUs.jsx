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

        {/* Benefits in Split Layout - NO MORE CARDS! */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Benefits List */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-[#fe6019]/10 hover:border-[#fe6019]/20 hover:bg-white/80 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#fe6019]/10 rounded-lg flex items-center justify-center text-[#fe6019]">
                    {React.cloneElement(benefit.icon, { size: 24 })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                    <span className="px-2 py-1 bg-[#fe6019]/10 text-[#fe6019] text-xs font-medium rounded-full">
                      {benefit.highlight}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Testimonial Style Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Success Promise */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#fe6019]/20">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#fe6019]/20 to-[#fe6019]/30 rounded-full flex items-center justify-center text-[#fe6019] font-bold text-xl">
                  ₹
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Built for Profitability</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Designed to deliver measurable returns through improved alumni engagement. Our pricing model ensures institutions invest wisely.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Highlight */}
            <div className="bg-gradient-to-br from-[#fe6019]/5 to-transparent rounded-xl p-6 border border-[#fe6019]/10">
              <div className="flex items-center gap-3 mb-4">
                <Trophy size={20} className="text-[#fe6019]" />
                <h4 className="text-lg font-semibold text-gray-900">Purpose-Built Solution</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Specifically designed for Indian educational institutions to create meaningful alumni connections and unlock opportunities.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Alumni Networking', 'Career Opportunities', 'Institutional Growth'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-[#fe6019]/10 text-[#fe6019] text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            {/* <motion.div 
              className="bg-[#fe6019]/10 rounded-xl p-6 text-center border border-[#fe6019]/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Be among the first institutions</h4>
              <p className="text-gray-600 text-sm mb-4">Get early access and help shape the future of alumni networking in India</p>
              <motion.button 
                className="px-6 py-2 bg-[#fe6019] text-white font-medium rounded-lg hover:bg-[#fe6019]/90 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request Early Access
              </motion.button>
            </motion.div> */}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default WhyInstitutionsLoveUs;
