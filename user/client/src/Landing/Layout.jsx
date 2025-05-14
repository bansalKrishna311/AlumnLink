import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import StickyFooter from "./Components/footer/StickyFooter";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <StickyFooter />
    </div>
  );
};

export default Layout;
