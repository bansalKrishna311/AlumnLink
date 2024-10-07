import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiArrowRight } from 'react-icons/fi'; // Import icons from react-icons
import logo from '../../../../src/assets/logo copy.png'; // Light mode logo
import whiteLogo from '../../../assets/logo-white.png'; // Dark mode logo

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);

    // Scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div 
      className={`navbar bg-base-100 ps-32 pe-32 border-b-[0.5px] fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${scrolling ? 'shadow-lg bg-opacity-80 backdrop-blur-md' : ''}`} 
      style={{
        borderBottomColor: theme === 'light' ? 'rgba(128, 128, 128, 0.5)' : 'rgba(128, 128, 128, 0.3)', // Adjusted border opacity
      }}
    >
      <div className="navbar-start">
        {/* Conditionally render logo based on the theme */}
        <a>
          <img className="w-52 transition-transform duration-300 ease-in-out hover:scale-105" src={theme === 'light' ? logo : whiteLogo} alt="Logo" />
        </a>
      </div>

      <div className="navbar-end flex items-center gap-4"> {/* Added gap to create space */}
        <a className="btn rounded-full max-w-lg px-5 transition-transform duration-300 ease-in-out hover:bg-secondary hover:text-white bg-started text-white flex items-center mx-4"> {/* Added horizontal margin */}
          Get Started
          <FiArrowRight className="ml-2 h-5 w-5" /> {/* Icon added here */}
        </a>

        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-square btn-ghost transition-transform duration-300 ease-in-out hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow transition-all duration-300 ease-in-out"
            >
              <li>
                <button onClick={toggleTheme} className="btn flex items-center gap-3 transition-transform duration-300 ease-in-out hover:scale-105">
                  {/* Left Icon */}
                  {theme === 'light' ? (
                    <FiSun className="h-5 w-5 mr-2 text-yellow-500" />
                  ) : (
                    <FiMoon className="h-5 w-5 mr-2 text-gray-600" />
                  )}
                  {/* Right Text */}
                  <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
