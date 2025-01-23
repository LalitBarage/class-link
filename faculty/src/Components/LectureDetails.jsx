import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LectureDetails = () => {
  const { courseId, lectureId } = useParams(); // Get IDs from route
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch students for the lecture
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/courses/${courseId}/lectures/${lectureId}/students`,
          { withCredentials: true }
        );
        setStudents(response.data);
      } catch (err) {
        setError(`Failed to load students: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId, lectureId]);

  const handleAttendanceToggle = async (studentId) => {
    try {
      await axios.put(
        `http://localhost:4000/courses/${courseId}/lectures/${lectureId}/attendance`,
        { studentId },
        { withCredentials: true }
      );
      setStudents((prev) =>
        prev.map((student) =>
          student._id === studentId
            ? { ...student, attended: !student.attended }
            : student
        )
      );
    } catch (err) {
      alert(`Failed to update attendance: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Lecture Details</h1>
        {loading ? (
          <p>Loading students...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-4">
            {students.map((student) => (
              <li key={student._id} className="flex items-center justify-between bg-gray-100 p-4 rounded shadow">
                <p>{student.name}</p>
                <button
                  onClick={() => handleAttendanceToggle(student._id)}
                  className={`px-4 py-2 rounded ${
                    student.attended ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {student.attended ? "Present" : "Absent"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LectureDetails;
