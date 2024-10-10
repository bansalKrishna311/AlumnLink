import React from 'react';

const ActionSection = () => {
  const actions = [
    'Accept Payments',
    'Make Payments',
    'Start Business Banking',
    'Get Credit Loans',
    'Automate Payroll',
  ];

  return (
    <div className='bg-base-[#ECF2FF]  pb-5 pt-14 sm:opacity-0 md:opacity-100 opacity-0'>
    <div className="flex items-center justify-start space-x-6 p-3 bg-white rounded-lg shadow-md overflow-x-auto mx-6 relative ">
      {/* Blue indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500 rounded-l-full"></div>
      
      <div className="flex items-center bg-blue-100 text-blue-500 rounded-full p-2 ml-6">
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m2 0a2 2 0 11-4 0 2 2 0 114 0z"
          />
        </svg>
        <span className="ml-2 mr-4 font-medium text-[12px] text-nowrap">I'm here to</span>
      </div>
      
      {actions.map((action, index) => (
        <button
          key={index}
          className="px-4 py-2 text-nowrap text-[12px] bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all"
        >
          {action}
        </button>
      ))}
        <div className="flex-grow"></div>
      <span className="text-gray-400 ml-auto text-nowrap whitespace-nowrap">
        Find the best product for your business
      </span>
    </div>
    </div>
  );
};

export default ActionSection;
