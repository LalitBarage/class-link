import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";

const LectureDetails = () => {
  const { courseId, lectureId } = useParams(); // Get IDs from route
  const { state } = useLocation(); // Get state from navigate
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        console.log("Fetching students...");
        let response;
        if (state?.action === "mark") {
          response = await axios.get(
            `http://localhost:4000/course/students/${courseId}`,
            { withCredentials: true }
          );
          setStudents(
            response.data.students.map((student) => ({
              ...student,
              attended: false, // Default status for marking attendance
            }))
          );
          setAttendanceData(
            response.data.students.map((student) => ({
              studentId: student._id,
              fullname: `${student.fullname.firstname} ${student.fullname.lastname}`,
              rollno: student.rollno,
              status: "Present", // Default status
            }))
          );
        } else if (state?.action === "edit") {
          response = await axios.get(
            `http://localhost:4000/course/${courseId}/lecture/${lectureId}/attendance`,
            { withCredentials: true }
          );
          const fetchedAttendance = response.data.attendance;
          setStudents(
            fetchedAttendance.map((record) => ({
              ...record.student,
              attended: record.status === "Present",
            }))
          );
          setAttendanceData(
            fetchedAttendance.map((record) => ({
              studentId: record.student._id,
              fullname: `${record.student.fullname.firstname} ${record.student.fullname.lastname}`,
              status: record.status,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId, lectureId, state?.action]);

  const handleAttendanceToggle = (studentId) => {
    setStudents((prev) =>
      prev.map((student) =>
        student._id === studentId
          ? { ...student, attended: !student.attended }
          : student
      )
    );

    setAttendanceData((prev) =>
      prev.map((data) =>
        data.studentId === studentId
          ? {
              ...data,
              status: data.status === "Present" ? "Present" : "Absent",
            }
          : data
      )
    );
  };

  const handleSubmit = async () => {
    const payload = {
      courseId, // Extracted from useParams
      lectureId, // Extracted from useParams
      students: attendanceData.map((data) => ({
        studentId: data.studentId,
        fullname: {
          firstname: data.fullname.split(" ")[0], // Extract firstname
          lastname: data.fullname.split(" ")[1], // Extract lastname
        },
        rollno: data.rollno,
        status: data.status,
      })),
    };
  
    try {
      await axios.post(
        `http://localhost:4000/course/${courseId}/lecture/${lectureId}/attendance`,
        payload,
        { withCredentials: true }
      );
      alert("Attendance submitted successfully!");
    } catch (err) {
      console.error("Error submitting attendance:", err);
      alert(`Failed to submit attendance: ${err.message}`);
    }
  };
  

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {state?.action === "mark" ? "Mark Attendance" : "Edit Attendance"}
        </h1>
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
