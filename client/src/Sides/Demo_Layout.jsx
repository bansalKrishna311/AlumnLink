import React from 'react';
import ParticlesComponent from './Landing/components/ParticlesComponent';


const  Demo_Layout = ({ children }) => {
  return (
    <div className="layout-container">
     <ParticlesComponent/>
      <main className="content h-[100vh]">{children}</main>
      
    </div>
  );
};

export default Demo_Layout;
