import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const navigationLinks = [
    { label: 'About', href: '/Landing/about' },
    { 
      label: 'Solutions', 
      href: '#',
      subItems: [
        { label: 'For Institutes', href: '/Landing/for-institutes' },
        { label: 'For Corporates', href: '/Landing/for-corporates' },
        { label: 'For Schools', href: '/Landing/for-schools' },
        { label: 'For Alumni', href: '/Landing/for-alumni' }
      ]
    },
    { label: 'Contact', href: '/Landing/contact' }
  ];

  const socialLinks = [
    { 
      icon: <Linkedin size={20} />, 
      href: 'https://www.linkedin.com/company/aumnlink/', 
      label: 'LinkedIn',
      color: '#0077B5'
    },
    { 
      icon: <Twitter size={20} />, 
      href: 'https://x.com/Alumn_Link', 
      label: 'Twitter (X)',
      color: '#000000'
    },
    { 
      icon: <Instagram size={20} />, 
      href: 'https://www.instagram.com/alumnlink/', 
      label: 'Instagram',
      color: '#E4405F'
    }
  ];

  return (
    <motion.footer 
      className="bg-gray-900 text-white py-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex flex-wrap gap-6 text-sm">
              {navigationLinks.map((link, index) => (
                <div key={index} className="group">
                  {link.href === '#' ? (
                    <motion.span
                      className="text-gray-300 hover:text-[#fe6019] transition-colors duration-200 font-medium cursor-default"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.label}
                    </motion.span>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-[#fe6019] transition-colors duration-200 font-medium"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )}
                  {link.subItems && (
                    <div className="mt-2 ml-4 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {link.subItems.map((subItem, subIndex) => (
                        <motion.div
                          key={subIndex}
                          whileHover={{ x: 5 }}
                        >
                          <Link
                            to={subItem.href}
                            className="block text-xs text-gray-400 hover:text-[#fe6019] transition-colors duration-200"
                          >
                            {subItem.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex justify-start md:justify-end items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 group"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      backgroundColor: social.color || '#fe6019'
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Follow AlumnLink on ${social.label}`}
                    title={`Follow us on ${social.label}`}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-3 max-w-xs">
                Stay updated with the latest alumni networking trends and platform updates.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="border-t border-gray-800 pt-16"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-8">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-[#fe6019]">AlumnLink</h3>
              <p className="text-xs text-gray-400 mt-1">Connecting Alumni Communities</p>
            </motion.div>

            {/* Copyright */}
            <motion.div
              className="text-xs text-gray-400 text-center sm:text-right"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p>&copy; 2025 AlumnLink. All rights reserved.</p>
              <p className="mt-1">Building stronger alumni networks across India</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;