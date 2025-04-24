import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';

const PricingTier = ({ 
  tier, 
  index 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
      className={`bg-white rounded-xl border ${tier.popular ? 'border-[#fe6019]' : 'border-gray-200'} overflow-hidden ${tier.popular ? 'shadow-xl ring-2 ring-[#fe6019]/20' : 'shadow-sm hover:shadow-md'} transition-all relative`}
    >
      {tier.popular && (
        <div className="absolute top-0 left-0 w-full bg-[#fe6019] text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className={`p-8 ${tier.popular ? 'pt-10' : ''}`}>
        <h3 className="text-xl font-bold mb-1 text-gray-800">{tier.name}</h3>
        <p className="text-gray-500 mb-4 text-sm">{tier.description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-800">{tier.price}</span>
          {tier.period && <span className="text-gray-500">{tier.period}</span>}
        </div>
        
        <div className="mb-6">
          <Link
            to={tier.name === "Enterprise" ? "/landing/contact" : "/signup"}
            className={`w-full py-3 rounded-lg font-medium text-center block ${tier.popular 
              ? 'bg-[#fe6019] hover:bg-[#fe6019]/90 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} transition-colors`}
          >
            {tier.cta}
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">What's included:</div>
          <ul className="space-y-2">
            {tier.features.map((feature, j) => (
              <li key={j} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          
          {tier.limitations && tier.limitations.length > 0 && (
            <>
              <div className="text-sm font-medium text-gray-700 mt-6">Limitations:</div>
              <ul className="space-y-2">
                {tier.limitations.map((limitation, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <X size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PricingTier;