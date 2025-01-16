import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <NavLink to="/" className="hover:text-blue-500">
            DashBoard
          </NavLink>
          <NavLink to="/course" className="hover:text-blue-500">
            Course
          </NavLink>
          <NavLink to="/lab" className="hover:text-blue-500">
            Lab
          </NavLink>
          <NavLink to="/student" className="hover:text-blue-500">
            Student
          </NavLink>
          <NavLink to="/faculty" className="hover:text-blue-500">
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
          <NavLink to="/" className="hover:text-blue-500" onClick={toggleMenu}>
            DashBoard
          </NavLink>
          <NavLink
            to="/course"
            className="hover:text-blue-500"
            onClick={toggleMenu}
          >
            Course
          </NavLink>
          <NavLink
            to="/lab"
            className="hover:text-blue-500"
            onClick={toggleMenu}
          >
            Lab
          </NavLink>
          <NavLink
            to="/student"
            className="hover:text-blue-500"
            onClick={toggleMenu}
          >
            Student
          </NavLink>
          <NavLink
            to="/faculty"
            className="hover:text-blue-500"
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
