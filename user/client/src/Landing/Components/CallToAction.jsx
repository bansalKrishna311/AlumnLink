import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  gradient = true,
  className = "",
}) => {
  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
              {title}
              <span className="bg-gradient-to-r from-[#fe6019] to-orange-600 bg-clip-text text-transparent ml-2">.</span>
            </h2>
            <p className="text-xl mb-10 text-gray-600">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryButtonText && (
                <Link
                  to={primaryButtonLink || "/signup"}
                  className="relative group px-8 py-4 bg-[#fe6019] hover:bg-[#fe6019]/90 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#fe6019]/20 transform hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10">{primaryButtonText}</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#fe6019] to-orange-500 group-hover:scale-105 transition-transform duration-300"></div>
                </Link>
              )}
              
              {secondaryButtonText && (
                <Link
                  to={secondaryButtonLink || "/landing/contact"}
                  className="px-8 py-4 border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-xl hover:bg-white hover:border-gray-400 hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
            <p className="mt-6 text-gray-500 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;