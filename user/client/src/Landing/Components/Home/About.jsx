import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserGraduate, FaNetworkWired, FaChalkboardTeacher, FaChevronRight, FaChevronLeft, FaHandshake } from 'react-icons/fa';

const alumni = [
  {
    id: 1,
    type: "Tech Entrepreneur",
    description: "Founded a successful AI startup after graduating, now valued at $50M",
    image: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaNetworkWired className="text-[#fe6019]" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: 2,
    type: "Research Scientist",
    description: "Leading groundbreaking research in renewable energy technologies",
    image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaChalkboardTeacher className="text-[#fe6019]" />,
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  },
  {
    id: 3,
    type: "Social Impact Leader",
    description: "Founded NGO that has educated over 10,000 underprivileged children",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaHandshake className="text-[#fe6019]" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: 4,
    type: "Creative Director",
    description: "Award-winning creative leading campaigns for global brands",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaUserGraduate className="text-[#fe6019]" />,
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  }
];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % alumni.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextAlumni = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % alumni.length);
  };

  const prevAlumni = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + alumni.length) % alumni.length);
  };

  return (
    <section className="w-full h-screen bg-gray-50 overflow-hidden relative">
      {/* Orange accent elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[#fe6019] z-20"></div>
      <div className="absolute top-20 -left-20 w-40 h-40 rounded-full bg-[#fe6019] opacity-10"></div>
      <div className="absolute bottom-20 -right-20 w-64 h-64 rounded-full bg-[#fe6019] opacity-10"></div>

      <div className="container mx-auto w-11/12 h-full flex flex-col lg:flex-row items-center px-6 py-12">
        {/* Left content */}
        <div className="lg:w-1/2 z-10 lg:pr-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Join Our <span className="text-[#fe6019]">Global Alumni</span> Network
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 mb-8 max-w-lg text-justify"
          >
            Connect with 25,000+ accomplished graduates across 60 countries. Access exclusive benefits, mentorship opportunities, and lifelong learning resources.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-8 max-w-xl"
          >
            {['Networking Events', 'Career Support', 'Continuing Education', 'Mentorship', 'Alumni Discounts'].map((benefit, i) => (
              <span 
                key={i} 
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:bg-orange-50 transition-colors"
              >
                {benefit}
              </span>
            ))}
          </motion.div>
          
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#fe6019] hover:bg-[#e05515] text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2"
            >
              Join Now
              <FaChevronRight className="text-sm" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-8 py-3 rounded-lg font-medium shadow transition-all flex items-center gap-2"
            >
              Explore Alumni
              <FaChevronRight className="text-sm" />
            </motion.button>
          </div>
        </div>

        {/* Right slider */}
        <div className="lg:w-1/2 relative h-full flex items-center justify-center mt-8 lg:mt-0">
          <AnimatePresence custom={direction}>
            <motion.div
              key={alumni[currentIndex].id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.6 }}
              className="absolute w-full max-w-md"
            >
              <div className="relative">
                {/* Alumni image */}
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                  <img 
                    src={alumni[currentIndex].image} 
                    alt={alumni[currentIndex].type}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Alumni profile card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`absolute -bottom-6 -right-6 ${alumni[currentIndex].bgColor} p-6 rounded-xl shadow-lg w-64 border ${alumni[currentIndex].borderColor}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {alumni[currentIndex].icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{alumni[currentIndex].type}</h3>
                      <p className="text-xs text-[#fe6019]">Class of {Math.floor(Math.random() * 20) + 2000}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{alumni[currentIndex].description}</p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {/* <button 
            onClick={prevAlumni}
            className="absolute left-0 lg:-left-12 p-3 bg-white rounded-full shadow-md hover:bg-orange-50 transition-colors z-20 border border-gray-200"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          <button 
            onClick={nextAlumni}
            className="absolute right-0 lg:-right-12 p-3 bg-white rounded-full shadow-md hover:bg-orange-50 transition-colors z-20 border border-gray-200"
          >
            <FaChevronRight className="text-gray-700" />
          </button> */}

          {/* Indicator dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {alumni.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`w-3 h-3 rounded-full transition-all ${i === currentIndex ? 'bg-[#fe6019] w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;