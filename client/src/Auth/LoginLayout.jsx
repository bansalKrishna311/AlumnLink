import React from "react";
import ParticlesComponent from "../Sides/Landing/components/ParticlesComponent";


const DefaultLayout = ({ children }) => {
  return (
    <div className="layout-container">
<ParticlesComponent/>
      <main className="content h-[100vh]  flex items-center justify-center relative overflow-hidden align-middle ">
        {children}
      </main>

    </div>
  );
};

export default DefaultLayout;
