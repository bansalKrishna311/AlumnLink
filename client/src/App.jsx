
import React from 'react';
import Navbar from './Sides/Landing/components/Navbar';
import Bottomfootgutter from './Sides/Landing/components/Bottomfootgutter';
import LandHome from './Sides/Landing/Pages/Home/LandHome';
import React, { useState, useEffect } from 'react'; // Import useEffect for simulating loading
import Hero from './Sides/Landing/components/Hero';
import Navbar from './Sides/Landing/components/Navbar';
import PageTitle from './PageTitle';
import LogoSlider from './Sides/Landing/components/LogoSlider';
import StackCards from './Sides/Landing/components/StackCards/StackCards';
import Action from './Sides/Landing/components/Action';
import TargetCustomer from './Sides/Landing/components/TargetCustomer';
import Bottomfootgutter from './Sides/Landing/components/Bottomfootgutter';
import ContactUs from './Sides/Landing/components/ContactUs';
import Loader from './Loader'; // Import Loader component
import ParticlesComponent from './Sides/Landing/components/ParticlesComponent';


const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as necessary
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <PageTitle title="Welcome || AlumnLink" />
      <Navbar />
    <LandHome/>
      <Bottomfootgutter />
    </>
  );
};

export default App;
