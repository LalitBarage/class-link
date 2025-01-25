import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const LabPage = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newLab, setNewLab] = useState({ date: "", timeSlot: "", status: false });
  const [addingLab, setAddingLab] = useState(false);
  const navigate = useNavigate();
  const { labid } = useParams();

  const fetchLabs = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/lab/${labid}`, {
        withCredentials: true,
      });

      const labData = Array.isArray(response.data.labs)
        ? response.data.labs
        : [];
      setLabs(labData);
      console.log("Labs to be set:", labData);
    } catch (err) {
      setError(`Failed to load labs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, [labid]);

  const handleAddLab = async () => {
    setAddingLab(true);
    try {
      const response = await axios.post(
        `http://localhost:4000/lab/${labid}/lab`,
        { ...newLab, status: false },
        { withCredentials: true }
      );
      setLabs((prev) => [...prev, response.data]);
      setModalOpen(false);
      alert("Lab added successfully!");
    } catch (err) {
      alert(`Failed to add lab: ${err.message}`);
    } finally {
      setAddingLab(false);
    }
  };

  const handleLabClick = (labid) => {
    navigate(`/labs/${labid}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Labs</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="mb-4 bg-white text-black border-2 border-black px-2 py-1 rounded-lg"
        >
          Add Lab
        </button>

        {loading ? (
          <p>Loading labs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : labs.length === 0 ? (
          <p>No labs available.</p>
        ) : (
          <ul className="space-y-4">
  {labs.map((lab) => (
    <li
      key={lab._id}
      className="bg-gray-100 p-4 rounded shadow"
    >
      <div>
        <p>Lecture on {lab.date ? format(new Date(lab.date), "MMMM dd, yyyy") : "Invalid Date"}</p>
        {lab.timeSlot && (
          <p className="text-gray-500">Time Slot: {lab.timeSlot}</p>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        {lab.status === false ? (
          <button
            onClick={() => handleLabClick(labid)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Mark Attendance
          </button>
        ) : (
          <button
            onClick={() => handleEditAttendance(lab._id)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            
          >
            Edit Attendance
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
            <h2 className="text-xl font-semibold mb-4">Schedule Lab</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={newLab.date}
                  onChange={(e) =>
                    setNewLab({ ...newLab, date: e.target.value })
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
                  value={newLab.timeSlot}
                  onChange={(e) =>
                    setNewLab({ ...newLab, timeSlot: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
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
                  onClick={handleAddLab}
                  className="bg-black text-white px-4 py-2 rounded-md"
                  disabled={addingLab}
                >
                  {addingLab ? "Adding..." : "Add Lab"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabPage;
