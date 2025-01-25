import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CoursePage = () => {
  const { courseId } = useParams(); // Get courseId from route
  const [lectures, setLectures] = useState([]); // List of lectures
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [newLecture, setNewLecture] = useState({ date: "", timeSlot: "" }); // Form state for new lecture
  const [addingLecture, setAddingLecture] = useState(false); // State for handling the button disabled state
  const navigate = useNavigate();

  // Move fetchLectures function outside of useEffect
  const fetchLectures = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/course/${courseId}/lecture`,
        { withCredentials: true }
      );

      // Extract lectures array from the response object
      const lectureData = Array.isArray(response.data.lectures)
        ? response.data.lectures
        : []; // Default to empty array if no lectures field or if it's not an array

      setLectures(lectureData); // Update state with the correct array
    } catch (err) {
      console.error("Error fetching lectures:", err);
      setError(`Failed to load lectures: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures(); // Fetch lectures when the component mounts
  }, [courseId]);

  const handleAddLecture = async () => {
    setAddingLecture(true); // Disable button during the API call
    try {
      const response = await axios.post(
        `http://localhost:4000/course/${courseId}/lecture`,
        newLecture, // Pass the new lecture data
        { withCredentials: true }
      );
      setLectures((prev) => [...prev, response.data]); // Add new lecture to the list
      setModalOpen(false); // Close modal after successful submission
      alert("Lecture added successfully!");
      fetchLectures(); // Fetch lectures again to ensure data is updated
    } catch (err) {
      alert(`Failed to add lecture: ${err.message}`);
    } finally {
      setAddingLecture(false); // Enable the button again
    }
  };

  const markAttendance = (lectureId) => {
    navigate(`/course/${courseId}/lecture/${lectureId}`, {
      state: { action: "mark" },
    });
  };

  const editAttendance = (lectureId) => {
    navigate(`/course/${courseId}/lecture/${lectureId}`, {
      state: { action: "edit" },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Course: {courseId}</h1>
        <button
          onClick={() => setModalOpen(true)} // Open modal on button click
          className="mb-4 bg-white text-black border-2 border-black px-2 py-1 rounded-lg"
        >
          Add Lecture
        </button>

        {loading ? (
          <p>Loading lectures...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : lectures.length === 0 ? (
          <p>No lectures available.</p>
        ) : (
          <ul className="space-y-4">
            {(lectures || []).map((lecture) => (
              <li
                key={lecture._id}
                className="bg-gray-100 p-4 rounded shadow cursor-pointer"
                // onClick={() => handleLectureClick(lecture._id)}
              >
                <div>
                  <p>
                    Lecture on {new Date(lecture.date).toLocaleDateString()}
                  </p>
                  {lecture.timeSlot && (
                    <p className="text-gray-500">
                      Time Slot: {lecture.timeSlot}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  {lecture.status ? (
                    <button
                      onClick={() => editAttendance(lecture._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Edit Attendance
                    </button>
                  ) : (
                    <button
                      onClick={() => markAttendance(lecture._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Mark Attendance
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for adding a lecture */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Lecture</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={newLecture.date}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="timeSlot" className="block text-sm font-medium">
                  Time Slot
                </label>
                <select
                  id="timeSlot"
                  value={newLecture.timeSlot}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, timeSlot: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a Time Slot</option>
                  <option value="9:15 am - 10:15 am">9:15 am - 10:15 am</option>
                  <option value="10:15 am - 11:15 am">
                    10:15 am - 11:15 am
                  </option>
                  <option value="11:30 am - 12:30 pm">
                    11:30 am - 12:30 pm
                  </option>
                  <option value="12:30 pm - 1:30 pm">12:30 pm - 1:30 pm</option>
                  <option value="2:15 pm - 3:15 pm">2:15 pm - 3:15 pm</option>
                  <option value="3:15 pm - 4:15 pm">3:15 pm - 4:15 pm</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md mr-5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddLecture}
                  className="bg-black text-white px-4 py-2 rounded-md"
                  disabled={addingLecture}
                >
                  {addingLecture ? "Adding..." : "Add Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
