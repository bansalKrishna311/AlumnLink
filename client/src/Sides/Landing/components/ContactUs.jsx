import React from "react";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl px-6 py-6 max-w-lg w-full transition-all duration-300 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 dark:text-purple-300 mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400 text-center mb-6">
          We'd love to hear from you! Fill out the form below to get in touch
          with us.
        </p>
        <form className="space-y-4">
          <div>
            <label className="block text-purple-800 dark:text-purple-300 font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-purple-800 dark:text-purple-300 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-purple-800 dark:text-purple-300 font-semibold mb-1">
              Phone Number
            </label>
            <div className="flex items-center border border-purple-300 dark:border-purple-600 rounded-md focus-within:ring-2 focus-within:ring-purple-400 dark:focus-within:ring-purple-500 transition duration-200">
              <select
                className="bg-transparent text-purple-800 dark:text-purple-300 px-2 py-2 sm:py-3 focus:outline-none focus:ring-0 border-none rounded-l-md"
                required
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+61">+61</option>
                <option value="+81">+81</option>
                <option value="+49">+49</option>
              </select>
              <input
                type="tel"
                placeholder="Enter your Phone Number"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-0 rounded-r-md dark:text-purple-300"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-purple-800 dark:text-purple-300 font-semibold mb-1">
              Message
            </label>
            <textarea
              placeholder="Enter your message"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 transition duration-200"
              rows="4"
              required
            ></textarea>
          </div>

          <button className="w-full bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-bold py-2 sm:py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
