import React from 'react';
import { motion } from 'framer-motion';

const FAQ = ({ 
  faqs, 
  columns = 2 
}) => {
  return (
    <div className={`max-w-4xl mx-auto grid md:grid-cols-${columns} gap-6`}>
      {faqs.map((faq, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + (i * 0.1) }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-800">{faq.question}</h3>
          <p className="text-gray-600">{faq.answer}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQ;