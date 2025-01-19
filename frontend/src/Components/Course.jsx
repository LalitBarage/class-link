import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Course = () => {
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]); // State to store courses
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    facultyId: "",
    class: "",
    division: "",
  });
  const [selectedCourse, setSelectedCourse] = useState(null); // State for the course to delete
  const [showDeletePopup, setShowDeletePopup] = useState(false); // State for showing delete popup
  const [showEditForm, setShowEditForm] = useState(false); // State for showing edit popup

  const handleAddCourse = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewCourse({
      courseName: "",
      facultyId: "",
      class: "",
      division: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCourses((prev) => [...prev, newCourse]); // Add the new course to the list
    setShowForm(false);
    setNewCourse({
      courseName: "",
      facultyId: "",
      class: "",
      division: "",
    }); // Reset form fields
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = () => {
    setCourses((prev) => prev.filter((c) => c !== selectedCourse));
    setShowDeletePopup(false);
    setSelectedCourse(null);
  };

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
    setSelectedCourse(null);
  };

  const handleEditClick = (course) => {
    setNewCourse(course);
    setShowEditForm(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setCourses((prev) =>
      prev.map((c) => (c === newCourse ? newCourse : c))
    ); // Update the course in the list
    setShowEditForm(false);
    setNewCourse({
      courseName: "",
      facultyId: "",
      class: "",
      division: "",
    }); // Reset form fields
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
    setNewCourse({
      courseName: "",
      facultyId: "",
      class: "",
      division: "",
    });
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
              placeholder="Search Course....."
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
              value="Add Course"
              className="bg-black text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-gray-800"
              onClick={handleAddCourse}
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
              <th className="border border-gray-300 px-4 py-2">Course Name</th>
              <th className="border border-gray-300 px-4 py-2">Class</th>
              <th className="border border-gray-300 px-4 py-2">Division</th>
              <th className="border border-gray-300 px-4 py-2">Faculty Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {course.courseName}
                </td>
                <td className="border border-gray-300 px-4 py-2">{course.class}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {course.division}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {course.facultyId}
                </td>
                <td className="flex border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600 flex items-center gap-2"
                    onClick={() => handleEditClick(course)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                    onClick={() => handleDeleteClick(course)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Showing {courses.length} out of {courses.length} entries
        </p>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
               
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={newCourse.courseName}
                  onChange={handleInputChange}
                  placeholder="Course Name"
                  required
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                
                <input
                  type="text"
                  id="facultyId"
                  name="facultyId"
                  value={newCourse.facultyId}
                  onChange={handleInputChange}
                  placeholder="Faculty ID"
                  required
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
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

      {/* Edit Popup */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={newCourse.courseName}
                  onChange={handleInputChange}
                  placeholder="Course Name"
                  required
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  id="facultyId"
                  name="facultyId"
                  value={newCourse.facultyId}
                  onChange={handleInputChange}
                  placeholder="Faculty ID"
                  required
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={handleEditCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this course?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDeleteConfirm}
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

export default Course;