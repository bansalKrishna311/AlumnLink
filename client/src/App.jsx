import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './Sides/Landing/DefaultLayout';
import LandHome from './Sides/Landing/Pages/Home/LandHome';
import PageTitle from './PageTitle';
import Loader from './Loader';
import LoginPage from './Sides/Landing/components/Login/Signup/LoginPage';

const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as necessary
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          {/* Root Route */}
          <Route
            path="/"
            element={
              <DefaultLayout>
                <PageTitle title="Welcome || AlumnLink" />
                <LandHome />
              </DefaultLayout>
            }
          />
          <Route
          path='/Get-Started'
         element={
              
              <>
                <PageTitle title="Get Started || AlumnLink" />
                <LoginPage />
            
              </>
            }/>
          {/* Additional routes can be added here */}
        </Routes>
      )}
    </>
  );
};

export default App;
