import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

const PricingTier = ({ 
  tier, 
  index 
}) => {
  // Animation variants
  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const limitationVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay: 0.1 + (index * 0.2),
        type: "spring",
        stiffness: 50
      }}
      whileHover={{ 
        y: -10,
        boxShadow: tier.popular 
          ? "0 25px 50px -12px rgba(254, 96, 25, 0.25)" 
          : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className={`bg-white rounded-xl border ${tier.popular ? 'border-[#fe6019]' : 'border-gray-200'} overflow-hidden ${tier.popular ? 'shadow-xl ring-2 ring-[#fe6019]/20' : 'shadow-sm'} transition-all relative`}
    >
      {tier.popular && (
        <motion.div 
          className="absolute top-0 left-0 w-full bg-[#fe6019] text-white text-center py-1 text-sm font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + (index * 0.2) }}
        >
          Most Popular
        </motion.div>
      )}
      <div className={`p-8 ${tier.popular ? 'pt-10' : ''}`}>
        <motion.h3 
          className="text-xl font-bold mb-1 text-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + (index * 0.2) }}
        >
          {tier.name}
        </motion.h3>
        <motion.p 
          className="text-gray-500 mb-4 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + (index * 0.2) }}
        >
          {tier.description}
        </motion.p>
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            delay: 0.4 + (index * 0.2),
            type: "spring",
            stiffness: 100
          }}
        >
          <span className="text-4xl font-bold text-gray-800">{tier.price}</span>
          {tier.period && <span className="text-gray-500">{tier.period}</span>}
        </motion.div>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + (index * 0.2) }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={tier.name === "Enterprise" ? "/landing/contact" : "/signup"}
            className={`w-full py-3 rounded-lg font-medium text-center block ${tier.popular 
              ? 'bg-[#fe6019] hover:bg-[#fe6019]/90 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} transition-colors flex items-center justify-center gap-2`}
          >
            <span>{tier.cta}</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + (index * 0.2) }}
        >
          <div className="text-sm font-medium text-gray-700">What's included:</div>
          <motion.ul 
            className="space-y-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tier.features.map((feature, j) => (
              <motion.li 
                key={j} 
                className="flex items-start gap-2 text-sm"
                custom={j}
                variants={featureVariants}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + (j * 0.1) }}
                >
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                </motion.div>
                <span className="text-gray-600">{feature}</span>
              </motion.li>
            ))}
          </motion.ul>
          
          {tier.limitations && tier.limitations.length > 0 && (
            <>
              <div className="text-sm font-medium text-gray-700 mt-6">Limitations:</div>
              <motion.ul 
                className="space-y-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {tier.limitations.map((limitation, j) => (
                  <motion.li 
                    key={j} 
                    className="flex items-start gap-2 text-sm"
                    custom={j}
                    variants={limitationVariants}
                  >
                    <X size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-500">{limitation}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PricingTier;