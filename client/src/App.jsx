import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion'; // Import framer-motion components
import Navbar from './Sides/Landing/components/Navbar';
import Bottomfootgutter from './Sides/Landing/components/Bottomfootgutter';
import LandHome from './Sides/Landing/Pages/Home/LandHome';
import PageTitle from './PageTitle';
import Loader from './Loader'; // Import Loader component
import StickyFooter from './Sides/Landing/components/footer/StickyFooter';

const App = () => {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll(); // Add scroll progress hook

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
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-red-500 transform origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      <PageTitle title="Welcome || AlumnLink" />
      <Navbar />
      <LandHome />
      {/* <Bottomfootgutter /> */}
      <StickyFooter />
    </>
  );
};

export default App;
