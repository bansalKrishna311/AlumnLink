import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Reusable component for hero banner with animated elements
const HeroSection = ({ children }) => (
  <div className="relative bg-gradient-to-br from-white via-[#fff8f5] to-[#ffe8de] min-h-screen pt-28 pb-16">
    {/* Abstract shapes */}
    <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#fe6019]/20 to-[#fe6019]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
    <div className="absolute -bottom-32 -left-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
    <div className="absolute top-1/2 -left-20 w-72 h-72 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
    
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto space-y-5 mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm mb-4 border border-[#fe6019]/10">
              <span className="animate-pulse h-2 w-2 rounded-full bg-[#fe6019]"></span>
              <span className="text-sm font-medium text-gray-600">Alumni Networking Reimagined</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
              Reconnect Your <span className="bg-gradient-to-r from-[#fe6019] to-orange-600 bg-clip-text text-transparent">Alumni Network</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              The complete platform for educational institutions to build, engage, and grow their alumni community in one powerful dashboard.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link
                to="/login"
                className="relative group px-8 py-3.5 bg-[#fe6019] hover:bg-[#fe6019]/90 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#fe6019]/20 transform hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#fe6019] to-orange-500 group-hover:scale-105 transition-transform duration-300"></div>
              </Link>
              <Link
                to="/landing/about"
                className="px-8 py-3.5 border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-xl hover:bg-white hover:border-gray-400 hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                See How It Works
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="pt-6"
            >
              <p className="text-sm text-gray-500 mb-3">Trusted by educational institutions worldwide</p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {universities.map((university, i) => (
                  <div key={i} className="text-gray-400 font-semibold text-sm">
                    {university} UNIVERSITY
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom section - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="relative bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Mockup UI */}
              <div className="relative rounded-xl overflow-hidden bg-gray-50 pt-4 shadow-inner">
                {/* Browser mockup */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 px-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full h-6 bg-white rounded-md flex items-center justify-center text-xs text-gray-400 border border-gray-200">
                      alumnlink.com/dashboard
                    </div>
                  </div>
                  <div className="flex gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
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
                      <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">{stat.title}</div>
                        <div className="flex items-end justify-between">
                          <div className="text-xl font-bold text-gray-800">{stat.count}</div>
                          <div className="text-xs text-green-500 flex items-center">
                            {stat.change} <ArrowRight size={10} className="transform rotate-45" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    <div className="w-2/3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
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
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-[#fe6019]/10 rounded-sm" style={{ height: `${h}%` }}>
                              <div className="w-full bg-[#fe6019] rounded-sm" style={{ height: `${h*0.7}%` }}></div>
                            </div>
                            <div className="text-xs text-gray-400">{i+1}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-1/3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="text-sm font-medium text-gray-700 mb-4">Recent Activity</div>
                      <div className="space-y-3">
                        {[
                          { type: "job", text: "New job opportunity posted" },
                          { type: "event", text: "Annual homecoming event" },
                          { type: "user", text: "28 new alumni joined" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full ${item.type === 'job' ? 'bg-blue-500' : item.type === 'event' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                            <div className="text-gray-600">{item.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium text-gray-700">Recently Active Alumni</div>
                      <button className="text-xs text-[#fe6019]">View All</button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 mb-1 flex items-center justify-center text-gray-500 text-xs">
                            {String.fromCharCode(64 + i)}
                          </div>
                          <div className="text-[10px] text-gray-500">User {i}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </HeroSection>
      
      {/* Custom styles for animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Hero;