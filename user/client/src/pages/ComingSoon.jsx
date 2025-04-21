
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
