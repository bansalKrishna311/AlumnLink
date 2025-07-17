import React from 'react';
import { Link } from 'react-router-dom';

// Test component to help verify 404 routing works
const Test404Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Test 404 Functionality
        </h1>
        <p className="text-gray-600 mb-6">
          Click these links to test if the 404 page shows up correctly:
        </p>
        
        <div className="space-y-3">
          <Link 
            to="/nonexistent-page" 
            className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Test: /nonexistent-page
          </Link>
          
          <Link 
            to="/dashboard/invalid" 
            className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Test: /dashboard/invalid
          </Link>
          
          <Link 
            to="/Landing/invalid" 
            className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Test: /Landing/invalid
          </Link>
          
          <Link 
            to="/admin/nonexistent" 
            className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Test: /admin/nonexistent
          </Link>
          
          <Link 
            to="/" 
            className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mt-6"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Test404Page;
