import React from 'react';
import { FiArrowRight } from "react-icons/fi"; // Import the FiArrowRight icon

const ContactForm = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="p-8 rounded bg-white shadow-md w-full max-w-6xl"
        method='post'
        action='https://script.google.com/macros/s/AKfycbw54DoF1_yIZSHWNuhiw-u_CDJ62-lBhYxgEWlrhpkOpd1rnRxQUxsZR-28qk8SlY_6/exec'
      >
        <h2 className="text-2xl font-semibold mb-2">Schedule a Call</h2>
        <p className="text-gray-600 mb-6">
          Please drop your details here and our customer advisor will reach out to you for demo and other details.
        </p>

        {/* Flex Container for Name, Phone, and Email */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            name='Name'
            type="text"
            placeholder="Name"
            className="flex-1 px-4 py-4 border border-gray-300 caret-black rounded focus:outline-none focus:ring-2 focus:ring-[#6b21a8]"
            required
          />
          <input
            name='Phone Number'
            type="tel"
            placeholder="Phone Number"
            className="flex-1 px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b21a8]"
            required
          />
          <input
            name='Email'
            type="email"
            placeholder="Email Address"
            className="flex-1 px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b21a8]"
            required
          />
        </div>

        {/* Textarea for Message */}
        <div className="mb-4">
          <textarea
            name='Message'
            placeholder="Enter your message"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b21a8]"
            required
          ></textarea>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit" // Set button type to submit
          className="justify-center group btn rounded-full max-w-lg transition-transform duration-300 ease-in-out hover:bg-secondary hover:text-white bg-started text-white flex items-center px-8 py-3 relative"
        >
          <span className="group-hover:translate-x-40 text-center transition duration-500">
            Get Started
          </span>
          <div className="-translate-x-40 group-hover:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            <FiArrowRight className="h-5 w-5" />
          </div>
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
