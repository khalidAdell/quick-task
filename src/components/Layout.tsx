import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const { pathname } = useLocation();
  const hideLayout = ["/login", "/register", "/forgot-password"].includes(
    pathname
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <div className="flex-grow">
        <Outlet />
      </div>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;
