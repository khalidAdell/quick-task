import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-[#f4b860]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-[#F4B860] hover:text-[#e3a24f] transition"
          >
            QuickTask
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-[#F4B860] transition-all font-medium
                  ${
                    isActive ? "text-[#F4B860] border-b-2 border-[#F4B860]" : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-[#F4B860] transition-all font-medium
                  ${
                    isActive ? "text-[#F4B860] border-b-2 border-[#F4B860]" : ""
                  }`
                }
              >
                Browse Tasks
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-[#F4B860] transition-all font-medium
                  ${
                    isActive ? "text-[#F4B860] border-b-2 border-[#F4B860]" : ""
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-[#F4B860] transition-all font-medium
                  ${
                    isActive ? "text-[#F4B860] border-b-2 border-[#F4B860]" : ""
                  }`
                }
              >
                Profile
              </NavLink>
              <NavLink
                to="/post-task"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-[#F4B860] transition-all font-medium
                  ${
                    isActive ? "text-[#F4B860] border-b-2 border-[#F4B860]" : ""
                  }`
                }
              >
                Post Task
              </NavLink>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 ml-6 border-l border-gray-200 pl-6">
              <Link
                to="/login"
                className="text-gray-600 hover:text-[#F4B860] flex items-center gap-2 group"
              >
                <FaUserCircle className="text-xl" />
                <span className="font-medium">Sign In</span>
              </Link>
              <Link
                to="/register"
                className="bg-[#F4B860] hover:bg-[#e3a24f] text-white px-5 py-2.5 rounded-lg 
                  font-medium transition-all transform hover:scale-[1.02] shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#F4B860] hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute w-full bg-white shadow-lg z-50 left-0 right-0">
            <div className="px-4 pt-2 pb-6 space-y-4">
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#F4B860] py-2 font-medium"
              >
                Home
              </NavLink>
              <NavLink
                to="/tasks"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#F4B860] py-2 font-medium"
              >
                Browse Tasks
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#F4B860] py-2 font-medium"
              >
                About
              </NavLink>

              <div className="pt-4 border-t border-gray-100 space-y-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-gray-600 hover:text-[#F4B860] py-2 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-[#F4B860] hover:bg-[#e3a24f] text-white py-2.5 rounded-lg font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
