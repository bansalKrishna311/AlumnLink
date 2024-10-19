import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import logo from '../../../../src/assets/logo copy.png';
import whiteLogo from '../../../assets/logo-white.png';
import ParticlesComponent from './ParticlesComponent';
import { AnimatedModalDemo } from './test'; // Import the modal component

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [scrolling, setScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);

    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
  };

  return (
    <>
      <ParticlesComponent theme={theme} /> 
      <div 
        className={`bg-base-100 px-4 md:px-8 lg:px-32 border-b-[0.5px] fixed top-0 left-0 w-full z-30 transition-all duration-300 ease-in-out ${scrolling ? 'shadow-lg bg-opacity-80 backdrop-blur-md' : ''}`} 
        style={{
          borderBottomColor: theme === 'light' ? 'rgba(128, 128, 128, 0.5)' : 'rgba(128, 128, 128, 0.3)',
        }}
      >
        <div className="flex justify-between items-center h-16">
          <a>
            <img 
              className="w-36 md:w-52 transition-transform duration-300 ease-in-out hover:scale-105" 
              src={theme === 'light' ? logo : whiteLogo} 
              alt="Logo" 
            />
          </a>

          <div className="flex items-center gap-4">
            {/* Render AnimatedModalDemo only on larger screens */}
            {!isMobile && <AnimatedModalDemo />}
            <div className="relative">
              <button
                onClick={toggleDropdown} // Toggle the dropdown on click
                className="flex items-center p-2 transition-transform duration-300 ease-in-out hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        {theme === 'light' ? (
                          <FiMoon className="h-5 w-5 text-gray-600" />
                        ) : (
                          <FiSun className="h-5 w-5 text-yellow-500" />
                        )}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                      </button>
                    </li>
                    {/* Add more dropdown options here if needed */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
