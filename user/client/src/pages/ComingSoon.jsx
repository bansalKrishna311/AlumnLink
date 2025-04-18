import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Rocket, Calendar, Bell } from "lucide-react";
import Doodles from "@/pages/auth/components/Doodles";

const ComingSoon = () => {
  const navigate = useNavigate();
  const launchDate = new Date("June 15, 2025");
  const currentDate = new Date();
  
  // Calculate days remaining
  const timeRemaining = launchDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Background pattern */}
      <Doodles />
      
      <div className="relative max-w-4xl mx-auto p-4 sm:p-6 pt-10 sm:pt-16">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-600 hover:text-[#fe6019] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back</span>
        </button>
        
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-orange-100 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 rounded-full p-3 mb-6">
                <Clock className="h-10 w-10 text-[#fe6019]" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Messaging Coming Soon!
              </h1>
              
              <p className="text-lg text-gray-600 max-w-2xl mb-8">
                We're working hard to bring you a seamless messaging experience to connect with your network. Our team is adding final touches to make sure it's perfect for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10">
                <div className="flex flex-col items-center">
                  <Rocket className="h-8 w-8 text-[#fe6019] mb-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Launch Date</h2>
                  <p className="text-gray-600">{launchDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Calendar className="h-8 w-8 text-[#fe6019] mb-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Days Remaining</h2>
                  <p className="text-gray-600">{daysRemaining} days</p>
                </div>
              </div>
              
              <div className="w-full max-w-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Get notified when it's ready</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#fe6019] flex-grow"
                  />
                  <button className="bg-[#fe6019] hover:bg-[#e54e0e] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Notify Me</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 px-6 py-4 text-center text-sm text-gray-600">
            <p>While you wait, you can still explore profiles and connect with peers!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;