import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios"; // Add Axios for API calls
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify

const Faculty = () => {
  const [showForm, setShowForm] = useState(false);
  const [facultyData, setFacultyData] = useState([]); // Store faculty data
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for API errors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // Fetch data from the database when the component is mounted
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/faculty/list");

        // Access the array inside the `faculties` key
        const data = response.data.faculties;

        // Transform data to match the table structure
        const formattedData = data.map((faculty) => ({
          id: faculty.facultyId,
          name: `${faculty.fullname.firstname} ${faculty.fullname.middlename} ${faculty.fullname.lastname}`,
          email: faculty.email,
          mobile: faculty.mobileno,
          qualification: faculty.qualification,
          designation: faculty.designation,
          department: faculty.department,
        }));

        setFacultyData(formattedData); // Store the transformed data
      } catch (err) {
        console.error(err); // Log error for debugging
        setError("Failed to fetch faculty data");
        toast.error("Error fetching faculty data"); // Toastify error message
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData(); // Call the function to fetch data
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  const handleAddFaculty = () => {
    setShowForm(true); // Show form when Add Faculty button is clicked
  };

  const handleCloseForm = () => {
    setShowForm(false); // Hide form when Cancel is clicked
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  const filteredData = facultyData.filter((faculty) => {
    const query = searchQuery.toLowerCase();
    return (
      faculty.name.toLowerCase().includes(query) ||
      faculty.email.toLowerCase().includes(query) ||
      faculty.department.toLowerCase().includes(query)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect form data for faculty
    const formData = {
      fullname: {
        firstname: e.target.facultyFName.value,
        middlename: e.target.facultyMName.value,
        lastname: e.target.facultyLName.value,
      },
      email: e.target.facultyEmail.value,
      mobileno: e.target.facultyMobile.value,
      facultyId: e.target.facultyId.value,
      qualification: e.target.qualification.value,
      designation: e.target.designation.value,
      department: e.target.department.value,
      password: "pass@123", // Default password or generate dynamically
    };

    try {
      const response = await fetch("http://localhost:4000/faculty/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Faculty registered successfully:", data);
        setShowForm(false); // Close the form
        // Optionally, refresh the faculty list or display a success message
        toast.success("Faculty registered successfully!"); // Success notification
      } else {
        const errorData = await response.json();
        console.error("Error registering faculty:", errorData);
        toast.error("Failed to register faculty. Please try again."); // Error notification
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again later."); // Error notification
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!facultyToDelete) return;
    try {
      const response = await axios.delete(
        `http://localhost:4000/faculty/remove/${facultyToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Faculty deleted:", response.data);
      setFacultyData(
        facultyData.filter((faculty) => faculty.id !== facultyToDelete)
      );
      setShowConfirmModal(false); // Close the confirmation modal after deletion
      toast.success("Faculty deleted successfully!"); // Success notification
    } catch (error) {
      console.error("Error deleting faculty:", error);
      toast.error("Error deleting faculty."); // Error notification
      setShowConfirmModal(false); // Close the confirmation modal on error
    }
  };

  const openConfirmModal = (facultyId) => {
    setFacultyToDelete(facultyId);
    setShowConfirmModal(true); // Show the confirmation modal
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading text while fetching
  }

  if (error) {
    return <div>{error}</div>; // Show error message if any error occurs during fetching
  }

  return (
    <div className="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search faculty....."
              value={searchQuery}
              onChange={handleSearch} // Handle search query changes
              className="bg-gray-100 border rounded-md p-2 shadow-sm w-64"
            />
          </div>

          <div>
            <input
              type="button"
              value="Add Faculty"
              className="bg-black text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-gray-800"
              onClick={handleAddFaculty}
            />
          </div>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Faculty</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="facultyFName"
                  name="facultyFName"
                  placeholder="First Name:"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="facultyMName"
                  name="facultyMName"
                  placeholder="Middle Name:"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="facultyLName"
                  name="facultyLName"
                  placeholder="Last Name:"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
              </div>

              <input
                type="email"
                id="facultyEmail"
                name="facultyEmail"
                placeholder="Email:"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              <input
                type="text"
                id="facultyMobile"
                name="facultyMobile"
                placeholder="Mobile Number:"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              <input
                type="text"
                id="facultyId"
                name="facultyId"
                placeholder="Faculty Id:"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              <input
                type="text"
                id="qualification"
                name="qualification"
                placeholder="Qualification:"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              <input
                type="text"
                id="designation"
                name="designation"
                placeholder="Designation:"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              {/* Dropdown menu */}
              <select
                id="department"
                name="department"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="DS">DATA SCIENCE</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="CIVIL">CIVIL</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Table Section */}
      <div className="mt-8">
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Faculty Name</th>
              <th className="border border-gray-300 px-4 py-2">Department</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Mobile No</th>
              <th className="border border-gray-300 px-4 py-2">
                Qualification
              </th>
              <th className="border border-gray-300 px-4 py-2">Designation</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? ( // Use filteredData instead of facultyData
              filteredData.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {faculty.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {faculty.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {faculty.department}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {faculty.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {faculty.mobile}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {faculty.qualification}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {faculty.designation}
                  </td>
                  <td className="flex border border-gray-300 px-4 py-2 text-center">
                    <button className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600 flex items-center gap-2">
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                      onClick={() => openConfirmModal(faculty.id)} // Open confirmation modal
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center border border-gray-300 py-4"
                >
                  No faculty data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this faculty member?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowConfirmModal(false)} // Close the modal without deletion
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDelete} // Confirm deletion
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer /> {/* Add ToastContainer to render notifications */}
    </div>
  );
};

export default Faculty;
