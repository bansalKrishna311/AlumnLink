import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from './Sides/Landing/DefaultLayout';
import LandHome from './Sides/Landing/Pages/Home/LandHome';
import PageTitle from './PageTitle';
import Loader from './Loader';
import FloatingShape from './components/FloatingShape';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoadingSpinner from './components/LoadingSpinner';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as necessary
    checkAuth();
    return () => clearTimeout(timer);
  }, [checkAuth]);

  if (loading || isCheckingAuth) {
    return <Loader />;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
          <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
          <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
          <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

          <Routes>
            {/* Main Landing Route */}
            <Route path="/" element={<DefaultLayout><PageTitle title="Welcome || AlumnLink" /><LandHome /></DefaultLayout>} />

            {/* Authentication Routes */}
            <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
            <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
            <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />

            {/* Protected Dashboard Route */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* Additional Routes */}
            <Route path='/Get-Started' element={<><PageTitle title="Get Started || AlumnLink" /><LoginPage /></>} />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster />
        </div>
      )}
    </>
  );
};

export default App;
