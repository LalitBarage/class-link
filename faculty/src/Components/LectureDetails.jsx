import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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

        let response;
        if (state?.action === "mark") {
          response = await axios.get(
            `http://localhost:4000/course/students/${courseId}`,
            { withCredentials: true }
          );

          if (response.data?.students) {
            setStudents(
              response.data.students.map((student) => ({
                ...student,
                attended: true, // Default to Present for marking attendance
                studentId: student.studentId || student._id, // Ensure studentId is correctly mapped
              }))
            );
            setAttendanceData(
              response.data.students.map((student) => ({
                studentId: student.studentId || student._id, // Ensure studentId is correctly mapped
                fullname: `${student.fullname.firstname} ${student.fullname.lastname}`,
                rollno: student.rollno,
                status: "Present", // Default status to Present
              }))
            );
          } else {
            setError("No students data found.");
          }
        } else if (state?.action === "edit") {
          response = await axios.get(
            `http://localhost:4000/course/${courseId}/lecture/${lectureId}/attendance`,
            { withCredentials: true }
          );

          const fetchedAttendance = response.data.data?.students;
          if (fetchedAttendance) {
            setStudents(
              fetchedAttendance.map((record) => ({
                ...record,
                attended: record.status === "Present", // Correct status mapping
                studentId: record.studentId || record._id, // Ensure studentId is correctly mapped
              }))
            );
            setAttendanceData(
              fetchedAttendance.map((record) => ({
                studentId: record.studentId || record._id, // Ensure studentId is correctly mapped
                fullname: `${record.fullname.firstname} ${record.fullname.lastname}`,
                status: record.status,
              }))
            );
          } else {
            setError("No attendance data found.");
          }
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
              status: data.status === "Present" ? "Absent" : "Present", // Toggle between Present and Absent
            }
          : data
      )
    );
  };

  // This method will be used for updating attendance
  const updateAttendance = async () => {
    const payload = {
      courseId,
      lectureId,
      students: attendanceData.map((data) => ({
        studentId: data.studentId,
        fullname: {
          firstname: data.fullname.split(" ")[0], // Extract firstname
          lastname: data.fullname.split(" ")[1], // Extract lastname
        },
        rollno: data.rollno,
        status: data.status, // Ensure the correct status is being sent
      })),
    };

    try {
      await axios.put(
        `http://localhost:4000/course/${courseId}/lecture/${lectureId}/attendance`,
        payload,
        { withCredentials: true }
      );
      alert("Attendance updated successfully!");
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert(`Failed to update attendance: ${err.message}`);
    }
  };

  const handleSubmit = async () => {
    if (state?.action === "mark") {
      // Mark attendance logic
      const payload = {
        courseId,
        lectureId,
        students: attendanceData.map((data) => ({
          studentId: data.studentId,
          fullname: {
            firstname: data.fullname.split(" ")[0],
            lastname: data.fullname.split(" ")[1],
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
    } else if (state?.action === "edit") {
      // Call updateAttendance when in edit mode
      updateAttendance();
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
              {state?.action === "mark"
                ? "Submit Attendance"
                : "Update Attendance"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LectureDetails;
