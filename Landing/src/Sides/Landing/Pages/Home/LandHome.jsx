import React from 'react'
import Hero from '../../components/Hero';
import LogoSlider from '../../components/LogoSlider';
import StackCards from '../../components/StackCards/StackCards';
import TargetCustomer from '../../components/TargetCustomer';
// import ContactUs from '../ContactPage/ContactUs';
import ParticlesComponent from '../../components/ParticlesComponent';  

const LandHome = () => {
  return (
    <>
    <ParticlesComponent /> {/* Add the particles background effect */}
    <Hero/>
    <StackCards />
      <LogoSlider />
      <TargetCustomer />
      {/* <ContactUs /> */}
    </>
  )
}

export default LandHome