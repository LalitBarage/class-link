import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Course = () => {
  const [showForm, setShowForm] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const handleDeptSelect = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleClassSelect = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleDivisionSelect = (e) => {
    setSelectedDivision(e.target.value);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      courseName: e.target.courseName.value,
      courseId: e.target.courseId.value,
      department: e.target.department.value,
      year: e.target.class.value,
      division: e.target.division.value,
      facultyId: e.target.facultyId.value,
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/course/update/${editingCourse.courseId}`,
        updatedData
      );

      if (response.status === 200) {
        toast.success("Course updated successfully!");
        setCourseData((prevData) =>
          prevData.map((course) =>
            course.courseId === editingCourse.courseId
              ? { ...course, ...updatedData }
              : course
          )
        );
        setShowForm(false);
        setEditingCourse(null);
      } else {
        toast.error("Failed to update course.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Network error. Please try again.");
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/course/list");
        const data = response.data.courses;

        const formattedData = data.map((course) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          department: course.department,
          year: course.year,
          division: course.division,
          facultyId: course.facultyId,
        }));

        setCourseData(formattedData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch course data");
        toast.error("Error fetching course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingCourse(null); // Reset to null to ensure it's not in edit mode
    setShowForm(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = courseData.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.courseName.toLowerCase().includes(query) ||
      course.department.toLowerCase().includes(query)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      courseName: e.target.courseName.value,
      courseId: e.target.courseId.value,
      department: e.target.department.value,
      year: e.target.class.value,
      division: e.target.division.value,
      facultyId: e.target.facultyId.value,
    };

    try {
      const response = await fetch("http://localhost:4000/course/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Course registered successfully:", data);
        setShowForm(false);
        toast.success("Course registered successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error registering course:", errorData);
        toast.error("Failed to register course. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again later.");
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      const response = await axios.delete(
        `http://localhost:4000/course/remove/${courseToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCourseData(
        courseData.filter((course) => course.courseId !== courseToDelete)
      );
      setShowConfirmModal(false);
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error deleting course.");
      setShowConfirmModal(false);
    }
  };

  const openConfirmModal = (courseId) => {
    setCourseToDelete(courseId);
    setShowConfirmModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
              placeholder="Search course....."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-gray-100 border rounded-md p-2 shadow-sm w-64"
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h2>
            <form onSubmit={editingCourse ? handleUpdateSubmit : handleSubmit}>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="courseId"
                  name="courseId"
                  placeholder="Course ID"
                  defaultValue={editingCourse?.courseId || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  placeholder="Course Name"
                  defaultValue={editingCourse?.courseName || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
              </div>

              <div className="flex gap-2 mb-2">
                <select
                  id="department"
                  name="department"
                  defaultValue={editingCourse?.department || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science</option>
                  <option value="DS">Data Science</option>
                  <option value="CIVIL">Civil Engineering</option>
                  <option value="ELECTRICAL">Electrical Engineering</option>
                </select>

                <select
                  id="class"
                  name="class"
                  defaultValue={editingCourse?.year || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                >
                  <option value="">Select Class</option>
                  <option value="FY">FY</option>
                  <option value="SY">SY</option>
                  <option value="TY">TY</option>
                  <option value="B.Tech">B.Tech</option>
                </select>

                <select
                  id="division"
                  name="division"
                  defaultValue={editingCourse?.division || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                >
                  <option value="">Select Division</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>

              <input
                type="text"
                id="facultyId"
                name="facultyId"
                placeholder="Faculty ID"
                defaultValue={editingCourse?.facultyId || ""}
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

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
                  {editingCourse ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8">
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Course ID</th>
              <th className="border border-gray-300 px-4 py-2">Course Name</th>
              <th className="border border-gray-300 px-4 py-2">Department</th>
              <th className="border border-gray-300 px-4 py-2">Year</th>
              <th className="border border-gray-300 px-4 py-2">Division</th>
              <th className="border border-gray-300 px-4 py-2">Faculty ID</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((course) => (
                <tr key={course.courseId} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {course.courseId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.courseName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.department}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.year}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.division}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.facultyId}
                  </td>
                  <td className="flex border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600 flex items-center gap-2"
                      onClick={() => handleEditCourse(course)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                      onClick={() => openConfirmModal(course.courseId)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center border border-gray-300 py-4"
                >
                  No course data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to delete this course?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Course;
