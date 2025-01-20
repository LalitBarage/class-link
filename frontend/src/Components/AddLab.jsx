import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const AddLab = () => {
  const [labs, setLabs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentLab, setCurrentLab] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [formData, setFormData] = useState({
    labid: "",
    facultyid: "",
    strollno: "",
    endrollno: "",
    department: "",
    division: "",
    class: "",
    labname: "",
    batch: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch("http://localhost:4000/lab/all");
        if (response.ok) {
          const data = await response.json();
          setLabs(data.labs); // Populate labs state with the fetched array of labs
        } else {
          console.error("Failed to fetch labs:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    fetchLabs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeptSelect = (e) => setSelectedDepartment(e.target.value);
  const handleClassSelect = (e) => setSelectedClass(e.target.value);
  const handleDivisionSelect = (e) => setSelectedDivision(e.target.value);

  // Handle Add or Edit Lab
  const handleAddOrEditLab = async () => {
    const updatedFormData = {
      ...formData,
      department: selectedDepartment,
      division: selectedDivision,
      class: selectedClass,
    };

    const url = currentLab === null ? "http://localhost:4000/lab/create" : `http://localhost:4000/lab/update/${formData.labid}`;
    const method = currentLab === null ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const newLab = await response.json();
        if (currentLab !== null) {
          const updatedLabs = labs.map((lab, index) =>
            index === currentLab ? newLab.lab : lab
          );
          setLabs(updatedLabs);
        } else {
          setLabs([...labs, newLab.lab]);
        }

        setShowAddModal(false);
        setFormData({
          labid: "",
          facultyid: "",
          strollno: "",
          endrollno: "",
          department: "",
          division: "",
          class: "",
          labname: "",
          batch: "",
        });
        setSelectedDepartment("");
        setSelectedClass("");
        setSelectedDivision("");
        setCurrentLab(null);
      } else {
        console.error("Failed to add/update lab:", await response.text());
      }
    } catch (error) {
      console.error("Error adding/updating lab:", error);
    }
  };

  // Handle Delete Lab
  const handleDeleteLab = async () => {
    try {
      const response = await fetch(`http://localhost:4000/lab/delete/${labs[currentLab].labid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLabs(labs.filter((_, index) => index !== currentLab));
        setShowDeleteModal(false);
        setCurrentLab(null);
      } else {
        console.error("Failed to delete lab:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting lab:", error);
    }
  };

  // Handle Search
  

  // Search logic
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtering labs based on search query
  const filteredLabs = labs.filter((lab) => {
    const query = searchQuery.toLowerCase();
    return (
      lab.labname?.toLowerCase().includes(query) ||
      lab.labid?.toLowerCase().includes(query) ||
      lab.department?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search lab..."
              className="bg-gray-100 border rounded-md p-2 shadow-sm w-64"
              
              onChange={handleSearch}
            />
          </div>

          <button
            className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800"
            onClick={() => setShowAddModal(true)}
          >
            Add Lab
          </button>
        </div>
      </div>
      <div className="mt-8">
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100 text-sm font-semibold">
              <th className="px-4 py-3 border border-gray-300">ID</th>
              <th className="px-4 py-3 border border-gray-300">Lab Name</th>
              <th className="px-4 py-3 border border-gray-300">Class</th>
              <th className="px-4 py-3 border border-gray-300">Division</th>
              <th className="px-4 py-3 border border-gray-300">Batch</th>
              <th className="px-4 py-3 border border-gray-300">Faculty</th>
              <th className="px-4 py-3 border border-gray-300 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {filteredLabs.length > 0 ? (
  filteredLabs.map((lab, index) => (
    <tr
      key={lab._id}
      className="hover:bg-gray-100 border-b border-gray-300"
    >
      <td className="px-4 py-3 border border-gray-300">{lab.labid}</td>
      <td className="px-4 py-3 border border-gray-300">{lab.labname}</td>
      <td className="px-4 py-3 border border-gray-300">{lab.class}</td>
      <td className="px-4 py-3 border border-gray-300">{lab.division}</td>
      <td className="px-4 py-3 border border-gray-300">{lab.batch}</td>
      <td className="px-4 py-3 border border-gray-300">{lab.facultyid}</td>
      <td className="px-4 py-3 border border-gray-300 text-center">
        <div className="flex justify-center items-center gap-2">
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
            onClick={() => {
              setCurrentLab(lab._id); // Use lab._id for currentLab
              setFormData(lab);
              setShowAddModal(true);
            }}
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
            onClick={() => {
              setCurrentLab(lab._id); // Use lab._id for currentLab
              setShowDeleteModal(true);
            }}
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="7" className="text-center px-4 py-3">No labs available</td>
  </tr>
)}

          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Showing {labs.length} out of {labs.length} entries
        </p>
      </div>

      {/* Add/Edit Lab Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {currentLab !== null ? "Edit Lab" : "Add Lab"}
            </h2>
            <div className="mb-2">
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-gray-100"
                name="labid"
                placeholder="Lab ID"
                value={formData.labid}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-gray-100"
                name="facultyid"
                placeholder="Faculty ID"
                value={formData.facultyid}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-4 mb-2">
              <input
                type="number"
                className="w-full p-3 border rounded-md bg-gray-100"
                name="strollno"
                placeholder="Start Roll No"
                value={formData.strollno}
                onChange={handleInputChange}
              />
              <input
                type="number"
                className="w-full p-3 border rounded-md bg-gray-100"
                name="endrollno"
                placeholder="End Roll No"
                value={formData.endrollno}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-2 mb-2">
              <select
                id="department"
                value={selectedDepartment}
                onChange={handleDeptSelect}
                className="w-full bg-gray-100 border rounded-md p-2"
              >
                <option value="" disabled>
                  Department
                </option>
                <option value="CSE">CSE</option>
                <option value="DS">DATA SCIENCE</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="CIVIL">CIVIL</option>
              </select>
              <select
                id="class"
                value={selectedClass}
                onChange={handleClassSelect}
                className="w-full bg-gray-100 border rounded-md p-2"
              >
                <option value="" disabled>
                  Select Class
                </option>
                <option value="FY">FY</option>
                <option value="SY">SY</option>
                <option value="TY">TY</option>
                <option value="B.Tech">B.Tech</option>
              </select>
              <select
                id="division"
                value={selectedDivision}
                onChange={handleDivisionSelect}
                className="w-full bg-gray-100 border rounded-md p-2"
              >
                <option value="" disabled>
                  Select Division
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-gray-100"
                name="labname"
                placeholder="Lab Name"
                value={formData.labname}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-gray-100"
                name="batch"
                placeholder="Batch"
                value={formData.batch}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded-md"
                onClick={handleAddOrEditLab}
              >
                {currentLab !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lab Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold">Are you sure you want to delete this lab?</h2>
            <div className="mt-4 flex gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteLab}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLab;
