import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, TrendingUp, Zap } from 'lucide-react';

const AlumnLinkDifference = () => {
  const differences = [
    {
      icon: <Wrench size={32} />,
      title: "Purpose-Built",
      description: "Not just another platform—our features are designed from the ground up for alumni and institutions.",
      color: "from-blue-500/20 to-blue-300/20",
      iconColor: "text-blue-600"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Win-Win Model", 
      description: "Alumni get value. Institutions gain engagement and profit. Everyone benefits from stronger connections.",
      color: "from-green-500/20 to-green-300/20",
      iconColor: "text-green-600"
    },
    {
      icon: <Zap size={32} />,
      title: "Effortless Tech",
      description: "Easy to use. Easy to scale. You focus on growth—we handle the rest. No technical headaches.",
      color: "from-[#fe6019]/20 to-orange-300/20",
      iconColor: "text-[#fe6019]"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl w-11/12 mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            The{" "}
            <span className="text-[#fe6019] relative">
              AlumnLink Difference
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-[#fe6019]/30 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            What sets us apart from generic networking platforms and makes us the obvious choice for alumni communities.
          </p>
        </motion.div>

        {/* Differences Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {differences.map((diff, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${diff.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center ${diff.iconColor} group-hover:bg-white/80 transition-all duration-300 mb-6`}>
                    {diff.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {diff.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {diff.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
     
      </div>
    </div>
  );
};

export default AlumnLinkDifference;
