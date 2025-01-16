import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Student = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const handleClassSelect = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleDivisionSelect = (event) => {
    setSelectedDivision(event.target.value);
  };

  const handleSelect = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleAddStudent = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to save the new student data here
    console.log("New student added");
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
              placeholder="Search course....."
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
              value="Add Student"
              className="bg-black text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-gray-800"
              onClick={handleAddStudent}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Roll No</th>
              <th className="border border-gray-300 px-4 py-2">PRN No</th>
              <th className="border border-gray-300 px-4 py-2">Student Name</th>
              <th className="border border-gray-300 px-4 py-2">Class</th>
              <th className="border border-gray-300 px-4 py-2">Division</th>
              <th className="border border-gray-300 px-4 py-2">Mobile No</th>
              <th className="border border-gray-300 px-4 py-2">
                Student Email
              </th>
              <th className="border border-gray-300 px-4 py-2">Parent Name</th>
              <th className="border border-gray-300 px-4 py-2">Parent No</th>
              <th className="border border-gray-300 px-4 py-2">Parent Email</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Rows */}
            <tr className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">201</td>
              <td className="border border-gray-300 px-4 py-2">PRN12345</td>
              <td className="border border-gray-300 px-4 py-2">John Doe</td>
              <td className="border border-gray-300 px-4 py-2">B.Tech</td>
              <td className="border border-gray-300 px-4 py-2">A</td>
              <td className="border border-gray-300 px-4 py-2">9876543210</td>
              <td className="border border-gray-300 px-4 py-2">
                john@example.com
              </td>
              <td className="border border-gray-300 px-4 py-2">Jane Doe</td>
              <td className="border border-gray-300 px-4 py-2">9876543211</td>
              <td className="border border-gray-300 px-4 py-2">
                jane@example.com
              </td>
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
        <p className="text-gray-600">Showing 2 out of 100 entries</p>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Student</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="studentFName"
                  name="studentFName"
                  placeholder="First Name"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="studentMName"
                  name="studentMName"
                  placeholder="Middle Name"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  placeholder="Last Name"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
              </div>

              <input
                type="email"
                id="stuEmail"
                name="stuEmail"
                placeholder="Student Email"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              <input
                type="text"
                id="monileNo"
                name="mobileNo"
                placeholder="Student Mobile No"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  placeholder="Roll No"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="prnNo"
                  name="prnNo"
                  placeholder="PRN No"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
              </div>

              <div className="flex gap-2 mb-2">
                {/* Class Dropdown */}
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

                {/* Division Dropdown */}
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

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="parentFNmame"
                  name="parentFNmame"
                  placeholder="Parent First Name"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="parentLNmame"
                  name="parentLNmame"
                  placeholder="Parent Last Name"
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
              </div>

              <input
                type="email"
                id="parEmail"
                name="praEmail"
                placeholder="Parent Email"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              <input
                type="text"
                id="pmobileNo"
                name="pmobileNo"
                placeholder="Parent Mobile No"
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="reset"
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

export default Student;
