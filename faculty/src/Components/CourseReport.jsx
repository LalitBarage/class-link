import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseReport = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [attendanceData, setAttendanceData] = useState([]);
  const [lectureDates, setLectureDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendanceAndDates = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch attendance data
        const response = await axios.get(
          `http://localhost:4000/course/${courseId}/attendance`,
          { withCredentials: true }
        );

        const lectures = response.data.attendance;

        if (!Array.isArray(lectures)) {
          throw new Error(
            "Invalid response: Expected an array in 'attendance'"
          );
        }

        const formattedData = formatAttendanceData(lectures);
        setAttendanceData(formattedData);

        // Fetch dates for each lectureId
        const fetchedDates = await fetchLectureDates(lectures);
        setLectureDates(fetchedDates);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(`Failed to fetch attendance: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchAttendanceAndDates();
    }
  }, [courseId]);

  const formatAttendanceData = (lectures) => {
    const students = {};

    lectures.forEach((lecture) => {
      lecture.students.forEach((student) => {
        if (!students[student.studentId]) {
          students[student.studentId] = {
            rollno: student.rollno,
            name: `${student.fullname.firstname} ${student.fullname.lastname}`,
            attendance: {},
          };
        }
        students[student.studentId].attendance[lecture.lectureId] =
          student.status;
      });
    });

    return Object.values(students);
  };

  // Fetch dates for each lectureId
  const fetchLectureDates = async (lectures) => {
    const dates = {};
    const lectureIds = lectures.map((lecture) => lecture.lectureId);

    // Fetch date for each lectureId
    for (let lectureId of lectureIds) {
      try {
        const dateResponse = await axios.get(
          `http://localhost:4000/course/lecture/${lectureId}/date`
        );
        dates[lectureId] = dateResponse.data.date; // Assuming the date is returned as a string
      } catch (err) {
        console.error(`Failed to fetch date for lecture ${lectureId}:`, err);
        dates[lectureId] = "Date not found"; // Fallback in case of error
      }
    }

    return dates;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Report</h1>
      {loading ? (
        <p>Loading attendance data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : attendanceData.length === 0 ? (
        <p>No attendance data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b">Roll No</th>
                <th className="px-4 py-2 border-b">Name</th>
                {/* Render lecture dates as table headers */}
                {Object.keys(attendanceData[0]?.attendance || {}).map(
                  (lectureId) => (
                    <th key={lectureId} className="px-4 py-2 border-b">
                      {lectureDates[lectureId] || "Unknown Date"}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student) => (
                <tr key={student.rollno} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-center">
                    {student.rollno}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {student.name}
                  </td>
                  {Object.values(student.attendance).map((status, index) => (
                    <td
                      key={index}
                      className={`px-4 py-2 border-b text-center ${
                        status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseReport;
