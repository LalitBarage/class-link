import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Faculty = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddFaculty = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to save the new faculty data here
    console.log("New faculty added");
    setShowForm(false);
  };

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
              className="bg-gray-100 border rounded-md p-2 shadow-sm w-64"
            />
            <input
              type="button"
              value="Search"
              className="bg-black text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-gray-800"
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
              <th className="border border-gray-300 px-4 py-2">Qualification</th>
              <th className="border border-gray-300 px-4 py-2">Designation</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Rows */}
            <tr className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">201</td>
              <td className="border border-gray-300 px-4 py-2">Barage Lalit</td>
              <td className="border border-gray-300 px-4 py-2">CSE</td>
              <td className="border border-gray-300 px-4 py-2">lalit@example.com</td>
              <td className="border border-gray-300 px-4 py-2">1234567890</td>
              <td className="border border-gray-300 px-4 py-2">MBA</td>
              <td className="border border-gray-300 px-4 py-2">HOD</td>
              <td className="flex border border-gray-300 px-4 py-2 text-center">
                <button className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600 flex items-center gap-2">
                  <FaEdit />
                </button>
                <button className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center gap-2">
                  <FaTrash />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">Showing 1 out of 100 entries</p>
      </div>

      {/* Popup Form */}
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
                <option value="ECE">DATA SCIENCE</option>
                <option value="MECH">ELECTRICAL</option>
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
    </div>
  );
};

export default Faculty;
