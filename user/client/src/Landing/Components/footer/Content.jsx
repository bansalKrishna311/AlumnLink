import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

const Content = () => {
  const companyLinks = [
    { name: "About", link: "#" },
    { name: "Contact", link: "#" },
    { name: "Terms", link: "#" },
  ];

  const forWhoLinks = [
    { name: "For Institutes", link: "#" },
    { name: "For Corporates", link: "#" },
    { name: "For Schools", link: "#" },
    { name: "For Alumni", link: "#" },
  ];

  const supportLinks = [
    { name: "FAQs", link: "#" },
    { name: "Request Demo", link: "#" },
  ];

  const socialIcons = [
    { name: "LinkedIn", link: "https://www.linkedin.com/company/aumnlink/", icon: <Linkedin size={20} />, label: "LinkedIn" },
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
          className="w-10 h-10 bg-gray-100 hover:bg-[#fe6019] text-gray-600 hover:text-white rounded-full flex items-center justify-center duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={social.label}
        >
          {social.icon}
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
              <span className="font-medium text-[#fe6019]">AlumnLink</span> - Transforming Alumni Networks
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
