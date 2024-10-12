import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './Sides/Landing/DefaultLayout';
import LandHome from './Sides/Landing/Pages/Home/LandHome';
import PageTitle from './PageTitle';
import Loader from './Loader';

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
    <Router>
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
           
          
        </Routes>
      )}
    </Router>
  );
};

export default App;
