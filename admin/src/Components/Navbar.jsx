import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import { Context } from "../main";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setIsAuthenticated } = useContext(Context); // Access authentication state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activeStyle = {
    color: "#3B82F6",
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/admin/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false); // Set authentication state to false
     
    } catch (error) {
      console.error("Failed to log out:", error);
     
    }
  };

  // Check if the user is authenticated
  const isAuthenticated = Boolean(user);

  return (
    <>
      {isAuthenticated && ( // Render only if the user is authenticated
        <div className="bg-gray-200 shadow-lg">
          <div className="h-20 flex justify-between items-center px-5 md:px-10">
            {/* Logo Section */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">DYP</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-10">
              <NavLink
                to="/"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                className={({ isActive }) =>
                  `hover:text-blue-500 ${isActive ? "bold" : ""}`
                }
              >
                Course
              </NavLink>
              <NavLink
                to="/addlab"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                className={({ isActive }) =>
                  `hover:text-blue-500 ${isActive ? "bold" : ""}`
                }
              >
                Lab
              </NavLink>
              <NavLink
                to="/student"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                className={({ isActive }) =>
                  `hover:text-blue-500 ${isActive ? "bold" : ""}`
                }
              >
                Student
              </NavLink>
              <NavLink
                to="/faculty"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                className={({ isActive }) =>
                  `hover:text-blue-500 ${isActive ? "bold" : ""}`
                }
              >
                Faculty
              </NavLink>

              <NavLink
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-blue-500"
              >
                <FaSignOutAlt />
              </NavLink>
            </div>

            {/* Hamburger Menu for Mobile */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-3xl focus:outline-none"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="flex flex-col items-center gap-4 py-4 bg-gray-100 shadow-md md:hidden">
              <NavLink
                to="/"
                style={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }
                onClick={toggleMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/course"
                style={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }
                onClick={toggleMenu}
              >
                Course
              </NavLink>
              <NavLink
                to="/addlab"
                style={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }
                onClick={toggleMenu}
              >
                Lab
              </NavLink>
              <NavLink
                to="/student"
                style={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }
                onClick={toggleMenu}
              >
                Student
              </NavLink>
              <NavLink
                to="/faculty"
                style={({ isActive }) =>
                  isActive ? activeStyle : undefined
                }
                onClick={toggleMenu}
              >
                Faculty
              </NavLink>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
