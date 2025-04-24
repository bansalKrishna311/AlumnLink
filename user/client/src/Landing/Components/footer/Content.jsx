import React from "react";
import { PRODUCTS, RESOURCES, COMPANY, SUPPORT, Icons } from "./Menus";
import { motion } from "framer-motion";

const Content = () => {
  const Item = ({ Links, title }) => (
    <ul>
      <h1 className="mb-3 font-semibold text-white/90">{title}</h1>
      {Links.map((link) => (
        <li key={link.name}>
          <a
            className="text-white/70 hover:text-[#fe6019] duration-300 text-sm cursor-pointer leading-6"
            href={link.link}
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );

  const ItemsContainer = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-5 py-12">
      <Item Links={PRODUCTS} title="FEATURES" />
      <Item Links={RESOURCES} title="RESOURCES" />
      <Item Links={COMPANY} title="COMPANY" />
      <Item Links={SUPPORT} title="SUPPORT" />
    </div>
  );

  const SocialIcons = () => (
    <div className="flex justify-center space-x-5">
      {Icons.map((icon) => (
        <motion.a
          key={icon.name}
          href={icon.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 hover:text-[#fe6019] duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className={`fab ${icon.name}`}></i>
        </motion.a>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#fe6019] to-[#d14712] text-white shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Logo section */}
        <div className="flex flex-col items-center pt-12 pb-6 border-b border-white/10">
          <img src="/logo-white.png" alt="AlumnLink" className="h-10 mb-4" />
          <p className="text-white/70 text-sm max-w-md text-center">
            Connecting alumni communities through powerful networking tools and engagement solutions.
          </p>
        </div>
        
        <ItemsContainer />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-white/70 text-sm pb-8 px-5 border-t border-white/10">
          <span>© {new Date().getFullYear()} AlumnLink. All rights reserved.</span>
          <span>Terms · Privacy Policy</span>
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

export default Content;
