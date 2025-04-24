import React from "react";
import { PRODUCTS, RESOURCES, COMPANY, SUPPORT, Icons } from "./Menus";

const Content = () => {
  const Item = ({ Links, title }) => (
    <ul>
      <h1 className="mb-1 font-semibold">{title}</h1>
      {Links.map((link) => (
        <li key={link.name}>
          <a
            className="text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6"
            href={link.link}
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );

  const ItemsContainer = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-5 py-16">
      <Item Links={PRODUCTS} title="PRODUCTS" />
      <Item Links={RESOURCES} title="RESOURCES" />
      <Item Links={COMPANY} title="COMPANY" />
      <Item Links={SUPPORT} title="SUPPORT" />
    </div>
  );

  const SocialIcons = () => (
    <div className="flex justify-center space-x-4">
      {Icons.map((icon) => (
        <a
          key={icon.name}
          href={icon.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-teal-400 duration-300"
        >
          <i className={`fab ${icon.name}`}></i>
        </a>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-900 text-white">
      <ItemsContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-gray-400 text-sm pb-8 px-5">
        <span>© 2020 Appy. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <SocialIcons />
      </div>
    </div>
  );
};

export default Content;
