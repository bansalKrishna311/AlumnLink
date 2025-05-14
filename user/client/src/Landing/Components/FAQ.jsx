import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ = ({ 
  faqs, 
  columns = 2 
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={`max-w-4xl mx-auto grid md:grid-cols-${columns} gap-6`}>
      {faqs.map((faq, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.5, 
            delay: 0.1 + (i * 0.1),
            type: "spring",
            stiffness: 50
          }}
          whileHover={{ 
            y: -5,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          }}
          className="bg-white rounded-xl p-6 shadow-sm transition-all cursor-pointer"
          onClick={() => toggleExpand(i)}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h3>
            <motion.div
              animate={{ rotate: expandedIndex === i ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#fe6019] flex-shrink-0 mt-1"
            >
              <ChevronDown size={18} />
            </motion.div>
          </div>
          
          <AnimatePresence>
            {expandedIndex === i && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {faq.answer}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQ;