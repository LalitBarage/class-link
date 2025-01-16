import React from "react";
import bardiagram from "../assets/bardiagram.png";
import pichart from "../assets/Pichart.png";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="px-4">
      {/* Parent Container */}
      <div className="flex flex-wrap justify-evenly gap-6 mt-5">
        {/* Card 1 */}
        <div className="p-5 bg-gray-100 rounded-lg shadow-md w-full sm:w-[45%] md:w-[30%]">
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-xl font-semibold">Second Year</h1>
            <img src={bardiagram} alt="bardiagram" className="h-40 md:h-52" />
            <img src={pichart} alt="pichart" className="h-40 md:h-52" />
            <NavLink
              to="/details"
              className="text-blue-500 hover:underline font-medium"
            >
              View More
            </NavLink>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-gray-100 rounded-lg shadow-md w-full sm:w-[45%] md:w-[30%]">
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-xl font-semibold">Second Year</h1>
            <img src={bardiagram} alt="bardiagram" className="h-40 md:h-52" />
            <img src={pichart} alt="pichart" className="h-40 md:h-52" />
            <NavLink
              to="/details"
              className="text-blue-500 hover:underline font-medium"
            >
              View More
            </NavLink>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-gray-100 rounded-lg shadow-md w-full sm:w-[45%] md:w-[30%]">
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-xl font-semibold">Second Year</h1>
            <img src={bardiagram} alt="bardiagram" className="h-40 md:h-52" />
            <img src={pichart} alt="pichart" className="h-40 md:h-52" />
            <NavLink
              to="/details"
              className="text-blue-500 hover:underline font-medium"
            >
              View More
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
