import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion'; // Import framer-motion components
import Navbar from './Sides/Landing/components/Navbar';
import Bottomfootgutter from './Sides/Landing/components/Bottomfootgutter';
import LandHome from './Sides/Landing/Pages/Home/LandHome';
import PageTitle from './PageTitle';
import Loader from './Loader'; // Import Loader component
import StickyFooter from './Sides/Landing/components/footer/StickyFooter';
import DefaultLayout from './Sides/Landing/DefaultLayout';

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
      
      <PageTitle title="Welcome || AlumnLink" />
      <DefaultLayout>
        <LandHome />
      </DefaultLayout>
    </>
  );
};

export default App;
