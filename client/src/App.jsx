import React from 'react';
import Navbar from './Sides/Landing/components/Navbar';
import Bottomfootgutter from './Sides/Landing/components/Bottomfootgutter';
import LandHome from './Sides/Landing/Pages/Home/LandHome';

const App = () => {
  return (
    <>
      
      <Navbar />
    <LandHome/>
      <Bottomfootgutter />
    </>
  );
};

export default App;
