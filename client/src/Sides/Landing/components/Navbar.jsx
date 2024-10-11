import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';
import logo from '../../../../src/assets/logo copy.png';
import whiteLogo from '../../../assets/logo-white.png';
import Btn from './Btn';
import ParticlesComponent from './ParticlesComponent'; // Import the ParticlesComponent

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [scrolling, setScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  return (
    <>
      <ParticlesComponent theme={theme} /> {/* Pass theme prop here */}
      <div 
        className={`navbar bg-base-100 px-4 md:px-8 lg:px-32 border-b-[0.5px] fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${scrolling ? 'shadow-lg bg-opacity-80 backdrop-blur-md' : ''}`} 
        style={{
          borderBottomColor: theme === 'light' ? 'rgba(128, 128, 128, 0.5)' : 'rgba(128, 128, 128, 0.3)',
        }}
      >
        <div className="navbar-start">
          <a>
            <img 
              className="w-36 md:w-52 transition-transform duration-300 ease-in-out hover:scale-105" 
              src={theme === 'light' ? logo : whiteLogo} 
              alt="Logo" 
            />
          </a>
        </div>

        <div className="navbar-end flex items-center gap-4">
          {!isMobile && <Btn text="Get Started" Icon={FiArrowRight} />}
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-square btn-ghost transition-transform duration-300 ease-in-out hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              </button>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-60 p-2 shadow transition-all duration-300 ease-in-out">
                {isMobile && (
                  <li className='w-full -ms-7'>
                    <Btn text="Get Started" Icon={FiArrowRight} />
                  </li>
                )}
                <li>
                  <button onClick={toggleTheme} className="btn flex items-center gap-3 transition-transform duration-300 ease-in-out hover:scale-105">
                    {theme === 'light' ? (
                      <FiMoon className="h-5 w-5 mr-2 text-gray-600" />
                    ) : (
                      <FiSun className="h-5 w-5 mr-2 text-yellow-500" />
                    )}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
