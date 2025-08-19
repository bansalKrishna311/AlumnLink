import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <SEO 
        title="Page Not Found - 404 Error | AlumnLink Alumni Management Platform"
        description="The page you're looking for doesn't exist. Explore AlumnLink's alumni management features, return to homepage, or contact support for assistance."
        keywords="404 error, page not found, alumnlink, alumni platform, alumni management, site navigation"
        noindex={true}
        canonical="https://www.alumnlink.com/404"
      />
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center px-4 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto text-center max-h-screen overflow-y-auto"
      >
        {/* Floating 404 Animation */}
        <motion.div
          variants={floatingVariants}
          animate="floating"
          className="relative mb-4"
        >
          <motion.div
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-[#fe6019] to-[#ff8a50] bg-clip-text mb-2"
          >
            404
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full opacity-20"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-400 rounded-full opacity-30"
          />
        </motion.div>

        {/* Error Icon */}
        <motion.div
          variants={itemVariants}
          className="mb-4 flex justify-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-[#fe6019] to-[#ff8a50] rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
        >
          Oops! Page Not Found
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-gray-600 mb-4 leading-relaxed"
        >
          The page you're looking for seems to have wandered off into the digital wilderness. 
          Don't worry, even the best alumni networks have some unexplored territories!
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-4"
        >
          <h3 className="text-base font-semibold text-gray-800 mb-2">What can you do?</h3>
          <ul className="text-gray-600 space-y-1 text-left text-sm">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-[#fe6019] rounded-full mr-3"></div>
              Check the URL for any typos
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-[#fe6019] rounded-full mr-3"></div>
              Go back to the previous page
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-[#fe6019] rounded-full mr-3"></div>
              Return to the homepage
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#fe6019] to-[#ff8a50] text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </motion.button>

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Homepage</span>
            </motion.button>
          </Link>

          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Dashboard</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* AlumnLink Branding */}
        <motion.div
          variants={itemVariants}
          className="pt-4 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            Lost in <span className="font-semibold text-[#fe6019]">AlumnLink</span>? 
            We'll help you find your way back to the community.
          </p>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#fe6019] rounded-full opacity-10"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-3/4 right-1/4 w-6 h-6 bg-[#ff8a50] rounded-full opacity-10"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -80, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-400 rounded-full opacity-20"
          />
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default NotFoundPage;
