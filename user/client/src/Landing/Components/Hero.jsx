import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
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

const statVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: i => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 8,
      delay: 0.5 + (i * 0.1)
    }
  })
};

// Reusable component for hero banner with animated elements
const HeroSection = ({ children }) => (
  <div className="relative bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de] min-h-screen pt-28 pb-16">
    {/* Abstract shapes */}
    <motion.div 
      className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#fe6019]/20 to-[#fe6019]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
      animate={{ 
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -50, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
    ></motion.div>
    <motion.div 
      className="absolute -bottom-32 -left-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
      animate={{ 
        scale: [1, 1.1, 0.9, 1],
        x: [0, 20, -20, 0],
        y: [0, -20, 20, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", delay: 2 }}
    ></motion.div>
    <motion.div 
      className="absolute top-1/2 -left-20 w-72 h-72 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
      animate={{ 
        scale: [1, 0.9, 1.1, 1],
        x: [0, -20, 30, 0],
        y: [0, 20, -30, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", delay: 4 }}
    ></motion.div>
    
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
      {children}
    </div>
  </div>
);

// Main Hero component
const Hero = () => {
  // Partner universities
  const universities = ['Harvard', 'Stanford', 'MIT', 'Oxford', 'Cambridge'];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <HeroSection>
        {/* Hero content - now in top-bottom layout */}
        <div className="flex flex-col items-center text-center">
          {/* Top section - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-5 mb-16"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm mb-4 border border-[#fe6019]/10"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(254, 96, 25, 0.1)" }}
            >
              <motion.span 
                className="h-2 w-2 rounded-full bg-[#fe6019]"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              ></motion.span>
              <span className="text-sm font-medium text-gray-600">Alumni Networking Reimagined</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900"
              variants={itemVariants}
            >
              Reconnect Your{" "} 
              <motion.span 
                className="inline-block bg-gradient-to-r from-[#fe6019] to-orange-600 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                Alumni Network
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              The complete platform for educational institutions to build, engage, and grow their alumni community in one powerful dashboard.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="relative group px-8 py-3.5 bg-[#fe6019] hover:bg-[#fe6019]/90 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#fe6019]/20 transform hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      repeatDelay: 0.5 
                    }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#fe6019] to-orange-500 group-hover:scale-105 transition-transform duration-300"
                    animate={{ 
                      background: [
                        'linear-gradient(to right, #fe6019, #f97316)',
                        'linear-gradient(to right, #f97316, #fe6019)',
                        'linear-gradient(to right, #fe6019, #f97316)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  ></motion.div>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/landing/about"
                  className="px-8 py-3.5 border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-xl hover:bg-white hover:border-gray-400 hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  See How It Works
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      repeatDelay: 1 
                    }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="pt-6"
              variants={itemVariants}
            >
              <motion.p 
                className="text-sm text-gray-500 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Trusted by educational institutions worldwide
              </motion.p>
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {universities.map((university, i) => (
                  <motion.div 
                    key={i} 
                    className="text-gray-400 font-semibold text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    whileHover={{ 
                      scale: 1.1, 
                      color: "#fe6019",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {university} UNIVERSITY
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom section - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 30,
                damping: 8,
                delay: 0.3
              }
            }}
            className="w-full max-w-5xl mx-auto"
            whileHover={{ 
              y: -10,
              transition: { 
                duration: 0.3
              }
            }}
          >
            <motion.div 
              className="relative bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              initial={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(254, 96, 25, 0.15)",
              }}
            >
              {/* Mockup UI */}
              <div className="relative rounded-xl overflow-hidden bg-gray-50 pt-4 shadow-inner">
                {/* Browser mockup */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 px-4">
                  <div className="flex gap-1.5">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-400"
                      whileHover={{ scale: 1.2 }}
                    ></motion.div>
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-yellow-400"
                      whileHover={{ scale: 1.2 }}
                    ></motion.div>
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-400"
                      whileHover={{ scale: 1.2 }}
                    ></motion.div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full h-6 bg-white rounded-md flex items-center justify-center text-xs text-gray-400 border border-gray-200">
                      alumnlink.com/dashboard
                    </div>
                  </div>
                  <div className="flex gap-2 text-gray-400">
                    <motion.div whileHover={{ rotate: 180, transition: { duration: 0.5 } }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
                
                {/* Dashboard content */}
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { title: "Alumni", count: "5,240", change: "+12%" },
                      { title: "Engagement", count: "78%", change: "+5%" },
                      { title: "Event Signups", count: "284", change: "+18%" },
                    ].map((stat, i) => (
                      <motion.div 
                        key={i} 
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                        custom={i}
                        variants={statVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ 
                          y: -5, 
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                        }}
                      >
                        <div className="text-xs text-gray-500 mb-1">{stat.title}</div>
                        <div className="flex items-end justify-between">
                          <motion.div 
                            className="text-xl font-bold text-gray-800"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              delay: 0.7 + (i * 0.1),
                              type: "spring",
                              stiffness: 100
                            }}
                          >
                            {stat.count}
                          </motion.div>
                          <motion.div 
                            className="text-xs text-green-500 flex items-center"
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
                            {stat.change} <ArrowRight size={10} className="transform rotate-45" />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    <motion.div 
                      className="w-2/3 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: {
                          delay: 0.8,
                          duration: 0.5
                        }
                      }}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                      }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-medium text-gray-700">Alumni Engagement</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-3 h-3 bg-[#fe6019] rounded-full"></div>
                          This Year
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          Last Year
                        </div>
                      </div>
                      <div className="h-32 flex items-end gap-1">
                        {[40, 55, 35, 70, 65, 75, 60, 80, 75, 90, 85, 95].map((h, i) => (
                          <motion.div 
                            key={i} 
                            className="flex-1 flex flex-col items-center gap-1"
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ 
                              scaleY: 1, 
                              opacity: 1,
                              transition: {
                                delay: 1 + (i * 0.05),
                                duration: 0.3,
                                type: "spring",
                                stiffness: 50
                              }
                            }}
                            whileHover={{ 
                              scaleY: 1.1,
                              transition: { duration: 0.2 }
                            }}
                            style={{ transformOrigin: "bottom" }}
                          >
                            <div className="w-full bg-[#fe6019]/10 rounded-sm" style={{ height: `${h}%` }}>
                              <motion.div 
                                className="w-full bg-[#fe6019] rounded-sm" 
                                initial={{ height: 0 }}
                                animate={{ height: `${h*0.7}%` }}
                                transition={{ 
                                  delay: 1.2 + (i * 0.05),
                                  duration: 0.5,
                                  type: "spring",
                                  stiffness: 30
                                }}
                              ></motion.div>
                            </div>
                            <div className="text-xs text-gray-400">{i+1}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="w-1/3 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: {
                          delay: 0.9,
                          duration: 0.5
                        }
                      }}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                      }}
                    >
                      <div className="text-sm font-medium text-gray-700 mb-4">Recent Activity</div>
                      <div className="space-y-3">
                        {[
                          { type: "job", text: "New job opportunity posted" },
                          { type: "event", text: "Annual homecoming event" },
                          { type: "user", text: "28 new alumni joined" },
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-center gap-2 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0,
                              transition: {
                                delay: 1 + (i * 0.2),
                                duration: 0.3
                              }
                            }}
                            whileHover={{ x: 3, transition: { duration: 0.2 } }}
                          >
                            <motion.div 
                              className={`w-2 h-2 rounded-full ${item.type === 'job' ? 'bg-blue-500' : item.type === 'event' ? 'bg-purple-500' : 'bg-green-500'}`}
                              animate={{ 
                                scale: [1, 1.5, 1],
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: i + 2
                              }}
                            ></motion.div>
                            <div className="text-gray-600">{item.text}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        delay: 1.1,
                        duration: 0.5
                      }
                    }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium text-gray-700">Recently Active Alumni</div>
                      <motion.button 
                        className="text-xs text-[#fe6019]"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        View All
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div 
                          key={i} 
                          className="flex flex-col items-center"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: {
                              delay: 1.2 + (i * 0.1),
                              type: "spring",
                              stiffness: 200,
                              damping: 10
                            }
                          }}
                          whileHover={{ 
                            y: -3, 
                            scale: 1.1,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 mb-1 flex items-center justify-center text-gray-500 text-xs">
                            {String.fromCharCode(64 + i)}
                          </div>
                          <div className="text-[10px] text-gray-500">User {i}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </HeroSection>
    </div>
  );
};

export default Hero;