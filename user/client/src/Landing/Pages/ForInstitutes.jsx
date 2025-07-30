import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, Award, Target, ArrowRight, CheckCircle } from 'lucide-react';

const ForInstitutes = () => {
  const benefits = [
    {
      icon: <TrendingUp size={28} />,
      title: "Massive Profit Margins",
      description: "Boost tuition and fundraising by keeping alumni actively engaged—see up to 10x the value of your investment.",
      color: "from-green-500/20 to-emerald-400/20",
      iconColor: "text-green-600"
    },
    {
      icon: <Users size={28} />,
      title: "Student Retention Tool",
      description: "Alumni who stay connected enhance your reputation and contribute more to institutional growth.",
      color: "from-blue-500/20 to-blue-400/20",
      iconColor: "text-blue-600"
    },
    {
      icon: <Zap size={28} />,
      title: "Easy to Use",
      description: "Launch, manage, and grow with zero tech headache. We handle setup and support completely.",
      color: "from-[#fe6019]/20 to-orange-400/20",
      iconColor: "text-[#fe6019]"
    },
    {
      icon: <Award size={28} />,
      title: "Value-Added Service",
      description: "Offer students and alumni a professional network they'll actually use, setting your institution apart.",
      color: "from-purple-500/20 to-purple-400/20",
      iconColor: "text-purple-600"
    },
    {
      icon: <Target size={28} />,
      title: "Competitive Advantage",
      description: "Attract future students and donors by showcasing an active, thriving alumni community.",
      color: "from-red-500/20 to-red-400/20",
      iconColor: "text-red-600"
    }
  ];

  const features = [
    "Alumni Directory & Search",
    "Event Management System",
    "Mentorship Programs",
    "Job Board Integration",
    "Fundraising Tools",
    "Analytics Dashboard",
    "Mobile App Access",
    "24/7 Support"
  ];

  return (
    <div className="pt-28 pb-16 bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de]">
      {/* Hero Section */}
      <div className="py-20 relative overflow-hidden">
        <motion.div 
          className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#fe6019]/20 to-[#fe6019]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm mb-6 border border-[#fe6019]/10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
              />
              <span className="text-sm font-medium text-gray-600">For Educational Institutes</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#fe6019] to-orange-600">
              Powering Impactful Alumni Networks
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Turn alumni into lifelong champions for your institution. AlumnLink is the all-in-one alumni engagement platform that helps you reconnect graduates, foster mentorship, and unlock opportunities—while generating meaningful returns.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="px-8 py-4 bg-[#fe6019] text-white font-semibold rounded-full hover:bg-[#fe6019]/90 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
                <ArrowRight size={20} />
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-white text-[#fe6019] font-semibold rounded-full border-2 border-[#fe6019] hover:bg-[#fe6019] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request Demo
              </motion.button>
            </div>
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
              Why Institutes Choose{" "}
              <span className="text-[#fe6019] relative">
                AlumnLink
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#fe6019]/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h2>
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
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}/>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center ${benefit.iconColor} group-hover:bg-white/80 transition-all duration-300 mb-6`}>
                      {benefit.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
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
                From alumni directories to fundraising tools, AlumnLink provides all the features institutes need to build thriving alumni communities.
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
                    <CheckCircle size={20} className="text-[#fe6019] flex-shrink-0" />
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
              className="bg-gradient-to-br from-[#fe6019]/10 to-orange-100 rounded-3xl p-8"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-[#fe6019] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  ₹
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  "With AlumnLink, our alumni feel valued—and so does our bottom line."
                </h4>
                <p className="text-gray-600 italic">
                  - Leading Educational Institution
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#fe6019] to-orange-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to engage a new generation of graduates?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join leading institutions who are transforming their alumni networks with AlumnLink.
            </p>
            <motion.button 
              className="px-8 py-4 bg-white text-[#fe6019] font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Let's get started
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForInstitutes;
