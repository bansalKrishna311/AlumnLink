import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./Sides/Landing/DefaultLayout";
import LandHome from "./Sides/Landing/Pages/Home/LandHome";
import PageTitle from "./PageTitle";
import Loader from "./Loader";
import SignUpPage from "./Auth/pages/SignUpPage";
import LoginPage from "./Auth/pages/LoginPage";
import EmailVerificationPage from "./Auth/pages/EmailVerificationPage";
import DashboardPage from "./Auth/pages/DashboardPage";
import ForgotPasswordPage from "./Auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./Auth/pages/ResetPasswordPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./Auth/store/authStore";
import LoginLayout from "./Auth/LoginLayout";
import ContactForm from "./Sides/Landing/Pages/ContactPage/ContactUs";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified)
    return <Navigate to="/dashboard" replace />;

  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth(); // Assuming checkAuth is a promise
      setLoading(false);
    };

    initializeAuth();
  }, [checkAuth]);

  if (loading || isCheckingAuth) return <Loader />;

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
            <DefaultLayout>
              <PageTitle title="Contact || AlumnLink" />
              <ContactForm/>
            </DefaultLayout>
          }
        />

        {/* Authentication Routes Wrapped in LoginLayout */}
        <Route
          path="/signup"
          element={
            <DefaultLayout>
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            </DefaultLayout>
          }
        />
        <Route
          path="/login"
          element={
            <DefaultLayout>
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            </DefaultLayout>
          }
        />
        <Route
          path="/verify-email"
          element={
            <LoginLayout>
              <EmailVerificationPage />
            </LoginLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <LoginLayout>
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            </LoginLayout>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <LoginLayout>
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            </LoginLayout>
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LoginLayout>
                <DashboardPage />
              </LoginLayout>
            </ProtectedRoute>
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
