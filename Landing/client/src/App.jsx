import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./Sides/Landing/DefaultLayout";
import LandHome from "./Sides/Landing/Pages/Home/LandHome";
import PageTitle from "./PageTitle";
import Loader from "./Loader";
import ContactForm from "./Sides/Landing/Pages/ContactPage/ContactUs";
import Demo_Layout from './Sides/Demo_Layout';
import { Toaster } from "react-hot-toast";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading if needed
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Routes>
        {/* Main Landing Route */}
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
          path="/Request-Demo"
          element={
            <Demo_Layout>
              <PageTitle title="Contact || AlumnLink" />
              <ContactForm />
            </Demo_Layout>
          }
        />

  

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
