import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Network, Calendar, Briefcase, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';

const HowItWorks = () => {
  // Real alumni experience steps
  const howItWorksSteps = [
    {
      step: 1,
      title: "Connect & Discover",
      description: "Alumni instantly find classmates, professors, and industry peers through intelligent matching. Build meaningful professional relationships that span graduation years and geographic boundaries.",
      icon: <Network size={32} />,
      highlight: "Smart alumni discovery"
    },
    {
      step: 2,
      title: "Engage & Participate",
      description: "Join exclusive events, mentorship programs, and industry discussions. Share knowledge, attend virtual meetups, and participate in career development workshops tailored for your community.",
      icon: <Calendar size={32} />,
      highlight: "Active community engagement"
    },
    {
      step: 3,
      title: "Grow & Give Back",
      description: "Access job opportunities, mentor current students, and contribute to institutional growth. Create lasting impact while advancing your own career through your alumni network.",
      icon: <Briefcase size={32} />,
      highlight: "Mutual career advancement"
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
          badge="How Alumni Connect"
          badgeColor="blue"
          title="From graduation to lifelong relationships"
          description="See how thousands of alumni are building meaningful connections, advancing careers, and giving back to their institutions through AlumnLink's intelligent networking platform."
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
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col relative overflow-hidden"
                whileHover={{ 
                  boxShadow: "0 20px 40px -12px rgba(254, 96, 25, 0.15)",
                  y: -5
                }}
              >
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div className="w-full h-full bg-gradient-to-br from-[#fe6019] to-orange-400 rounded-full transform translate-x-16 -translate-y-16"></div>
                </div>
                
                <motion.div 
                  className="bg-gradient-to-br from-[#fe6019]/10 to-orange-100/50 text-[#fe6019] w-18 h-18 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.6 }
                  }}
                >
                  {step.icon}
                </motion.div>
                
                <motion.div 
                  className="absolute top-6 right-6 w-10 h-10 bg-gradient-to-r from-[#fe6019] to-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    delay: 0.3 + (i * 0.15) 
                  }}
                >
                  {step.step}
                </motion.div>
                
                <motion.div 
                  className="inline-flex items-center gap-2 bg-[#fe6019]/5 text-[#fe6019] px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (i * 0.15) }}
                >
                  <MessageSquare size={12} />
                  {step.highlight}
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mb-4 text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.15) }}
                >
                  {step.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 flex-grow leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + (i * 0.15) }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
              
              {i < 2 && (
                <motion.div 
                  className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-lg border border-gray-100"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + (i * 0.2), type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    animate={{ 
                      x: [0, 5, 0],
                      transition: { 
                        repeat: Infinity, 
                        duration: 2,
                        ease: "easeInOut",
                        delay: 1 + (i * 0.5)
                      }
                    }}
                  >
                    <ArrowRight className="text-[#fe6019]" size={20} />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Call-to-Action */}
        <motion.div 
          className="text-center bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to transform your alumni engagement?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join institutions who trust AlumnLink to power their alumni communities. 
              See how authentic connections drive real results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/Landing/contact"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#fe6019] to-orange-500 hover:from-[#e55017] hover:to-orange-600 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  See AlumnLink in Action
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/landing/about"
                  className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-4 px-8 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  Learn About Features
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;