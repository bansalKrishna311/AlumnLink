import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Check if the current path is login, signup, forgot-password, or reset-password with any token
  const isAuthPage = location.pathname === "/login" || 
                     location.pathname === "/signup" || 
                     location.pathname === "/forgot-password" || 
                     location.pathname.startsWith("/reset-password/");

  // Scroll to top when the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className='min-h-screen bg-base-100'>
      {/* Render Navbar only if the user is not on the login, signup, or reset-password page */}
      {!isAuthPage && <Navbar />}
      <main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
    </div>
  );
};

export default Layout;
