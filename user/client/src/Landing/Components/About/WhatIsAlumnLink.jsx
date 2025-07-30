import React from 'react';
import { motion } from 'framer-motion';
import { Network, Users2, Briefcase, MessageCircle } from 'lucide-react';

const WhatIsAlumnLink = () => {
  const features = [
    {
      icon: <Network size={24} />,
      title: "Alumni-Specific Platform",
      description: "Purpose-built for alumni communities, not generic social networking"
    },
    {
      icon: <Users2 size={24} />,
      title: "Reconnect & Expand",
      description: "Find classmates, build professional networks, and stay connected"
    },
    {
      icon: <Briefcase size={24} />,
      title: "Career Growth",
      description: "Access mentors, job opportunities, and professional guidance"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Knowledge Exchange",
      description: "Share experiences and get real-world advice from fellow alumni"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
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
            What Is{" "}
            <span className="text-[#fe6019] relative">
              AlumnLink?
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-[#fe6019]/30 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              AlumnLink is the first social networking platform tailored specifically for alumni communities. 
              Forget generic social networks—this is your trusted space to reconnect, share knowledge, expand your career, and strengthen alumni ties.
            </p>
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#fe6019]/10 rounded-full">
              <span className="text-lg font-semibold text-gray-700">Think:</span>
              <span className="text-lg text-[#fe6019] font-medium">LinkedIn meets Facebook</span>
              <span className="text-lg font-semibold text-gray-700">exclusively for alumni</span>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:border-[#fe6019]/20">
                <div className="w-16 h-16 bg-[#fe6019]/10 rounded-2xl flex items-center justify-center text-[#fe6019] mb-6 group-hover:bg-[#fe6019] group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why We Exist Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-white rounded-3xl p-12 shadow-xl border border-gray-100"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why We Exist</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Lost Connections",
                description: "Many alumni lose touch after graduation. AlumnLink bridges that gap, letting you reconnect easily, anytime."
              },
              {
                title: "Career Growth", 
                description: "Find mentors and job opportunities right within your alumni community."
              },
              {
                title: "Knowledge Exchange",
                description: "Experienced alumni help guide and inspire new graduates—giving real-world advice and support."
              },
              {
                title: "Community Power",
                description: "We believe a strong alumni network transforms both the individual and the institution."
              }
            ].map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-3 h-3 bg-[#fe6019] rounded-full mx-auto mb-4"></div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{reason.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhatIsAlumnLink;
