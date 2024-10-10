import React from "react";

const ContactUs = () => {
  return (
    <div className="h-screen flex items-start justify-center pt-16 pb-px">
      <div className="bg-white rounded-lg shadow-xl px-6 py-4 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-purple-800 mb-4 text-center">
          Login Now!
        </h1>
        <p className="text-md text-gray-600 text-center mb-4">
          Unlock exclusive content and connect with us by logging in.
        </p>
        <form className="space-y-3">
          <div>
            <label className="block text-purple-800 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-purple-800 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200"
              required
            />
            <div className="text-right mt-1">
              <a href="#" className="text-sm text-purple-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 rounded-lg transition duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
