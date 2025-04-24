import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const Testimonials = () => {
  // Testimonial data with enhanced details
  const testimonials = [
    {
      quote: "AlumnLink has transformed how we engage with our alumni. Our engagement rates have increased by 72% in just six months.",
      name: "Dr. Sarah Johnson",
      title: "Alumni Director, Stanford University",
      color: "#8c1515", // Stanford color
      logoColor: "bg-[#8c1515]",
      stats: "72% increase in engagement"
    },
    {
      quote: "The analytics dashboard gives us unprecedented insights into what our alumni care about, allowing us to create more targeted content and events.",
      name: "Michael Chang",
      title: "VP of Alumni Relations, MIT",
      color: "#a31f34", // MIT color
      logoColor: "bg-[#a31f34]",
      stats: "3x better event attendance"
    },
    {
      quote: "We've seen a 40% increase in donations since implementing AlumnLink's fundraising tools. The ROI has been remarkable.",
      name: "Jennifer Martinez",
      title: "Development Officer, Harvard",
      color: "#a51c30", // Harvard color
      logoColor: "bg-[#a51c30]",
      stats: "40% donation increase"
    }
  ];

  // Featured institutions with logos/colors
  const institutions = [
    { name: "Harvard", color: "#a51c30" },
    { name: "Stanford", color: "#8c1515" }, 
    { name: "MIT", color: "#a31f34" },
    { name: "Oxford", color: "#002147" },
    { name: "Cambridge", color: "#a3c1ad" }
  ];

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

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: i => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 8
      }
    }
  };

  return (
    <motion.section 
      className="py-24 overflow-hidden bg-gradient-to-b from-white to-[#fff8f5]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <SectionHeading
          badge="Trusted worldwide"
          badgeColor="yellow"
          title="Loved by alumni offices everywhere"
          description="Join hundreds of educational institutions that use AlumnLink to build stronger alumni communities."
        />

        {/* Featured stats - NEW */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={statsVariants}
              className="bg-white px-6 py-4 rounded-full shadow-md border border-gray-100 flex items-center gap-3"
              style={{ borderTop: `2px solid ${testimonial.color}` }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", 
                borderTopWidth: "3px" 
              }}
            >
              <motion.div 
                className={`w-8 h-8 rounded-full ${testimonial.logoColor} flex items-center justify-center text-white text-xs font-bold`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: i + 1 }}
              >
                {testimonial.name.split(' ')[0][0]}{testimonial.name.split(' ')[1][0]}
              </motion.div>
              <span className="font-bold text-gray-800">{testimonial.stats}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.3 },
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-md relative overflow-hidden"
              style={{ borderTop: `4px solid ${testimonial.color}` }}
            >
              {/* Background decoration */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5"
                style={{ background: testimonial.color }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              />
              
              {/* Quote decorations in top-right */}
              <div className="absolute top-4 right-4 text-[#ffe8de] opacity-70">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11L8 13H11V18H6V13L8 11V7H10V11ZM18 11L16 13H19V18H14V13L16 11V7H18V11Z" fill={testimonial.color} />
                </svg>
              </div>
              
              <motion.p 
                className="text-gray-600 mb-6 relative z-10 text-lg italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + (i * 0.1) }}
              >
                "{testimonial.quote}"
              </motion.p>
              
              <div className="flex items-center">
                <motion.div 
                  className="w-14 h-14 rounded-full mr-4 flex items-center justify-center p-0.5"
                  style={{ background: `linear-gradient(45deg, ${testimonial.color}, #fe6019)` }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.3 + (i * 0.1),
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl font-bold" style={{ color: testimonial.color }}>
                    {testimonial.name.split(' ')[0][0]}{testimonial.name.split(' ')[1][0]}
                  </div>
                </motion.div>
                <div>
                  <motion.div 
                    className="font-semibold text-gray-800"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                  >
                    {testimonial.name}
                  </motion.div>
                  <motion.div 
                    className="text-sm"
                    style={{ color: testimonial.color }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    {testimonial.title}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <motion.div
            className="text-center text-gray-600 mb-8 font-medium text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by leading educational institutions worldwide
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {institutions.map((institution, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={logoVariants}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-16 h-16 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: institution.color }}
                >
                  {institution.name.charAt(0)}
                </div>
                <span className="font-semibold text-gray-700">{institution.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffe8de] rounded-full opacity-50 blur-2xl"></div>
      <div className="absolute top-20 -left-10 w-32 h-32 bg-orange-100 rounded-full opacity-40 blur-xl"></div>
    </motion.section>
  );
};

export default Testimonials;