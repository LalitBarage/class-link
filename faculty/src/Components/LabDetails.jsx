import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const LabDetails = () => {
  const { labid, practicalId } = useParams(); // Get IDs from route
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
            `http://localhost:4000/lab/students/${labid}`,
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
            `http://localhost:4000/lab/${labid}/practical/${practicalId}/attendance`,
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
                rollno: record.rollno,
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
  }, [labid, practicalId, state?.action]);

  const handleAttendanceToggle = (studentId) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === studentId
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

  const updateAttendance = async () => {
    const payload = {
      labid,
      practicalId,
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
      console.log("Payload:", payload);
      const response = await axios.put(
        `http://localhost:4000/lab/${labid}/practical/${practicalId}/attendance`,
        payload,
        { withCredentials: true }
      );
      console.log("Update Response:", response.data);
      alert("Attendance updated successfully!");
    } catch (err) {
      console.error("Error updating attendance:", err.response?.data || err.message);
      alert(`Failed to update attendance: ${err.message}`);
    }
  };

  const handleSubmit = async () => {
    if (state?.action === "mark") {
      const payload = {
        labid,
        practicalId,
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
        console.log("Payload for Marking Attendance:", payload);
        const response = await axios.post(
          `http://localhost:4000/labid/${labid}/lecture/${practicalId}/attendance`,
          payload,
          { withCredentials: true }
        );
        console.log("Mark Response:", response.data);
        alert("Attendance submitted successfully!");
      } catch (err) {
        console.error("Error submitting attendance:", err.response?.data || err.message);
        alert(`Failed to submit attendance: ${err.message}`);
      }
    } else if (state?.action === "edit") {
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
                  key={student.studentId}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded shadow"
                >
                  <p>
                    {student.fullname.firstname} {student.fullname.lastname}
                  </p>
                  <button
                    onClick={() => handleAttendanceToggle(student.studentId)}
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

export default LabDetails;
