import React, { useState, useEffect } from 'react';
import Navbar from './Sides/Landing/components/Navbar';
import Bottomfootgutter from './Sides/Landing/components/Bottomfootgutter';
import LandHome from './Sides/Landing/Pages/Home/LandHome';
import PageTitle from './PageTitle';
import Loader from './Loader'; // Import Loader component
import StickyFooter from './Sides/Landing/components/footer/StickyFooter';

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
      <LandHome />
      {/* <Bottomfootgutter /> */}
      <StickyFooter />
    </>
  );
};

export default App;
