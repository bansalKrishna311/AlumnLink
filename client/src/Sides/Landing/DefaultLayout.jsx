  import React from 'react';
  import Navbar from './components/Navbar';
  import StickyFooter from './components/footer/StickyFooter';

  const DefaultLayout = ({ children }) => {
    return (
      <div className="layout-container]">
        <Navbar />
        <main className="content h-[100vh] ">{children}</main>
        <StickyFooter />
      </div>
    );
  };

  export default DefaultLayout;
