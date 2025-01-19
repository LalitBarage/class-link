 
import React from "react";
import { NavLink } from "react-router-dom";

const FHome = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-gray-300 py-4 px-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold">DYP</h1>
        <nav>
          <ul className="flex space-x-4">
            
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Course cards */}
          {Array(8)
            .fill(0)
            .map((_, index) => (<NavLink to="/report">
              <div
                key={index}
                className="bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm"
              >
                <div className="w-full h-40 bg-gray-400 rounded-lg mb-4"></div>
                <p className="text-center font-medium">Course 1</p>
              </div>
              </NavLink>

            ))}
        </div>
      </main>
    </div>
  );
};

export default FHome;
