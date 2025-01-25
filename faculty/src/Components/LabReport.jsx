import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX library

const LabReport = () => {
  const { labId } = useParams(); // Get labId from URL
  const [attendanceData, setAttendanceData] = useState([]);
  const [labDates, setLabDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const fetchAttendanceAndDates = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch attendance data
        const response = await axios.get(
          `http://localhost:4000/lab/${labId}/attendance`,
          { withCredentials: true }
        );

        const labs = response.data.attendance;

        if (!Array.isArray(labs)) {
          throw new Error(
            "Invalid response: Expected an array in 'attendance'"
          );
        }

        const formattedData = formatAttendanceData(labs);
        setAttendanceData(formattedData);

        // Fetch dates for each labId
        const fetchedDates = await fetchLabDates(labs);
        setLabDates(fetchedDates);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(`Failed to fetch attendance: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (labId) {
      fetchAttendanceAndDates();
    }
  }, [labId]);

  const formatAttendanceData = (labs) => {
    const students = {};

    labs.forEach((lab) => {
      lab.students.forEach((student) => {
        if (!students[student.studentId]) {
          students[student.studentId] = {
            rollno: student.rollno,
            name: `${student.fullname.firstname} ${student.fullname.lastname}`,
            attendance: {},
          };
        }
        students[student.studentId].attendance[lab.labId] = student.status;
      });
    });

    return Object.values(students);
  };

  // Fetch dates for each labId
  const fetchLabDates = async (labs) => {
    const dates = {};
    const labIds = labs.map((lab) => lab.labId);

    // Fetch date for each labId
    for (let labId of labIds) {
      try {
        const dateResponse = await axios.get(
          `http://localhost:4000/lab/${labId}/date`
        );

        // Extract the date from the response
        const labDate = new Date(dateResponse.data.date);

        // Format the date to show day and month (DD-MM)
        const formattedDate = `${labDate.getDate()}-${labDate.getMonth() + 1}`;

        // Store the formatted date in the dates object
        dates[labId] = formattedDate;
      } catch (error) {
        console.error("Error fetching date:", error);
      }
    }

    return dates;
  };

  // Filter attendance data based on search query
  const filteredAttendanceData = attendanceData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to download the data as Excel file
  const downloadExcel = () => {
    // Prepare the table headers
    const headers = [
      "Roll No",
      "Name",
      ...Object.values(labDates), // Add lab dates as columns
    ];

    // Prepare the table rows
    const rows = filteredAttendanceData.map((student) => [
      student.rollno,
      student.name,
      ...Object.values(student.attendance), // Add attendance status for each lab
    ]);

    // Combine headers and rows
    const data = [headers, ...rows];

    // Create a worksheet from the data
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Create a workbook from the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    // Download the Excel file
    XLSX.writeFile(wb, "lab_attendance_report.xlsx");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">Lab Attendance Report</h1>

      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by student name"
          className="px-4 py-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Download button */}
      <div className="mb-4">
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download Excel
        </button>
      </div>

      {loading ? (
        <p>Loading attendance data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredAttendanceData.length === 0 ? (
        <p>No attendance data available or no results match your search.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b">Roll No</th>
                <th className="px-4 py-2 border-b">Name</th>
                {/* Render lab dates as table headers */}
                {Object.keys(filteredAttendanceData[0]?.attendance || {}).map(
                  (labId) => (
                    <th key={labId} className="px-4 py-2 border-b">
                      {labDates[labId] || "Unknown Date"}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceData.map((student) => (
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

export default LabReport;
