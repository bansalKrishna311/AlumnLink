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
    <section className={`py-20 ${gradient ? 'bg-gradient-to-br from-[#fe6019] to-orange-600 text-white relative overflow-hidden' : 'bg-gray-50'} ${className}`}>
      {gradient && (
        <>
          <div className="absolute inset-0 bg-[url('/background.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl opacity-40"></div>
        </>
      )}
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${!gradient && 'text-gray-800'}`}>{title}</h2>
            <p className={`text-xl mb-10 ${gradient ? 'text-white/90' : 'text-gray-600'}`}>
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryButtonText && (
                <Link
                  to={primaryButtonLink || "/signup"}
                  className={`px-8 py-4 ${gradient ? 
                    'bg-white text-[#fe6019]' : 
                    'bg-[#fe6019] text-white hover:bg-[#fe6019]/90'} 
                    font-bold rounded-xl transition-all flex items-center justify-center gap-2 
                    shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg`}
                >
                  {primaryButtonText}
                  <ArrowRight size={20} />
                </Link>
              )}
              
              {secondaryButtonText && (
                <Link
                  to={secondaryButtonLink || "/landing/contact"}
                  className={`px-8 py-4 ${gradient ? 
                    'bg-[#fe6019]/20 backdrop-blur-sm border border-white/30 text-white hover:bg-[#fe6019]/30' : 
                    'border border-[#fe6019] text-[#fe6019] hover:bg-[#fe6019]/5'} 
                    font-medium rounded-xl transition-all flex items-center justify-center gap-2`}
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
            {gradient && <p className="mt-6 text-white/80 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;