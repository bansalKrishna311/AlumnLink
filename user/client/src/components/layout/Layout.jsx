import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Check if the current path is login or signup
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" ||  location.pathname === "/forgot-password";

  return (
    <div className='min-h-screen bg-base-100'>
      {/* Render Navbar only if the user is not on the login or signup page */}
      {!isAuthPage && <Navbar />}
      <main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
    </div>
  );
};

export default Layout;
