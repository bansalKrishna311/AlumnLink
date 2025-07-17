import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReload={this.handleReload} error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ onReload, error }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto text-center"
      >
        {/* Error Icon */}
        <motion.div
          variants={itemVariants}
          className="mb-6 flex justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <AlertTriangle className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Oops! Something Went Wrong
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
        >
          We encountered an unexpected error while loading this page. 
          Don't worry, our team has been notified and we're working on a fix!
        </motion.p>

        {/* Error Details (in development mode) */}
        {process.env.NODE_ENV === 'development' && error && (
          <motion.div
            variants={itemVariants}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-left"
          >
            <div className="flex items-center mb-2">
              <Bug className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-semibold text-red-800">Error Details (Development Mode)</h3>
            </div>
            <pre className="text-sm text-red-700 overflow-auto max-h-40">
              {error.toString()}
            </pre>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">What can you do?</h3>
          <ul className="text-gray-600 space-y-2 text-left">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              Try refreshing the page
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              Check your internet connection
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              Clear your browser cache
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              Return to the homepage
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReload}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reload Page</span>
          </motion.button>

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              <span>Go to Homepage</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* AlumnLink Branding */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-[#fe6019]">AlumnLink</span> - 
            Connecting communities, even when things go wrong.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorBoundary;
