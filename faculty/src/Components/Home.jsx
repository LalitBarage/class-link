import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]); // State to store courses or labs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [view, setView] = useState("courses"); // Default view set to "courses"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(""); // Reset error state
      try {
        const endpoint =
          view === "courses"
            ? "http://localhost:4000/faculty/assignedcourses"
            : "http://localhost:4000/faculty/assignedLabs";

        const response = await axios.get(endpoint, { withCredentials: true });

        // Access the appropriate data property
        if (response.data[view] && Array.isArray(response.data[view])) {
          setData(response.data[view]);
        } else {
          setData([]); // Default to an empty array if no data
        }
      } catch (err) {
        setError(`Failed to fetch ${view}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]); // Re-run fetch when view changes

  const handleCardClick = (id) => {
    navigate(`/${view === "courses" ? "course" : "lab"}/${id}`); // Navigate based on view
  };

  const handleReportClick = (id) => {
    navigate(`/${view === "courses" ? "course" : "lab"}/${id}/report`); // Navigate to report page
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView("courses")}
            className={`px-2 py-1 rounded-lg ${
              view === "courses"
                ? "bg-white border-2 border-black text-black"
                : "bg-white"
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setView("labs")}
            className={`px-2 py-1 rounded-lg ${
              view === "labs"
                ? "bg-white border-2 border-black text-black"
                : "bg-white"
            }`}
          >
            Labs
          </button>
        </div>

        {loading ? (
          <p>Loading {view}...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.id || item.courseId || item.labid}
                className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <p className="text-lg font-bold mb-2">
                  {item.courseName || item.labname}
                </p>
                <p className="text-sm">
                  Year: {item.year} <br /> Division: {item.division}
                </p>
                <div className="flex gap-1 mt-4">
                  {/* Add button */}
                  <button
                    onClick={() => handleCardClick(item.courseId || item.labid)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md"
                  >
                    Lecture
                  </button>
                  {/* Document button */}
                  <button
                    onClick={() =>
                      handleReportClick(item.courseId || item.labid)
                    }
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md"
                  >
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
