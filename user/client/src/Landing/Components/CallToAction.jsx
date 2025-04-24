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
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <motion.section 
      className={`py-20 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 text-gray-800"
            variants={itemVariants}
          >
            {title}
            <motion.span 
              className="bg-gradient-to-r from-[#fe6019] to-orange-600 bg-clip-text text-transparent ml-2"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3 
              }}
            >
              .
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-10 text-gray-600"
            variants={itemVariants}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            {primaryButtonText && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={primaryButtonLink || "/signup"}
                  className="relative group px-8 py-4 bg-[#fe6019] hover:bg-[#fe6019]/90 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#fe6019]/20 transform hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10">{primaryButtonText}</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      repeatDelay: 0.5 
                    }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#fe6019] to-orange-500 group-hover:scale-105 transition-transform duration-300"
                    animate={{ 
                      background: [
                        'linear-gradient(to right, #fe6019, #f97316)',
                        'linear-gradient(to right, #f97316, #fe6019)',
                        'linear-gradient(to right, #fe6019, #f97316)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  ></motion.div>
                </Link>
              </motion.div>
            )}
            
            {secondaryButtonText && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={secondaryButtonLink || "/landing/contact"}
                  className="px-8 py-4 border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-xl hover:bg-white hover:border-gray-400 hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {secondaryButtonText}
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      repeatDelay: 1 
                    }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </motion.div>
          
          <motion.p 
            className="mt-6 text-gray-500 text-sm"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-10 -right-10 size-64 bg-[#fe6019]/5 rounded-full blur-3xl -z-10"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div 
          className="absolute -bottom-40 -left-20 size-80 bg-orange-100/30 rounded-full blur-3xl -z-10"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        ></motion.div>
      </div>
    </motion.section>
  );
};

export default CallToAction;