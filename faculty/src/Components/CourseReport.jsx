import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";

const CourseReport = () => {
  const { courseId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [lectureDates, setLectureDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAttendanceAndDates = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://localhost:4000/course/${courseId}/attendance`,
          { withCredentials: true }
        );

        const lectures = response.data.attendance;
        if (!Array.isArray(lectures)) {
          throw new Error("Invalid response: Expected an array in 'attendance'");
        }

        const formattedData = formatAttendanceData(lectures);
        setAttendanceData(formattedData);

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
        students[student.studentId].attendance[lecture.lectureId] = student.status;
      });
    });
    return Object.values(students);
  };

  const fetchLectureDates = async (lectures) => {
    const dates = {};
    const lectureIds = lectures.map((lecture) => lecture.lectureId);

    for (let lectureId of lectureIds) {
      try {
        const dateResponse = await axios.get(
          `http://localhost:4000/course/lecture/${lectureId}/date`
        );
        const lectureDate = new Date(dateResponse.data.date);
        const formattedDate = `${lectureDate.getDate()}-${lectureDate.getMonth() + 1}`;
        dates[lectureId] = formattedDate;
      } catch (error) {
        console.error("Error fetching date:", error);
      }
    }
    return dates;
  };

  const filteredAttendanceData = attendanceData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadExcel = (data, fileName, isDefaulter = false) => {
    let headers, rows;

    if (isDefaulter) {
      // Headers for defaulter table
      headers = ["Roll No", "Name", "Total Lectures", "Attended Lectures", "Defaulter"];
      rows = data.map((student) => [
        student.rollno,
        student.name,
        student.totalLectures,
        student.attendedLectures,
        student.defaulter,
      ]);
    } else {
      // Headers for attendance table
      headers = ["Roll No", "Name", ...Object.values(lectureDates)];
      rows = data.map((student) => [
        student.rollno,
        student.name,
        ...Object.values(student.attendance || {}),
      ]);
    }

    const excelData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const calculateDefaulters = () => {
    return filteredAttendanceData.map((student) => {
      const totalLectures = Object.keys(lectureDates).length;
      const attendedLectures = Object.values(student.attendance).filter(
        (status) => status === "Present"
      ).length;

      const attendancePercentage =
        (attendedLectures / totalLectures) * 100;

      return {
        rollno: student.rollno,
        name: student.name,
        totalLectures,
        attendedLectures,
        defaulter: attendancePercentage < 75 ? "Yes" : "No",
      };
    });
  };

  const defaultersData = calculateDefaulters().filter(
    (student) => student.defaulter === "Yes"
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Report</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by student name"
          className="px-4 py-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => downloadExcel(filteredAttendanceData, "attendance_report")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download Attendance Excel
        </button>
        <button
          onClick={() => downloadExcel(defaultersData, "defaulter_report", true)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Download Defaulter Excel
        </button>
      </div>

      {loading ? (
        <p>Loading attendance data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Attendance Table */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 border-b">Roll No</th>
                  <th className="px-2 py-2 border-b">Name</th>
                  {Object.keys(filteredAttendanceData[0]?.attendance || {}).map(
                    (lectureId) => (
                      <th key={lectureId} className="px-2 py-2 border-b">
                        {lectureDates[lectureId] || "Unknown Date"}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredAttendanceData.map((student) => (
                  <tr key={student.rollno} className="hover:bg-gray-50">
                    <td className="px-2 py-2 border-b">{student.rollno}</td>
                    <td className="px-2 py-2 border-b">{student.name}</td>
                    {Object.values(student.attendance).map((status, index) => (
                      <td
                        key={index}
                        className={`px-2 py-2 border-b ${
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

          {/* Defaulter Table */}
          <h2 className="text-xl font-bold mb-4">Defaulter Report</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 border-b">Roll No</th>
                  <th className="px-2 py-2 border-b">Name</th>
                  <th className="px-2 py-2 border-b">Total Lectures</th>
                  <th className="px-2 py-2 border-b">Attended Lectures</th>
                  <th className="px-2 py-2 border-b">Defaulter</th>
                </tr>
              </thead>
              <tbody>
                {defaultersData.map((student) => (
                  <tr key={student.rollno} className="hover:bg-gray-50">
                    <td className="px-2 py-2 border-b">{student.rollno}</td>
                    <td className="px-2 py-2 border-b">{student.name}</td>
                    <td className="px-2 py-2 border-b">{student.totalLectures}</td>
                    <td className="px-2 py-2 border-b">{student.attendedLectures}</td>
                    <td
                      className={`px-2 py-2 border-b ${
                        student.defaulter === "Yes"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {student.defaulter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseReport;
