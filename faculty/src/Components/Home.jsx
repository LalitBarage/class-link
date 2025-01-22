import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [courses, setCourses] = useState([]); // State to hold courses
  const [loading, setLoading] = useState(true); // State to show loading
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Make a GET request to fetch courses
        const response = await axios.get("http://localhost:4000/faculty/assignedcourses", 
          { withCredentials: true } // Send cookies
        );
        setCourses(response.data); // Update courses state with response data
        setLoading(false); // Stop loading
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId) => {
    navigate(`/course/${courseId}`); // Navigate to the course route with ID
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Assigned Courses</h1>
        {loading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => handleCardClick(course.id)}
              >
                <p className="text-lg font-bold mb-2">{course.name}</p>
                <p className="text-sm">
                  Year: {course.year}, Section: {course.section}, Room: {course.room}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
