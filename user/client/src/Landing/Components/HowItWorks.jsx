import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BarChart2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';

const HowItWorks = () => {
  // How it works steps data
  const howItWorksSteps = [
    {
      step: 1,
      title: "Set up your institution",
      description: "Configure your branding, import alumni data, and customize your community portal to match your institution's identity.",
      icon: <Users size={32} />
    },
    {
      step: 2,
      title: "Engage your alumni",
      description: "Launch discussions, create events, share job opportunities, and send personalized communications to drive engagement.",
      icon: <BarChart2 size={32} />
    },
    {
      step: 3,
      title: "Grow your network",
      description: "Analyze engagement data, optimize your approach, and continuously expand your alumni community's reach and impact.",
      icon: <Award size={32} />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
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
    hover: {
      scale: 1.15,
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  const arrowVariants = {
    initial: { x: 0 },
    animate: {
      x: [0, 10, 0],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section 
      className="py-24 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <SectionHeading
          badge="How It Works"
          badgeColor="blue"
          title="Build stronger alumni bonds in three easy steps"
          description="AlumnLink makes it simple to launch, grow, and manage your alumni community with powerful tools designed specifically for educational institutions."
        />

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {howItWorksSteps.map((step, i) => (
            <motion.div 
              key={i} 
              className="relative"
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all h-full flex flex-col"
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(254, 96, 25, 0.1), 0 8px 10px -6px rgba(254, 96, 25, 0.1)" }}
              >
                <motion.div 
                  className="bg-gradient-to-br from-[#fff8f5] to-[#ffe8de] text-[#fe6019] w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  whileHover={iconVariants.hover}
                >
                  {step.icon}
                </motion.div>
                <motion.div 
                  className="absolute top-8 right-8 size-8 bg-gradient-to-r from-[#fe6019] to-orange-500 text-white rounded-full flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    delay: 0.2 + (i * 0.1) 
                  }}
                >
                  {step.step}
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold mb-4 text-gray-800"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                >
                  {step.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 flex-grow"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
              
              {i < 2 && (
                <motion.div 
                  className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                  variants={arrowVariants}
                  initial="initial"
                  animate="animate"
                >
                  <ArrowRight className="text-[#fe6019]" size={24} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/landing/about"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fe6019]/10 to-orange-100 hover:from-[#fe6019]/20 hover:to-orange-200 transition-colors text-gray-800 py-3 px-6 rounded-lg font-medium"
            >
              Learn more about our platform
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;