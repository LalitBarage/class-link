import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CoursePage = () => {
  const { courseId } = useParams(); // Get courseId from route
  const [lectures, setLectures] = useState([]); // List of lectures
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch previous lectures for the course
    const fetchLectures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/courses/${courseId}/lectures`,
          { withCredentials: true }
        );
        setLectures(response.data);
      } catch (err) {
        setError(`Failed to load lectures: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [courseId]);

  const handleAddLecture = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/courses/${courseId}/lectures`,
        { date: new Date().toISOString().split("T")[0] }, // Example payload
        { withCredentials: true }
      );
      setLectures((prev) => [...prev, response.data]); // Add new lecture to the list
      alert("Lecture added successfully!");
    } catch (err) {
      alert(`Failed to add lecture: ${err.message}`);
    }
  };

  const handleLectureClick = (lectureId) => {
    navigate(`/course/${courseId}/lecture/${lectureId}`); // Navigate to lecture details
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Course: {courseId}</h1>
        <button
          onClick={handleAddLecture}
          className="mb-4 bg-white text-black border-2 border-black px-2 py-1 rounded-lg"
        >
          Add Lecture
        </button>
        {loading ? (
          <p>Loading lectures...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : lectures.length === 0 ? (
          <p>No lectures available.</p>
        ) : (
          <ul className="space-y-4">
            {lectures.map((lecture) => (
              <li
                key={lecture._id}
                className="bg-gray-100 p-4 rounded shadow cursor-pointer"
                onClick={() => handleLectureClick(lecture._id)}
              >
                Lecture on {lecture.date}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
