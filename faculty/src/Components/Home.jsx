import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // Example course data
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

  const navigate = useNavigate();

  const handleCardClick = (courseId) => {
    navigate("/course"); // Navigate to the course route
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleCardClick(course.id)}
            >
              <p className="text-lg font-bold mb-2">{course.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
