import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [courses, setCourses] = useState([]); // State to store courses
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/faculty/assignedcourses",
          { withCredentials: true }
        );
        // Access the "courses" property
        if (response.data.courses && Array.isArray(response.data.courses)) {
          setCourses(response.data.courses);
        } else {
          setCourses([]); // Default to an empty array if courses is missing
        }
      } catch (err) {
        setError(`Failed to fetch courses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId) => {
    navigate(`/course/${courseId}`); // Navigate to the course-specific page
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Courses / Labs</h1>
        {loading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => handleCardClick(course.courseId)}
              >
                <p className="text-lg font-bold mb-2">{course.courseName}</p>
                <p className="text-sm">
                  Year: {course.year} <br /> Division: {course.division}
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
