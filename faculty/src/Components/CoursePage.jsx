import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CoursePage = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newLecture, setNewLecture] = useState({ date: "", timeSlot: "" });
  const [addingLecture, setAddingLecture] = useState(false);
  const navigate = useNavigate();

  const fetchLectures = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/course/${courseId}/lecture`,
        { withCredentials: true }
      );
      const lectureData = Array.isArray(response.data.lectures)
        ? response.data.lectures
        : [];
      setLectures(lectureData);
    } catch (err) {
      setError(`Failed to load lectures: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const handleAddLecture = async () => {
    setAddingLecture(true);
    try {
      const response = await axios.post(
        `http://localhost:4000/course/${courseId}/lecture`,
        { ...newLecture, status: false }, // Default status to false
        { withCredentials: true }
      );
      setLectures((prev) => [...prev, response.data]);
      setModalOpen(false);
      alert("Lecture added successfully!");
    } catch (err) {
      alert(`Failed to add lecture: ${err.message}`);
    } finally {
      setAddingLecture(false);
    }
  };

  const markAttendance = async (lectureId) => {
    try {
      await axios.patch(
        `http://localhost:4000/course/${courseId}/lecture/${lectureId}/mark`,
        { status: true },
        { withCredentials: true }
      );
      alert("Attendance marked successfully!");
      fetchLectures(); // Refresh lectures
    } catch (err) {
      alert(`Failed to mark attendance: ${err.message}`);
    }
  };

  const editAttendance = (lectureId) => {
    navigate(`/course/${courseId}/lecture/${lectureId}/edit`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Course: {courseId}</h1>
        <button
          onClick={() => setModalOpen(true)}
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
            {lectures.map((lecture) => (
              <li
                key={lecture._id}
                className="bg-gray-100 p-4 rounded shadow"
              >
                <div>
                  <p>Lecture on {new Date(lecture.date).toLocaleDateString()}</p>
                  {lecture.timeSlot && (
                    <p className="text-gray-500">Time Slot: {lecture.timeSlot}</p>
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
                <input
                  type="text"
                  id="timeSlot"
                  value={newLecture.timeSlot}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, timeSlot: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md mr-5"
                >
                  Cancel
                </button>
                <button
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
