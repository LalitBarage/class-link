import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activeStyle = {
    color: "#2F5F98",
  };

  return (
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
            DashBoard
          </NavLink>
          <NavLink
            to="/course"
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
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-3xl focus:outline-none">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="flex flex-col items-center gap-4 py-4 bg-gray-100 shadow-md md:hidden">
          <NavLink
            to="/"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={toggleMenu}
          >
            DashBoard
          </NavLink>
          <NavLink
            to="/course"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={toggleMenu}
          >
            Course
          </NavLink>
          <NavLink
            to="/addlab"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={toggleMenu}
          >
            Lab
          </NavLink>
          <NavLink
            to="/student"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={toggleMenu}
          >
            Student
          </NavLink>
          <NavLink
            to="/faculty"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={toggleMenu}
          >
            Faculty
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;
