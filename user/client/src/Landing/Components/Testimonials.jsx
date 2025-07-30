import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const Testimonials = () => {
  // University theme colors for testimonial cards
  const institutionColors = [
    {
      name: "Regional Engineering College",
      primary: "#fe6019", // AlumnLink primary orange
      secondary: "#ffd9c7", // Light orange variant
      logo: null
    },
    {
      name: "Business Institute of Technology",
      primary: "#ff7a3d", // Slightly lighter orange
      secondary: "#ffe2d3", // Very light orange
      logo: null
    },
    {
      name: "State University",
      primary: "#e85000", // Darker orange
      secondary: "#ffc5a8", // Peachy orange
      logo: null
    },
    {
      name: "Corporate Training Institute",
      primary: "#ff4d00", // Vibrant orange
      secondary: "#ffccb8", // Soft peachy orange
      logo: null
    },
    {
      name: "International School",
      primary: "#ff8c4d", // Light warm orange
      secondary: "#ffede3", // Very light peach
      logo: null
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      quote: "AlumnLink helped us centralize our alumni network for the first time. Our graduates can now easily connect with each other and find mentorship opportunities.",
      name: "Dr. Rajesh Kumar",
      title: "Alumni Relations Head",
      university: "Regional Engineering College",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      stats: { engagement: "60%", retention: "85%", satisfaction: "4.7/5" }
    },
    {
      quote: "The platform made it simple to organize alumni events and track engagement. We've seen significant improvement in alumni participation since implementing AlumnLink.",
      name: "Prof. Priya Sharma",
      title: "Dean of Student Affairs",
      university: "Business Institute of Technology",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      stats: { events: "25", attendees: "800+", growth: "40%" }
    },
    {
      quote: "What impressed us most was how quickly we could get our alumni network up and running. The support team guided us through every step of the setup process.",
      name: "Amit Patel",
      title: "Director of Alumni Services",
      university: "State University",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      stats: { setup: "2 weeks", profiles: "1,200", connections: "300+" }
    }
    
  ];

  const getColorByInstitution = (institutionName) => {
    const institution = institutionColors.find(u => u.name === institutionName);
    return institution || institutionColors[0];
  };

  // Stagger animation for cards
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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.3
      }
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeading
          badge="Client Success"
          badgeColor="orange"
          title="Growing alumni networks across institutions"
          description="See how educational institutions are building stronger alumni communities with AlumnLink's comprehensive platform."
        />
        
        {/* Simple stats */}
        <div className="flex justify-center gap-12 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">40%</div>
            <div className="text-sm text-gray-600">Engagement Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">25+</div>
            <div className="text-sm text-gray-600">Partner Institutions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">89%</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
          </div>
        </div>

        {/* Simplified testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}</div>
                  <div className="text-xs text-[#fe6019] font-medium">{testimonial.university}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            variants={statVariants}
            className="bg-white px-6 py-4 rounded-full shadow-md border border-gray-100 flex items-center gap-3"
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-[#fe6019] flex items-center justify-center text-white text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              +
            </motion.div>
            <span className="font-bold text-gray-800">91% alumni retention</span>
          </motion.div>
          
          <motion.div
            variants={statVariants}
            className="bg-white px-6 py-4 rounded-full shadow-md border border-gray-100 flex items-center gap-3"
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-[#ff7a3d] flex items-center justify-center text-white text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            >
              +
            </motion.div>
            <span className="font-bold text-gray-800">40% engagement increase</span>
          </motion.div>
          
          <motion.div
            variants={statVariants}
            className="bg-white px-6 py-4 rounded-full shadow-md border border-gray-100 flex items-center gap-3"
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-[#e85000] flex items-center justify-center text-white text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              +
            </motion.div>
            <span className="font-bold text-gray-800">25% network growth</span>
          </motion.div>
        </motion.div>

        {/* Main testimonial cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, index) => {
            const institution = getColorByInstitution(testimonial.university);
            
            return (
              <motion.div 
                key={index}
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full"
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Curved accent on top */}
                <div 
                  className="absolute top-0 left-0 right-0 h-24 rounded-b-[50%] opacity-20 -z-0"
                  style={{ background: `linear-gradient(45deg, ${institution.primary}, ${institution.secondary})` }}
                ></div>
                
                {/* Institution logo watermark */}
                <div className="absolute top-6 right-6 w-12 h-12 opacity-20">
                  {institution.logo && (
                    <img 
                      src={institution.logo} 
                      alt={institution.name} 
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-grow relative z-10">
                  {/* Stylized quote mark */}
                  <div 
                    className="text-6xl font-serif absolute -top-2 -left-1 opacity-10"
                    style={{ color: institution.primary }}
                  >
                    "
                  </div>
                  
                  {/* Testimonial quote */}
                  <blockquote className="text-gray-700 leading-relaxed mb-6 relative">
                    {testimonial.quote}
                  </blockquote>
                  
                  {/* Stats cards */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(testimonial.stats).map(([key, value], i) => (
                      <motion.div 
                        key={key}
                        className="text-xs py-1 px-3 rounded-full font-medium"
                        style={{ 
                          background: `${institution.secondary}80`,
                          color: institution.primary 
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i + 0.5 }}
                      >
                        <span className="capitalize">{key}</span>: <span className="font-bold">{value}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Author info */}
                  <div className="mt-auto flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full overflow-hidden border-2 shadow-sm mr-4"
                      style={{ borderColor: institution.primary }}
                    >
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.title}</p>
                      <p 
                        className="text-xs font-medium" 
                        style={{ color: institution.primary }}
                      >
                        {testimonial.university}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Colored border accent at bottom */}
                <div 
                  className="h-1.5 w-full" 
                  style={{ background: `linear-gradient(to right, ${institution.primary}, ${institution.secondary})` }}
                ></div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;