import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LabDetails = () => {
  const { labid, practicalId } = useParams();
  const { state } = useLocation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        if (state?.action === "mark") {
          const response = await axios.get(
            `http://localhost:4000/lab/${labid}/students`,
            { withCredentials: true }
          );

          const students = response.data.students[0]?.students || [];
          const formattedData = students.map((student) => ({
            studentId: student.studentId || student._id,
            fullname: `${student.fullname.firstname} ${student.fullname.lastname}`,
            rollno: student.rollno,
            attended: true,
          }));

          setStudents(formattedData);
          setAttendanceData(
            formattedData.map((data) => ({
              studentId: data.studentId,
              fullname: data.fullname,
              rollno: data.rollno,
              status: "Present",
            }))
          );
        } else if (state?.action === "edit") {
          const response = await axios.get(
            `http://localhost:4000/lab/${labid}/practical/${practicalId}/attendance`,
            { withCredentials: true }
          );

          const fetchedAttendance = response.data.data?.students;
          if (fetchedAttendance) {
            setStudents(
              fetchedAttendance.map((record) => ({
                ...record,
                attended: record.status === "Present",
                fullname: `${record.fullname.firstname} ${record.fullname.lastname}`,
                studentId: record.studentId || record._id,
              }))
            );

            setAttendanceData(
              fetchedAttendance.map((record) => ({
                studentId: record.studentId || record._id,
                fullname: `${record.fullname.firstname} ${record.fullname.lastname}`,
                rollno: record.rollno,
                status: record.status,
              }))
            );
          } else {
            setError("No attendance data found.");
            toast.error("No attendance data found.");
          }
        } else {
          setError("Invalid action. Please try again.");
          toast.error("Invalid action. Please try again.");
        }
      } catch (err) {
        setError("Failed to fetch students. Please try again.");
        toast.error("Failed to fetch students. Please try again.");
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
              status: data.status === "Present" ? "Absent" : "Present",
            }
          : data
      )
    );
  };

  const handleSubmit = async () => {
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
      const endpoint =
        state?.action === "mark"
          ? `http://localhost:4000/lab/${labid}/practical/${practicalId}/attendance`
          : `http://localhost:4000/lab/${labid}/practical/${practicalId}/attendance`;

      const method = state?.action === "mark" ? "post" : "put";

      await axios[method](endpoint, payload, {
        withCredentials: true,
      });

      toast.success(
        state?.action === "mark"
          ? "Attendance submitted successfully!"
          : "Attendance updated successfully!"
      );
    } catch (err) {
      toast.error(`Failed to submit attendance: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
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
                  <p>{student.fullname}</p>
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
              className="mt-6 px-6 py-2 bg-black text-white rounded shadow"
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
