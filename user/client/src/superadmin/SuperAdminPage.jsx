import React from 'react';
import Superimg from '../../public/super/supp.jpg'
const SuperAdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Welcoming Section with Image */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mb-10 p-6 bg-white shadow-lg rounded-xl">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-[40px] font-extrabold text-blue-700">Welcome, Super Admin!</h1>
          <p className="text-lg text-gray-600 mt-4">
            Take control of your system with powerful administrative tools. Manage institutes, corporates, and schools seamlessly, create new admins, and analyze reports with ease.
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Stay ahead with real-time insights, user management, and global system settings. Your command center is here!
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img 
            src={Superimg}
            alt="Super Admin" 
            className="rounded-xl  w-full"
          />
        </div>
      </div>
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="p-6 bg-blue-100 shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-semibold text-blue-900">Institute Management</h2>
          <p className="text-gray-700">Add, edit, and remove institutes</p>
        </div>
        <div className="p-6 bg-green-100 shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-semibold text-green-900">Corporate Management</h2>
          <p className="text-gray-700">Manage corporate clients and accounts</p>
        </div>
        <div className="p-6 bg-yellow-100 shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-semibold text-yellow-900">School Management</h2>
          <p className="text-gray-700">Handle school registrations and data</p>
        </div>
        <div className="p-6 bg-purple-100 shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-semibold text-purple-900">New Admin Creation</h2>
          <p className="text-gray-700">Create and assign new admins</p>
        </div>
        <div className="p-6 bg-red-100 shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-semibold text-red-900">Analytics & Reports</h2>
          <p className="text-gray-700">View detailed system analytics</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPage;