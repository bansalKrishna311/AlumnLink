import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Building2, School } from 'lucide-react';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 10
    }
  }
};

const statVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: i => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 8,
      delay: 0.5 + (i * 0.1)
    }
  })
};

// Reusable component for hero banner with clean design
const HeroSection = ({ children }) => (
  <div className="relative bg-gradient-to-b from-gray-50 to-white h-screen">
    {/* Subtle background accent */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-b from-[#fe6019]/5 to-transparent"></div>
    
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 h-full flex items-center justify-center">
      {children}
    </div>
  </div>
);

// Main Hero component
const Hero = () => {

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <HeroSection>
        {/* Hero content - now in top-bottom layout */}
        <div className="flex flex-col items-center text-center w-full h-full justify-between py-20">
          {/* Top badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white border border-gray-200 py-2 px-4 rounded-full shadow-sm"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="h-2 w-2 rounded-full bg-[#fe6019]"></span>
            <span className="text-sm font-medium text-gray-600">Enterprise Alumni Networking Platform</span>
          </motion.div>

          {/* Main content - centered */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900"
              variants={itemVariants}
            >
              Finally, An Alumni Network That{" "} 
              <span className="text-[#fe6019]">Actually Works</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Help your graduates stay connected, share knowledge, and support each other's growth. A platform that brings your alumni community together in meaningful ways.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center"
              variants={itemVariants}
            >
              <Link
                to="/login"
                className="px-6 py-3 bg-[#fe6019] hover:bg-[#e55017] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Request Demo
                <ArrowRight size={16} />
              </Link>
              
              <Link
                to="/landing/about"
                className="px-6 py-3 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Learn More
                <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-3 justify-center"
              variants={itemVariants}
            >
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <GraduationCap size={14} />
                For Institutes
              </button>
              
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <Building2 size={14} />
                For Corporates
              </button>
              
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <School size={14} />
                For Schools
              </button>
            </motion.div>
          </motion.div>

          {/* Bottom section */}
          <motion.div
            className=""
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm text-gray-500 mb-3">
              Powering alumni networks for institutions across India
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['Engineering Colleges', 'Business Schools', 'Universities', 'Corporates', 'K-12 Schools'].map((type, i) => (
                <div 
                  key={i} 
                  className="text-gray-400 font-medium text-sm"
                >
                  {type}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </HeroSection>
    </div>
  );
};

export default Hero;