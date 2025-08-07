import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/Landing/about' },
  { 
    label: 'Solutions', 
    href: '#',
    dropdown: [
      { label: 'For Institutes', href: '/Landing/for-institutes' },
      { label: 'For Corporates', href: '/Landing/for-corporates' },
      { label: 'For Schools', href: '/Landing/for-schools' },
      { label: 'For Alumni', href: '/Landing/for-alumni' }
    ]
  },
  { label: 'Contact', href: '/Landing/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    // Scroll to top when the location changes
    window.scrollTo(0, 0);
  }, [location]);

  // Function to handle link clicks
  const handleNavLinkClick = () => {
    // Scroll to top when a navbar link is clicked
    window.scrollTo(0, 0);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3' 
          : 'bg-white/90 py-4'
      }`}
    >
      <div className="container w-11/12 mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex-1">
            <Link to="/" className="flex items-center" onClick={handleNavLinkClick}>
              <img 
                src="/logo copy.png" 
                alt="AlumLink Logo" 
                className="h-7 md:h-9 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <div key={link.href} className="relative group">
                  {link.dropdown ? (
                    <>
                      <button
                        className={`flex items-center gap-1 text-sm font-medium ${
                          link.dropdown.some(item => location.pathname === item.href)
                            ? 'text-orange-500'
                            : 'text-gray-700 hover:text-orange-500 transition-colors'
                        }`}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        {link.label}
                        <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div 
                        className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transition-all duration-200 ${
                          dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                        }`}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={handleNavLinkClick}
                            className={`block px-4 py-2 text-sm ${
                              location.pathname === item.href
                                ? 'text-orange-500 bg-orange-50'
                                : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                            } transition-colors`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={handleNavLinkClick}
                      className={`text-sm font-medium ${
                        location.pathname === link.href
                          ? 'text-orange-500 border-b-2 border-orange-500 pb-1'
                          : 'text-gray-700 hover:text-orange-500 transition-colors'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button Section */}
          <div className="flex-1 flex justify-end">
            <Link 
              to="/Login"
              onClick={handleNavLinkClick}
              className="group relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#fe6019] to-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {/* Main text that slides out */}
              <span className="transform transition-all duration-500 group-hover:translate-x-96">
                Get Started
              </span>
              
              {/* Arrow icon that slides in */}
              <span className="absolute inset-0 flex transform items-center justify-center opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                <ArrowRight className="h-5 w-5" />
              </span>
              
              {/* Hover effect overlay */}
              <span className="absolute inset-0 transform bg-black opacity-0 transition-all duration-300 group-hover:opacity-10" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden ml-4 text-gray-700 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg rounded-b-lg border-t border-gray-100">
            <div className="container mx-auto py-4 flex flex-col space-y-3">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.dropdown ? (
                    <>
                      <button
                        className={`w-full text-left text-gray-700 hover:text-orange-500 font-medium px-4 py-2 rounded-md flex items-center justify-between ${
                          link.dropdown.some(item => location.pathname === item.href)
                            ? 'bg-orange-50 text-orange-500'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        {link.label}
                        <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {dropdownOpen && (
                        <div className="ml-4 mt-2 space-y-1">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={handleNavLinkClick}
                              className={`block text-gray-600 hover:text-orange-500 px-4 py-2 rounded-md text-sm ${
                                location.pathname === item.href
                                  ? 'bg-orange-50 text-orange-500'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={handleNavLinkClick}
                      className={`text-gray-700 hover:text-orange-500 font-medium px-4 py-2 rounded-md ${
                        location.pathname === link.href
                          ? 'bg-orange-50 text-orange-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
