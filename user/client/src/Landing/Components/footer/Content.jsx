import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Instagram } from "lucide-react";

const Content = () => {
  const companyLinks = [
    { name: "About", link: "/landing/about" },
    { name: "Contact", link: "/landing/contact" },
    { name: "Terms", link: "/landing/terms" },
    { name: "Privacy", link: "/landing/privacy" },
  ];

  const forWhoLinks = [
    { name: "For Institutes", link: "/landing/for-institutes" },
    { name: "For Corporates", link: "/landing/for-corporates" },
    { name: "For Schools", link: "/landing/for-schools" },
    { name: "For Alumni", link: "/landing/for-alumni" },
  ];

  const supportLinks = [
    { name: "Help Center", link: "#" },
    { name: "FAQs", link: "#" },
    { name: "Request Demo", link: "#" },
    { name: "Platform Status", link: "#" },
  ];

  const socialIcons = [
    { 
      name: "LinkedIn", 
      link: "https://www.linkedin.com/company/aumnlink/", 
      icon: <Linkedin size={20} />, 
      label: "LinkedIn",
      color: "#0077B5"
    },
    { 
      name: "Twitter", 
      link: "https://x.com/Alumn_Link", 
      icon: <Twitter size={20} />, 
      label: "Twitter (X)",
      color: "#000000"
    },
    { 
      name: "Instagram", 
      link: "https://www.instagram.com/alumnlink/", 
      icon: <Instagram size={20} />, 
      label: "Instagram",
      color: "#E4405F"
    },
  ];

  const FooterColumn = ({ title, links }) => (
    <div>
      <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.link}
              className="text-gray-600 hover:text-[#fe6019] duration-300 text-sm"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  const SocialIcons = () => (
    <div className="flex space-x-4">
      {socialIcons.map((social) => (
        <motion.a
          key={social.name}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gray-100 hover:text-white rounded-full flex items-center justify-center duration-300 transition-all group"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: social.color || '#fe6019'
          }}
          whileTap={{ scale: 0.95 }}
          title={`Follow AlumnLink on ${social.label}`}
          aria-label={`Follow AlumnLink on ${social.label}`}
        >
          <span className="text-gray-600 group-hover:text-white transition-colors duration-300">
            {social.icon}
          </span>
        </motion.a>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#f8f0ed] to-[#ffe8de] text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src="/logo copy.png" alt="AlumnLink" className="h-8 mb-4" />
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                Connecting alumni communities through powerful networking tools and engagement solutions. Building stronger institutional relationships across India.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-3">
                Follow Us
              </h4>
              <SocialIcons />
            </div>
          </div>

          {/* Company Links */}
          <FooterColumn title="Company" links={companyLinks} />

          {/* Target Audience Links */}
          <FooterColumn title="Solutions" links={forWhoLinks} />

          {/* Support Links */}
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#fe6019]/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              <span className="font-medium text-[#fe6019]">AlumnLink</span> - Transforming Alumni Networks Across India
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-gray-500">
              <span>&copy; 2025 AlumnLink. All rights reserved.</span>
              <span className="hidden md:block">|</span>
              <span>Leading Alumni Engagement Platform</span>
            </div>
          </div>
          
          {/* SEO Keywords Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Alumni Network Management | Professional Networking | Career Opportunities | 
              Alumni Directory | Educational Technology | Institutional Engagement | 
              Alumni Events | Mentorship Programs | University Alumni | College Alumni
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
