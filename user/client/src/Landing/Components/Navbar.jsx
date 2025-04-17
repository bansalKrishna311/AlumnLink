import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white shadow-lg py-2' 
          : 'bg-white/70 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/logo copy.png"
                alt="AlumnLink Logo"
                className="h-8 w-auto transition-all duration-500"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#fe6019]">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#fe6019]">
              Pricing
            </Link>
            <Link to="/Request-Demo" className="text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#fe6019]">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLogin}
              className="text-sm font-medium px-4 py-2 rounded-lg text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#fe6019]"
            >
              Login
            </button>
            <button
              onClick={handleSignUp}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-[#fe6019] text-white hover:bg-[#e54d07] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`
          md:hidden 
          transition-all 
          duration-300 
          ease-in-out 
          overflow-hidden
          bg-white
          rounded-lg
          shadow-lg
          mt-2
          ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#fe6019] hover:bg-gray-50 transition-colors duration-300"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#fe6019] hover:bg-gray-50 transition-colors duration-300"
            >
              Pricing
            </Link>
            <Link
              to="/Request-Demo"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#fe6019] hover:bg-gray-50 transition-colors duration-300"
            >
              Contact
            </Link>
            <button
              onClick={handleLogin}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#fe6019] hover:bg-gray-50 transition-colors duration-300"
            >
              Login
            </button>
            <button
              onClick={handleSignUp}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-[#fe6019] text-white hover:bg-[#e54d07] transition-colors duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;