import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX library

const LabReport = () => {
  const { labid } = useParams(); // Get labId from URL
  const [attendanceData, setAttendanceData] = useState([]);
  const [practicalDates, setPracticalDates] = useState({});
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
          `http://localhost:4000/lab/${labid}/attendance`,
          { withCredentials: true }
        );

        const practicals = response.data.attendance;

        if (!Array.isArray(practicals)) {
          throw new Error("Invalid response: Expected an array in 'attendance'");
        }

        const formattedData = formatAttendanceData(practicals);
        setAttendanceData(formattedData);

        // Fetch dates for each labId
        const fetchedDates = await fetchPracticalDates(practicals);
        setPracticalDates(fetchedDates);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(`Failed to fetch attendance: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (labid) {
      fetchAttendanceAndDates();
    }
  }, [labid]);

  const formatAttendanceData = (practicals) => {
    const students = {};

    practicals.forEach((practical) => {
      practical.students.forEach((student) => {
        if (!students[student.studentId]) {
          students[student.studentId] = {
            rollno: student.rollno,
            name: `${student.fullname.firstname} ${student.fullname.lastname}`,
            attendance: {},
          };
        }
        students[student.studentId].attendance[practical.practicalId] = student.status;
      });
    });

    return Object.values(students);
  };

  const fetchPracticalDates = async (practicals) => {
    const dates = {}; // Object to store labId-date pairs
    const practicalIds = practicals.map((practical) => practical.practicalId);

    for (let practicalId of practicalIds) {
      try {
        const dateResponse = await axios.get(
          `http://localhost:4000/lab/practical/${practicalId}/date`
        );
        const practicalDate = new Date(dateResponse.data.date);
        const formattedDate = `${practicalDate.getDate()}-${practicalDate.getMonth() + 1}`;
        dates[practicalId] = formattedDate;
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
      headers = ["Roll No", "Name", "Total Labs", "Attended Labs", "Defaulter"];
      rows = data.map((student) => [
        student.rollno,
        student.name,
        student.totalLabs,
        student.attendedLabs,
        student.defaulter,
      ]);
    } else {
      headers = ["Roll No", "Name", ...Object.values(practicalDates)];
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
      const totalLabs = Object.keys(practicalDates).length;
      const attendedLabs = Object.values(student.attendance).filter(
        (status) => status === "Present"
      ).length;

      const attendancePercentage = (attendedLabs / totalLabs) * 100;

      return {
        rollno: student.rollno,
        name: student.name,
        totalLabs,
        attendedLabs,
        defaulter: attendancePercentage < 75 ? "Yes" : "No",
      };
    });
  };

  const defaultersData = calculateDefaulters().filter(
    (student) => student.defaulter === "Yes"
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">Lab Attendance Report</h1>

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
          onClick={() => downloadExcel(filteredAttendanceData, "lab_attendance_report")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download Attendance Excel
        </button>
        <button
          onClick={() => downloadExcel(defaultersData, "lab_defaulter_report", true)}
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
          <h2 className="text-xl font-bold mb-4">Attendance Report</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 border-b">Roll No</th>
                <th className="px-2 py-2 border-b">Name</th>
                {Object.keys(filteredAttendanceData[0]?.attendance || {}).map(
                  (practicalId) => (
                    <th key={practicalId} className="px-2 py-2 border-b">
                      {practicalDates[practicalId] || "Unknown Date"}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceData.map((student) => (
                <tr key={student.rollno}>
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

          <h2 className="text-xl font-bold mt-8">Defaulter Report</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 border-b">Roll No</th>
                <th className="px-2 py-2 border-b">Name</th>
                <th className="px-2 py-2 border-b">Total Labs</th>
                <th className="px-2 py-2 border-b">Attended Labs</th>
                <th className="px-2 py-2 border-b">Defaulter</th>
              </tr>
            </thead>
            <tbody>
              {defaultersData.map((student) => (
                <tr key={student.rollno}>
                  <td className="px-2 py-2 border-b">{student.rollno}</td>
                  <td className="px-2 py-2 border-b">{student.name}</td>
                  <td className="px-2 py-2 border-b">{student.totalLabs}</td>
                  <td className="px-2 py-2 border-b">{student.attendedLabs}</td>
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
        </>
      )}
    </div>
  );
};

export default LabReport;
