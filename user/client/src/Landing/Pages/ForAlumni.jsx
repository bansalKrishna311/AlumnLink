import React from 'react';
import { motion } from 'framer-motion';
import { Network, Briefcase, Users, Calendar, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

const ForAlumni = () => {
  const benefits = [
    {
      icon: <Network size={28} />,
      title: "Professional Networking",
      description: "Meet alumni in your industry, city, or area of interest. Build meaningful professional connections that last.",
      color: "from-blue-500/20 to-blue-400/20",
      iconColor: "text-blue-600"
    },
    {
      icon: <Briefcase size={28} />,
      title: "Career Advancement",
      description: "Access job referrals, business partnerships, and exclusive opportunities within your alumni network.",
      color: "from-green-500/20 to-emerald-400/20",
      iconColor: "text-green-600"
    },
    {
      icon: <Users size={28} />,
      title: "Mentorship & Guidance",
      description: "Find a mentor or become one for the next generation. Share knowledge and learn from experienced professionals.",
      color: "from-purple-500/20 to-purple-400/20",
      iconColor: "text-purple-600"
    },
    {
      icon: <Calendar size={28} />,
      title: "Community Involvement",
      description: "Attend events, share stories, and contribute to your school or college community in meaningful ways.",
      color: "from-[#fe6019]/20 to-orange-400/20",
      iconColor: "text-[#fe6019]"
    },
    {
      icon: <MessageSquare size={28} />,
      title: "Knowledge Exchange",
      description: "Share insights, experiences, and expertise—make an impact while learning from fellow alumni.",
      color: "from-teal-500/20 to-teal-400/20",
      iconColor: "text-teal-600"
    }
  ];

  const features = [
    "Alumni Directory Search",
    "Industry-Based Groups",
    "Job Board Access",
    "Mentorship Matching",
    "Event Participation",
    "Professional Development",
    "Networking Events",
    "Knowledge Sharing"
  ];

  return (
    <div className="pt-28 pb-16 bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de]">
      {/* Hero Section */}
      <div className="py-20 relative overflow-hidden">
        {/* Advanced floating elements */}
        <motion.div 
          className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/15 to-purple-300/5 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ 
            scale: [1, 1.3, 0.9, 1],
            x: [0, 50, -20, 0],
            y: [0, -30, 40, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-40 left-10 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-blue-300/5 rounded-full mix-blend-multiply filter blur-2xl"
          animate={{ 
            scale: [0.8, 1.2, 1],
            x: [0, -40, 20, 0],
            y: [0, 60, -30, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "loop",
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute bottom-10 right-20 w-48 h-48 bg-gradient-to-br from-teal-400/15 to-green-300/5 rounded-full mix-blend-multiply filter blur-2xl"
          animate={{ 
            scale: [1, 0.7, 1.4, 1],
            x: [0, 30, -40, 0],
            y: [0, -20, 50, 0],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            repeatType: "loop",
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-lg py-3 px-6 rounded-full shadow-lg mb-8 border border-purple-200/30"
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <motion.div 
                className="relative"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <motion.span 
                  className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 block"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(147, 51, 234, 0.4)",
                      "0 0 0 8px rgba(147, 51, 234, 0.1)",
                      "0 0 0 0 rgba(147, 51, 234, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.span 
                  className="absolute inset-0 h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
              <span className="text-sm font-semibold text-gray-700 tracking-wide">For Alumni</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.5,
                type: "spring",
                stiffness: 150,
                damping: 20
              }}
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Your Network for Life
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.7,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              AlumnLink lets you connect, grow, and thrive alongside fellow graduates. Whether you want to reconnect, find mentors, discover opportunities, or give back, you're in the right place.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.9,
                type: "spring",
                stiffness: 120,
                damping: 15
              }}
            >
              <motion.button 
                className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Join Today
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </span>
              </motion.button>
              
              <motion.button 
                className="relative px-8 py-4 bg-white text-purple-600 font-semibold rounded-full border-2 border-purple-600 overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 30px rgba(147, 51, 234, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                  initial={{ scale: 0, borderRadius: "50%" }}
                  whileHover={{ scale: 1, borderRadius: "0%" }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Explore Features
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Alumni{" "}
              <span className="text-purple-600 relative">
                Get
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-600/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the full potential of your alumni network with tools designed specifically for professional and personal growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden cursor-pointer"
                  whileHover={{ 
                    y: -8,
                    rotateY: 5,
                    rotateX: 5,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                >
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-100`}
                    initial={{ scale: 0, rotate: 180 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center ${benefit.iconColor} group-hover:bg-white/90 transition-all duration-300 mb-6`}
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.1
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10 
                      }}
                    >
                      {benefit.icon}
                    </motion.div>
                    
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {benefit.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-600 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {benefit.description}
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                From professional networking to career advancement, AlumnLink provides all the tools you need to make the most of your alumni connections.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle size={20} className="text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-purple-500/10 to-indigo-100 rounded-3xl p-8"
            >
              <div className="text-center">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-xl"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)"
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15 
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Network size={40} />
                  </motion.div>
                </motion.div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  "Through AlumnLink, I found a mentor who changed my career path."
                </h4>
                <p className="text-gray-600 italic">
                  - Recent Graduate
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              It's Your Community. Make the Most of It.
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of alumni who are already connecting, growing, and thriving together on AlumnLink.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { number: "Active", label: "Alumni Network", color: "text-blue-600" },
                { number: "Growing", label: "Institutions", color: "text-green-600" },
                { number: "95%", label: "Satisfaction Rate", color: "text-purple-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to unlock your network's potential?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Your community is waiting. Join AlumnLink today and start building meaningful connections.
            </p>
            <motion.button 
              className="relative px-8 py-4 bg-white text-purple-600 font-semibold rounded-full overflow-hidden group shadow-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                initial={{ scale: 0, borderRadius: "50%" }}
                whileHover={{ scale: 1, borderRadius: "0%" }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                Join today
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForAlumni;
