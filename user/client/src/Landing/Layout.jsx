import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Footer from "./Components/Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      
     <main>
     <Outlet />
     </main>
     
      
      <Footer/>
      {/* <Hero /> */}
    </>
  );
};

export default Layout;
