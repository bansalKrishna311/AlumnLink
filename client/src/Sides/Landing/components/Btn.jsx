import React from 'react';
import { FiArrowRight } from 'react-icons/fi'; // Import icons from react-icons

const Btn = ({ text = 'Get Started', Icon = FiArrowRight }) => {
  return (
    <div>
      <a className="btn rounded-full max-w-lg px-5 transition-transform duration-300 ease-in-out hover:bg-secondary hover:text-white bg-started text-white flex items-center mx-4">
        {text} {/* Button text passed as prop */}
        <Icon className="ml-2 h-5 w-5" /> {/* Icon passed as prop */}
      </a>
    </div>
  );
};

export default Btn;
