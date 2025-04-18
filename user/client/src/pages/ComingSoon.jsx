<<<<<<< HEAD
import React from 'react'
import Doodles from './auth/components/Doodles'

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
    {/* Enhanced Background Doodles */}
<Doodles/>
    
    {/* Content */}
    
    <div className="relative z-10 max-w-3xl w-full px-6 py-10 bg-white bg-opacity-95 rounded-xl shadow-xl">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="w-full md:w-2/5 flex justify-center">
          <div className="relative w-64 h-64">
            {/* Illustration - Building/constructing */}
            <svg className="w-full h-full" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background element */}
              <circle cx="256" cy="256" r="176" fill="#FFF4ED" />
              
              {/* Gear elements */}
              <circle cx="256" cy="256" r="70" fill="#FFDBC9" stroke="#fe6019" strokeWidth="8" />
              <circle cx="256" cy="256" r="20" fill="white" stroke="#fe6019" strokeWidth="6" />
              
              {/* Gear teeth */}
              <path d="M256 166V186" stroke="#fe6019" strokeWidth="12" strokeLinecap="round" />
              <path d="M256 326V346" stroke="#fe6019" strokeWidth="12" strokeLinecap="round" />
              <path d="M166 256H186" stroke="#fe6019" strokeWidth="12" strokeLinecap="round" />
              <path d="M326 256H346" stroke="#fe6019" strokeWidth="12" strokeLinecap="round" />
              <path d="M195 195L210 210" stroke="#fe6019" strokeWidth="12" strokeLinecap="round" />
              <path d="M302 302L317 317" stroke="#fe6019" strokeWidth="12" strokeLinecap="round" />
              <path d="M195 317L210 302" stroke="#fe6019" strokeWidth="12" strokeLinecap="round" />
              <path d="M302 210L317 195" stroke="#fe6019" strokeWidth="12" strokeLinecap="round" />
              
              {/* Tools */}
              <path d="M350 150L380 120" stroke="#555" strokeWidth="6" strokeLinecap="round" />
              <path d="M380 120L410 150" stroke="#555" strokeWidth="6" strokeLinecap="round" />
              <rect x="408" y="148" width="30" height="8" rx="2" transform="rotate(45 408 148)" fill="#555" />
              
              <path d="M160 350L130 380" stroke="#555" strokeWidth="6" strokeLinecap="round" />
              <rect x="110" y="380" width="20" height="40" rx="2" fill="#888" />
            </svg>
          </div>
        </div>
        
        {/* Right Side - Content */}
        <div className="w-full md:w-3/5 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Coming Soon</h1>
          <div className="h-1 w-24 bg-orange-500 mb-6 md:mx-0 mx-auto" style={{backgroundColor: '#fe6019'}}></div>
          
          <p className="text-lg text-gray-600 mb-6">
            This feature is currently under development. Our team is working hard to bring you an amazing experience.
          </p>
          
          <p className="text-gray-700 mb-8">
            Wee constantly improving our platform with new capabilities designed to enhance your workflow and productivity. Check back soon to explore this new feature.
          </p>
          
          {/* Return Button */}
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center sm:justify-start mx-auto sm:mx-0"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Return to Previous Page
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ComingSoon
=======
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Rocket } from "lucide-react";
import Doodles from "@/pages/auth/components/Doodles";

const ComingSoon = () => {
  const location = useLocation();
  
  // Get the feature name from location state or use a default value
  const { feature = "This feature is" } = location.state || {};
  
  // Prevent scrolling when component mounts
  useEffect(() => {
    // Save original styles
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Restore original styles on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
  
  return (
    <div className="h-screen w-screen fixed inset-0 overflow-hidden">
      {/* Background pattern */}
      <Doodles />
      
      <div className="flex items-center justify-center h-full w-full p-4">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-orange-100 shadow-xl overflow-hidden max-w-2xl w-full">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 rounded-full p-4 mb-6 animate-pulse">
                <Rocket className="h-10 w-10 sm:h-12 sm:w-12 text-[#fe6019]" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 pb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#fe6019] to-orange-500">
                {feature} Coming Soon!
              </h1>
              
              <p className="text-base sm:text-xl text-gray-600 max-w-lg mb-2">
                We're crafting something amazing! Our team is putting the final touches on this exciting new feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
>>>>>>> 7ff9283c9061634d9048e407cff1096ec49ea2f7
