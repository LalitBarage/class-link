import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LectureDetails = () => {
  const { courseId, lectureId } = useParams(); // Get IDs from route
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState([]); // Variable to store attendance details

  useEffect(() => {
    // Fetch students for the lecture
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/course/students/${courseId}`,
          { withCredentials: true }
        );
        // Set default 'attended' to true for each student and prepare the attendanceData array
        const studentsWithDefaultAttendance = response.data.students.map((student) => ({
          ...student,
          attended: true, // Default attendance
        }));
        setStudents(studentsWithDefaultAttendance);

        const initialAttendanceData = studentsWithDefaultAttendance.map((student) => ({
          studentId: student._id, // Use studentId for the required format
          status: "Present", // Default status
        }));
        setAttendanceData(initialAttendanceData);
      } catch (err) {
        setError(`Failed to load students: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId]);

  const handleAttendanceToggle = (studentId) => {
    setStudents((prev) =>
      prev.map((student) =>
        student._id === studentId
          ? { ...student, attended: !student.attended }
          : student
      )
    );

    // Update the attendanceData array
    setAttendanceData((prev) =>
      prev.map((data) =>
        data.studentId === studentId
          ? { ...data, status: data.status === "Present" ? "Absent" : "Present" }
          : data
      )
    );
  };

  const handleSubmit = async () => {
    console.log(attendanceData); // For debugging
    try {
      await axios.post(
        `http://localhost:4000/course/${courseId}/lecture/${lectureId}/attendance`,
        { students: attendanceData }, // Send data in the required format
        { withCredentials: true }
      );
      alert("Attendance submitted successfully!");
    } catch (err) {
      alert(`Failed to submit attendance: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Attendance</h1>
        {loading ? (
          <p>Loading students...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <ul className="space-y-4">
              {students.map((student) => (
                <li
                  key={student._id}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded shadow"
                >
                  <p>
                    {student.fullname.firstname} {student.fullname.lastname}
                  </p>
                  <button
                    onClick={() => handleAttendanceToggle(student._id)}
                    className={`px-4 py-2 rounded ${
                      student.attended
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {student.attended ? "Present" : "Absent"}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={handleSubmit}
              className="mt-6 px-6 py-2 bg-black justify-end text-white rounded shadow"
            >
              Submit Attendance
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LectureDetails;
