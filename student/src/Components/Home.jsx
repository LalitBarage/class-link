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
            ? "http://localhost:4000/student/course"
            : "http://localhost:4000/student/lab";

        const response = await axios.get(endpoint, { withCredentials: true });

        // Check if response contains course or lab data
        if (
          view === "courses" &&
          response.data &&
          Array.isArray(response.data.course)
        ) {
          setData(response.data.course); // Set course data
        } else if (
          view === "labs" &&
          response.data &&
          Array.isArray(response.data.lab)
        ) {
          setData(response.data.lab); // Set lab data
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
    navigate(`/${view === "courses" ? "course" : "lab"}/${id}/report`); // Navigate to report page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-6 py-8">
        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView("courses")}
            className={`px-4 py-2 rounded-lg ${
              view === "courses"
                ? "bg-black text-white border-2 border-black"
                : "bg-white text-black border-2 border-gray-300"
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setView("labs")}
            className={`px-4 py-2 rounded-lg ${
              view === "labs"
                ? "bg-black text-white border-2 border-black"
                : "bg-white text-black border-2 border-gray-300"
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
                key={item._id}
                onClick={() => handleCardClick(item.courseId || item.labid)} // Handle click for both courses and labs
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
              >
                <p className="text-lg font-bold mb-2">
                  {item.courseName || item.labname}
                </p>
                <p className="text-sm text-gray-600">
                  Department: {item.department} <br />
                  Year: {item.year} <br />
                  Division: {item.division}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
