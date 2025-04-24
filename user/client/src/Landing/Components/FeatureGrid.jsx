import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MessageCircle, Briefcase, BarChart2, Shield } from 'lucide-react';
import SectionHeading from './SectionHeading';

const FeatureGrid = () => {
  // Features data
  const features = [
    {
      title: "Alumni Directory",
      description: "Searchable database with filters for graduation year, course, location, and industry",
      icon: <Users className="text-[#fe6019]" size={24} />,
      included: [
        "Custom profile fields",
        "Privacy controls",
        "Export options"
      ]
    },
    {
      title: "Events Management",
      description: "Create, promote and manage virtual and in-person alumni gatherings",
      icon: <Calendar className="text-[#fe6019]" size={24} />,
      included: [
        "Registration & ticketing",
        "Calendar integration",
        "Automated reminders"
      ]
    },
    {
      title: "Discussion Forums",
      description: "Topic-based forums for alumni to share insights, questions and opportunities",
      icon: <MessageCircle className="text-[#fe6019]" size={24} />,
      included: [
        "Moderation tools",
        "Rich media support",
        "Email notifications"
      ]
    },
    {
      title: "Career Center",
      description: "Exclusive job board connecting alumni with relevant opportunities",
      icon: <Briefcase className="text-[#fe6019]" size={24} />,
      included: [
        "Application tracking",
        "Job notifications",
        "Employer dashboards"
      ]
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive metrics to track engagement and platform growth",
      icon: <BarChart2 className="text-[#fe6019]" size={24} />,
      included: [
        "Custom reports",
        "Engagement scoring",
        "Data visualization"
      ]
    },
    {
      title: "Privacy Controls",
      description: "Advanced security features to protect alumni data and communications",
      icon: <Shield className="text-[#fe6019]" size={24} />,
      included: [
        "Role-based access",
        "GDPR compliance",
        "Data encryption"
      ]
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const checkListVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.3
      }
    })
  };
  
  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    hover: {
      scale: 1.1,
      rotate: 10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <motion.section 
      className="py-24 overflow-hidden bg-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <SectionHeading
          badge="All-in-one platform"
          badgeColor="orange"
          title="Everything you need to manage your alumni network"
          description="Stop juggling multiple tools. AlumnLink provides all the features you need to build, engage and grow your alumni community in one powerful platform."
        />

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm"
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <motion.div
                className="bg-[#fff8f5] p-3 rounded-lg inline-block mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                {feature.icon}
              </motion.div>

              <motion.h3 
                className="text-lg font-semibold mb-2 text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
              >
                {feature.title}
              </motion.h3>
              
              <motion.p 
                className="text-sm text-gray-600 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + (i * 0.05) }}
              >
                {feature.description}
              </motion.p>

              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 mb-2">What's included:</div>
                <motion.ul initial="hidden" animate="visible">
                  {feature.included.map((item, j) => (
                    <motion.li 
                      key={j} 
                      className="flex items-center gap-2 text-sm py-1"
                      custom={j}
                      variants={checkListVariants}
                      whileHover={{ x: 5 }}
                    >
                      <svg className="text-green-500 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeatureGrid;