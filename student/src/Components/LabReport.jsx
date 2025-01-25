import React, { useEffect, useState, useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Context } from "../main";
import { useParams } from "react-router-dom";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const LabReport = () => {
  const [lectureCounts, setLectureCounts] = useState(null);
  const [error, setError] = useState(""); // Error state
  const { labid, studentId } = useParams(); // Destructure labid and studentId from URL
  const { user } = useContext(Context); // Assuming you have user context with _id

  const studentIdFromContext = user?._id; // Get the user ID from the context (if needed)

  useEffect(() => {
    const fetchLectureCounts = async () => {
      try {
        const response = await fetch(`http://localhost:4000/lab/${labid}/students/${studentIdFromContext}/lecture-counts`);
        const text = await response.text(); // Read the response as text
        console.log(text); // Log the raw response
    
        // Now, try parsing the response as JSON if it seems valid
        const data = JSON.parse(text);
        setLectureCounts(data.data); // Assuming the data is in the 'data' field
      } catch (error) {
        setError(error.message);
        console.error("Error fetching lecture counts:", error);
      }
    };

    fetchLectureCounts();
  }, [labid, studentIdFromContext]); // Dependency array includes labid and studentIdFromContext

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>; // Display error message
  }

  if (!lectureCounts) {
    return <div className="text-center py-4">Loading...</div>; // Show loading while fetching data
  }

  // Calculate percentage attendance
  const attendancePercentage = ((lectureCounts.attendedLabs / lectureCounts.totalLabs) * 100).toFixed(2);

  const chartData = {
    labels: ["Total Labs", "Attended Labs"],
    datasets: [
      {
        data: [lectureCounts.totalLabs, lectureCounts.attendedLabs],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF7996", "#6BA9E6"],
      },
    ],
  };

  return (
    <div className="h-fit-content bg-gray-100 flex justify-center py-8">
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">Lab Attendance Report</h2>

        <div className="flex justify-center mb-4">
          <Pie data={chartData} options={{ responsive: true }} />
        </div>

        {/* Display the percentage attendance */}
        <div className="text-center mt-4">
          <p className="text-xl font-medium">
            Attendance: <span className="font-bold text-blue-600">{attendancePercentage}%</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LabReport;
