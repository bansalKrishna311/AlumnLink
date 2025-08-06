import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Welcoming Section with Image */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mb-10 p-6 bg-white shadow-lg rounded-xl">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-[40px] font-extrabold text-blue-700">Welcome, Super Admin!</h1>
          <p className="text-lg text-gray-600 mt-4">
            Take control of your system with powerful administrative tools. Manage institutes, corporates, schools, and leads seamlessly, create new admins, and analyze reports with ease.
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Stay ahead with real-time insights, user management, comprehensive lead tracking, and global system settings. Your complete command center is here!
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img 
            src="/super/supp.jpg"
            alt="Super Admin" 
            className="rounded-xl  w-full"
          />
        </div>
      </div>
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Link to="/lead-dashboard" className="p-6 bg-indigo-100 shadow-lg rounded-xl text-center hover:bg-indigo-200 transition-colors">
          <h2 className="text-xl font-semibold text-indigo-900">Lead Dashboard</h2>
          <p className="text-gray-700">Overview of sales pipeline and activities</p>
        </Link>
        <Link to="/lead-management" className="p-6 bg-violet-100 shadow-lg rounded-xl text-center hover:bg-violet-200 transition-colors">
          <h2 className="text-xl font-semibold text-violet-900">Lead Management</h2>
          <p className="text-gray-700">Track and manage sales leads and prospects</p>
        </Link>
        <Link to="/Institute-List" className="p-6 bg-blue-100 shadow-lg rounded-xl text-center hover:bg-blue-200 transition-colors">
          <h2 className="text-xl font-semibold text-blue-900">Institute Management</h2>
          <p className="text-gray-700">Add, edit, and remove institutes</p>
        </Link>
        <Link to="/corporate-List" className="p-6 bg-green-100 shadow-lg rounded-xl text-center hover:bg-green-200 transition-colors">
          <h2 className="text-xl font-semibold text-green-900">Corporate Management</h2>
          <p className="text-gray-700">Manage corporate clients and accounts</p>
        </Link>
        <Link to="/School-List" className="p-6 bg-yellow-100 shadow-lg rounded-xl text-center hover:bg-yellow-200 transition-colors">
          <h2 className="text-xl font-semibold text-yellow-900">School Management</h2>
          <p className="text-gray-700">Handle school registrations and data</p>
        </Link>
        <Link to="/create-admin" className="p-6 bg-purple-100 shadow-lg rounded-xl text-center hover:bg-purple-200 transition-colors">
          <h2 className="text-xl font-semibold text-purple-900">New Admin Creation</h2>
          <p className="text-gray-700">Create and assign new admins</p>
        </Link>
        <Link to="/contact-requests" className="p-6 bg-red-100 shadow-lg rounded-xl text-center hover:bg-red-200 transition-colors">
          <h2 className="text-xl font-semibold text-red-900">Contact Requests</h2>
          <p className="text-gray-700">Manage contact form submissions</p>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminPage;