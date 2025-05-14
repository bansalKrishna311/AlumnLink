import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Calendar, MessageSquare, Award, BarChart } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 50,
      damping: 10
    }
  }
};

// Feature card component with animations
const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }) => (
  <motion.div
    className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 relative overflow-hidden"
    variants={itemVariants}
    whileHover={{ 
      y: -10,
      transition: { duration: 0.3 },
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Background gradient */}
    <motion.div 
      className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10"
      style={{ background: color }}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 10, 0],
      }}
      transition={{ duration: 10, repeat: Infinity, delay }}
    ></motion.div>
    
    {/* Icon */}
    <motion.div 
      className="rounded-lg p-3 w-14 h-14 flex items-center justify-center mb-4"
      style={{ background: `${color}15`, color: color }}
      whileHover={{ 
        rotate: [0, -10, 10, -5, 0],
        transition: { duration: 0.5 }
      }}
    >
      <Icon size={24} />
    </motion.div>
    
    {/* Content */}
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
    
    {/* Call to action link */}
    <motion.div 
      className="mt-4 flex items-center text-sm font-medium"
      style={{ color }}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      Learn more 
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </motion.div>
  </motion.div>
);

const Features = () => {
  // Features data
  const features = [
    {
      icon: Users,
      title: "Alumni Directory",
      description: "A comprehensive database of all alumni with powerful search and filter capabilities.",
      color: "#4F46E5" // Indigo
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Create and manage alumni events, track attendance, and collect feedback effortlessly.",
      color: "#EC4899" // Pink
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Direct messaging, group discussions, and announcement broadcasts in one place.",
      color: "#10B981" // Emerald
    },
    {
      icon: Award,
      title: "Mentorship Program",
      description: "Connect current students with alumni mentors through a structured program interface.",
      color: "#F59E0B" // Amber
    },
    {
      icon: BarChart,
      title: "Analytics Dashboard",
      description: "Track engagement metrics, event participation, and overall alumni activity.",
      color: "#8B5CF6" // Violet
    },
    {
      icon: CheckCircle,
      title: "Job Board",
      description: "Exclusive job postings and career opportunities shared within the alumni network.",
      color: "#3B82F6" // Blue
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-[#fe6019]/10 text-[#fe6019] mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="h-2 w-2 rounded-full bg-[#fe6019] mr-2"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            ></motion.span>
            Powerful Features
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to manage your alumni community</h2>
          <p className="text-xl text-gray-600">A comprehensive platform with all the tools educational institutions need to build and maintain strong alumni relationships.</p>
        </motion.div>
        
        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              color={feature.color}
              delay={index * 2}
            />
          ))}
        </motion.div>
        
        {/* Call to action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button 
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-black text-white font-medium py-3 px-8 rounded-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Explore All Features</span>
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.button>
          
          <motion.div 
            className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fe6019]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>No credit card required to start</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;