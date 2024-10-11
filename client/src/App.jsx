import React from 'react';
import Hero from './Sides/Landing/components/Hero';
import Navbar from './Sides/Landing/components/Navbar';
import LogoSlider from './Sides/Landing/components/LogoSlider';
import StackCards from './Sides/Landing/components/StackCards/StackCards';
import CardSlider from './Sides/Landing/components/CardSlider';
import Action from './Sides/Landing/components/Action';
import TargetCustomer from './Sides/Landing/components/TargetCustomer';
import Bottomfootgutter from './Sides/Landing/components/Bottomfootgutter';
import ContactUs from './Sides/Landing/components/ContactUs';
import ParticlesComponent from './Sides/Landing/components/ParticlesComponent';  t

const App = () => {
  return (
    <>
      <ParticlesComponent /> {/* Add the particles background effect */}
      <Navbar />
      <Hero />
      <StackCards />
      <LogoSlider />
      <TargetCustomer />
      <ContactUs />
      <Bottomfootgutter />
    </>
  );
};

export default App;
