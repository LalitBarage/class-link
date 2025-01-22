import React from "react";

const CourseReport = () => {
  const courses = [
    {
      id: 13,
      name: "Python Programming",
      year: "TY",
      section: "B",
      room: "T2",
      professor: "Prof. XYZ",
    },
    {
      id: 14,
      name: "Data Structures",
      year: "SY",
      section: "A",
      room: "R5",
      professor: "Prof. ABC",
    },
    {
      id: 15,
      name: "Web Development",
      year: "FY",
      section: "C",
      room: "R1",
      professor: "Prof. DEF",
    },
    {
      id: 16,
      name: "Machine Learning",
      year: "TY",
      section: "A",
      room: "T3",
      professor: "Prof. GHI",
    },
    {
      id: 17,
      name: "Operating Systems",
      year: "SY",
      section: "B",
      room: "R4",
      professor: "Prof. JKL",
    },
    {
      id: 18,
      name: "Database Management Systems",
      year: "FY",
      section: "A",
      room: "T1",
      professor: "Prof. MNO",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200">
    {/* Navbar */}
    <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex space-x-4">
        <select className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Select type</option>
          <option>Lecture</option>
          <option>Lab</option>
        </select>
        <select className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Select Start</option>
          <option>8:00 AM</option>
          <option>9:00 AM</option>
        </select>
        <select className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Select End</option>
          <option>9:00 AM</option>
          <option>10:00 AM</option>
        </select>
        <select className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Select Roll No</option>
          <option>1</option>
          <option>2</option>
        </select>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Search History
        </button>
      </div>
      <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Schedule Lab
      </button>
    </div>

    {/* Main Content */}
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Recent Courses</h1>
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center hover:shadow-lg transition"
          >
            {/* Left content */}
            <div>
              <p className="text-lg font-bold mb-2">{course.name}</p>
              <p className="text-sm text-gray-700">
                Year: <span className="font-medium">{course.year}</span>{" "}
                Section: <span className="font-medium">{course.section}</span>{" "}
                Room: <span className="font-medium">{course.room}</span>{" "}
                Professor: <span className="font-medium">{course.professor}</span>
              </p>
            </div>
            {/* Right button */}
            <button className="bg-black text-white px-4 py-2 rounded-md transition">
              Attendance
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};
export default CourseReport
