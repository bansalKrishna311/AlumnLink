import React from "react";



const DefaultLayout = ({ children }) => {
  return (
    <div className="layout-container bg-[#ebeaea]">
      <main className="content h-[100vh]  flex items-center justify-center relative overflow-hidden align-middle ">
        {children}
      </main>

    </div>
  );
};

export default DefaultLayout;