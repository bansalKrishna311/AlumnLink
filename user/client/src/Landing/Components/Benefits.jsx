import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Lock, LifeBuoy } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Benefits = () => {
  // Benefits data
  const benefits = [
    {
      title: "Save time and resources",
      description: "Automate repetitive tasks and streamline alumni management with purpose-built tools.",
      icon: <Clock className="text-[#fe6019]" />
    },
    {
      title: "Increase engagement rates",
      description: "Drive more meaningful interactions with personalized communication tools and targeted content.",
      icon: <Zap className="text-[#fe6019]" />
    },
    {
      title: "Enterprise-grade security",
      description: "Protect your alumni data with advanced security features and compliance standards.",
      icon: <Lock className="text-[#fe6019]" />
    },
    {
      title: "Dedicated support team",
      description: "Get help when you need it with our responsive support team and comprehensive resources.",
      icon: <LifeBuoy className="text-[#fe6019]" />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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

  const iconVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Dashboard animation variants
  const dashboardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const chartBarVariants = {
    hidden: { scaleY: 0, originY: 1 },
    visible: i => ({
      scaleY: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        type: "spring",
        stiffness: 50
      }
    })
  };

  const activityVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <motion.section 
      className="py-24 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <SectionHeading
              badge="Why choose AlumnLink"
              badgeColor="purple"
              title="Purpose-built for alumni engagement"
              description="Unlike generic community platforms, AlumnLink is designed specifically for educational institutions and their unique alumni engagement needs."
              centered={false}
            />

            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i} 
                  className="flex gap-4"
                  variants={itemVariants}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-white to-[#fff8f5] p-3 rounded-lg shadow-sm border border-gray-100 h-fit"
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    {benefit.icon}
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="text-lg font-semibold mb-2 text-gray-800"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + (i * 0.1) }}
                    >
                      {benefit.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                    >
                      {benefit.description}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="lg:w-1/2"
            variants={dashboardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {/* Dashboard mockup */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header bar */}
                <motion.div 
                  className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="font-bold">AlumnLink Dashboard</div>
                  <div className="flex gap-4">
                    <div className="text-sm">Admin</div>
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    ></motion.div>
                  </div>
                </motion.div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Alumni Engagement Overview</h3>
                    <div className="flex gap-2">
                      <motion.div 
                        className="px-3 py-1 bg-gradient-to-r from-[#fff8f5] to-[#ffe8de] rounded-md text-sm"
                        whileHover={{ scale: 1.05 }}
                      >This Month</motion.div>
                      <motion.div 
                        className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                        whileHover={{ scale: 1.05 }}
                      >Export</motion.div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Active Members", value: "3,420", change: "+12%" },
                      { label: "New Registrations", value: "142", change: "+8%" },
                      { label: "Event Attendees", value: "867", change: "+18%" }
                    ].map((stat, i) => (
                      <motion.div 
                        key={i} 
                        className="bg-gradient-to-br from-[#fff8f5] to-[#ffe8de] p-4 rounded-lg"
                        variants={statCardVariants}
                        whileHover={{ 
                          y: -5, 
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                        }}
                      >
                        <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                        <div className="flex items-end justify-between">
                          <motion.div 
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ 
                              delay: 0.3 + (i * 0.1),
                              type: "spring",
                              stiffness: 100
                            }}
                          >
                            {stat.value}
                          </motion.div>
                          <motion.div 
                            className="text-xs text-green-500"
                            animate={{ 
                              y: [0, -3, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: i + 2
                            }}
                          >
                            {stat.change}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    className="mb-6 bg-gradient-to-br from-[#fff8f5] to-[#ffe8de] p-4 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Engagement by Content Type</h4>
                      <div className="flex gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Jobs
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Events
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          Discussions
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-24 flex items-end gap-2">
                      {[65, 40, 75, 55, 80, 50, 90].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-[#fe6019]/10 rounded-sm" style={{ height: `${h}%` }}>
                            <motion.div 
                              className="flex h-full"
                              custom={i}
                              variants={chartBarVariants}
                            >
                              <motion.div 
                                className="w-1/3 bg-blue-500" 
                                style={{ height: `${h * 0.4}%` }}
                              ></motion.div>
                              <motion.div 
                                className="w-1/3 bg-green-500" 
                                style={{ height: `${h * 0.3}%` }}
                              ></motion.div>
                              <motion.div 
                                className="w-1/3 bg-purple-500" 
                                style={{ height: `${h * 0.3}%` }}
                              ></motion.div>
                            </motion.div>
                          </div>
                          <div className="text-[10px] text-center text-gray-500 mt-1">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-[#fff8f5] to-[#ffe8de] p-4 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    <h4 className="font-medium mb-3">Recent Activities</h4>
                    <div className="space-y-2">
                      {[
                        "New job posted by Microsoft",
                        "Homecoming event registration open",
                        "18 new members joined today",
                        "Fundraising campaign reached 80% of goal"
                      ].map((activity, i) => (
                        <motion.div 
                          key={i} 
                          className="text-sm p-2 bg-white rounded flex items-center gap-2"
                          custom={i}
                          variants={activityVariants}
                          whileHover={{ x: 5, backgroundColor: "#FFFAF5" }}
                        >
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-[#fe6019]"
                            animate={{ 
                              scale: [1, 1.3, 1],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: i + 1
                            }}
                          ></motion.div>
                          {activity}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -top-6 -right-6 bg-[#fe6019]/10 w-32 h-32 rounded-full blur-xl -z-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              ></motion.div>
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-blue-100 w-32 h-32 rounded-full blur-xl -z-10"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              ></motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Benefits;