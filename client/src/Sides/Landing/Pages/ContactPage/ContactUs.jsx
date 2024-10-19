import React from 'react';

const ContactForm = () => {
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form className=" p-8 rounded  w-full max-w-6xl" method='post' action='https://script.google.com/macros/s/AKfycbw54DoF1_yIZSHWNuhiw-u_CDJ62-lBhYxgEWlrhpkOpd1rnRxQUxsZR-28qk8SlY_6/exec'>
        <h2 className="text-2xl font-semibold mb-2">Schedule a Call</h2>
        <p className="text-gray-600 mb-6">
          Please drop your details here and our customer advisor will reach out to you for demo and other details
        </p>
        
        {/* Flex Container for Name, Phone, and Email */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
          name='Name'
            type="text"
            placeholder="Name"
            className="flex-1 px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b21a8]"
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
        value='Submit'
          type="submit"
          className=" bg-[#6b21a8] text-white py-2 rounded-full px-5 transition duration-200 hover:bg-[#440065]"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
