import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"


const Student = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [editingStudent, setEditingStudent] = useState(null); // State for editing student

  // Fetch student data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:4000/student/list");
        if (response.ok) {
          const result = await response.json();
          const formattedData = result.students.map((student) => ({
            id: student._id,
            rollno: student.rollno || "",
            prnno: student.prnno || "",
            name: `${student.fullname?.firstname || ""} ${student.fullname?.middlename || ""} ${student.fullname?.lastname || ""}`.trim(),
            year: student.year || "",
            division: student.division || "",
            mobileno: student.mobileno || "",
            email: student.email || "",
            parent: `${student.parentfullname?.firstname || ""} ${student.parentfullname?.lastname || ""}`.trim(),
            parentmobileno: student.parentmobileno || "",
            parentemail: student.parentemail || "",
            department: student.department || "",
          }));
          setStudents(formattedData);
        } else {
          console.error("Failed to fetch student data");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Error fetching student data");
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      (student.name?.toLowerCase().includes(query) || "") ||
      (student.email?.toLowerCase().includes(query) || "") ||
      (student.department?.toLowerCase().includes(query) || "")
    );
  });

  const handleAddStudent = () => {
    setShowForm(true);
    setEditingStudent(null);
    setSelectedClass("");
    setSelectedDivision("");
    setSelectedDepartment("");
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
    setSelectedClass(student.year);
    setSelectedDivision(student.division);
    setSelectedDepartment(student.department);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleDeptSelect = (e) => setSelectedDepartment(e.target.value);
  const handleClassSelect = (e) => setSelectedClass(e.target.value);
  const handleDivisionSelect = (e) => setSelectedDivision(e.target.value);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:4000/student/student/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Student deleted successfully!");
        setStudents((prev) => prev.filter((student) => student.id !== id));
        toast.success("Student deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error deleting student:", errorData);
        alert("Failed to delete student. Please try again.");
        toast.error("Error deleting faculty.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again later.");
      toast.error("Error deleting faculty.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      fullname: {
        firstname: e.target.studentFName.value.trim(),
        middlename: e.target.studentMName.value.trim(),
        lastname: e.target.studentName.value.trim(),
      },
      email: e.target.stuEmail.value.trim(),
      mobileno: e.target.mobileNo.value.trim(),
      rollno: e.target.rollNo.value.trim(),
      prnno: e.target.prnNo.value.trim(),
      year: selectedClass,
      division: selectedDivision,
      department: selectedDepartment,
      parentfullname: {
        firstname: e.target.parentFName.value.trim(),
        lastname: e.target.parentLName.value.trim(),
      },
      parentemail: e.target.parEmail.value.trim(),
      parentmobileno: e.target.pmobileNo.value.trim(),
      password: "pass@123",
    };
  
    // Add password field if editing
    if (editingStudent) {
      const password = e.target.password.value.trim();
      if (password) {
        formData.password = password;
      }
    }
  
    try {
      const url = editingStudent
        ? `http://localhost:4000/student/update/${editingStudent.id}`
        : "http://localhost:4000/student/register";
  
      const method = editingStudent ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success(editingStudent ? "Student updated successfully!" : "Student registered successfully");
        setStudents((prev) =>
          editingStudent
            ? prev.map((stu) => (stu.id === editingStudent.id ? { ...stu, ...formData } : stu))
            : [...prev, { ...formData, id: data.student.id }]
        );
       
        setShowForm(false);
        setEditingStudent(null);
      } else {
        
        toast.error("Failed to register student. Please try again.")
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again later.");
      toast.error("Network error. Please try again later.")

    }
  };
  

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <input
          type="text"
          name="search"
          placeholder="Search Student..."
          value={searchQuery}
          onChange={handleSearch}
          className="bg-gray-100 border rounded-md p-2 shadow-sm w-64"
        />
        <button
          className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800"
          onClick={handleAddStudent}
        >
          Add Student
        </button>
      </div>

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
              <th className="border border-gray-300 px-4 py-2">Student Email</th>
              <th className="border border-gray-300 px-4 py-2">Parent Name</th>
              <th className="border border-gray-300 px-4 py-2">Parent No</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{student.rollno}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.prnno}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.year}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.division}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.mobileno}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.parent}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.parentmobileno}</td>
                  <td className="flex border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600 flex items-center gap-2"
                      onClick={() => handleEdit(student)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                      onClick={() => handleDelete(student.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="studentFName"
                  name="studentFName"
                  placeholder="First Name"
                  defaultValue={editingStudent?.name.split(" ")[0] || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="studentMName"
                  name="studentMName"
                  placeholder="Middle Name"
                  defaultValue={editingStudent?.name.split(" ")[1] || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  placeholder="Last Name"
                  defaultValue={editingStudent?.name.split(" ")[2] || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
              </div>
              <input
                type="email"
                id="stuEmail"
                name="stuEmail"
                placeholder="Student Email"
                defaultValue={editingStudent?.email|| ""}
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />
              <input
                type="text"
                id="mobileNo"
                name="mobileNo"
                placeholder="Student Mobile No"
                defaultValue={editingStudent?.mobileno || ""}
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  placeholder="Roll No"
                  defaultValue={editingStudent?.rollno || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="prnNo"
                  name="prnNo"
                  placeholder="PRN No"
                  defaultValue={editingStudent?.prnno || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
              </div>
              <div className="flex gap-2 mb-2">
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={handleDeptSelect}
                  className="w-full bg-gray-100 border rounded-md p-2"
                  defaultValue={editingStudent?.department || ""}
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
                  defaultValue={editingStudent?.class || ""}
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
                  defaultValue={editingStudent?.division || ""}
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
                  id="parentFName"
                  name="parentFName"
                  placeholder="Parent First Name"
                  defaultValue={editingStudent?.parent.split(" ")[0] || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
                <input
                  type="text"
                  id="parentLName"
                  name="parentLName"
                  placeholder="Parent Last Name"
                  defaultValue={editingStudent?.parent.split(" ")[1] || ""}
                  required
                  className="w-full border rounded-md p-2 bg-gray-100"
                />
              </div>
              <input
                type="email"
                id="parEmail"
                name="parEmail"
                placeholder="Parent Email"
                defaultValue={editingStudent?.parentemail || ""}
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />
              <input
                type="text"
                id="pmobileNo"
                name="pmobileNo"
                placeholder="Parent Mobile No"
                defaultValue={editingStudent?.parentmobileno || ""}
                required
                className="w-full border rounded-md p-2 mb-2 bg-gray-100"
              />

            {editingStudent && (
             <input
               type="password"
               id="password"
               name="password"
               placeholder="Enter Password"
               className="w-full border rounded-md p-2 mb-2 bg-gray-100"
               />
               )}

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
                {editingStudent ? "Update" : "Add"}
              </button>
                </div>
            </form>
          </div>
        </div>
      )}
       <ToastContainer />
    </div>
  );
};

export default Student;
