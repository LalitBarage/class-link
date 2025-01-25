const studentModel = require("../models/student.model");
const LabModel = require("../models/lab.model");
const CourseModel = require("../models/course.model");
const bcrypt = require("bcrypt");

module.exports.createStudent = async ({
  firstname,
  middlename,
  lastname,
  email,
  mobileno,
  rollno,
  prnno,
  year,
  division,
  parentfirstname,
  parentlastname,
  parentemail,
  parentmobileno,
  password,
  department,
}) => {
  if (
    !firstname ||
    !middlename ||
    !lastname ||
    !email ||
    !mobileno ||
    !rollno ||
    !prnno ||
    !year ||
    !division ||
    !parentfirstname ||
    !parentlastname ||
    !parentemail ||
    !parentmobileno ||
    !password ||
    !department
  ) {
    throw new Error("All field are required");
  }

  const student = studentModel.create({
    fullname: {
      firstname,
      middlename,
      lastname,
    },
    email,
    mobileno,
    rollno,
    prnno,
    year,
    division,
    parentfullname: {
      firstname: parentfirstname,
      lastname: parentlastname,
    },
    parentemail,
    parentmobileno,
    role: "student",
    password,
    department,
  });

  return student;
};

module.exports.getAllStudents = async () => {
  const students = await studentModel.find({}, "-password").lean();
  return students;
};

module.exports.deleteStudent = async (id) => {
  if (!id) {
    throw new Error("Student ID is required");
  }

  return await studentModel.findByIdAndDelete(id); // Use studentModel instead of students
};

module.exports.authenticateStudent = async (email, password) => {
  // Find the student by email
  const student = await studentModel.findOne({ email }).select("+password");

  if (!student) {
    throw new Error("Invalid email or password");
  }

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, student.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return student;
};

module.exports.getStudentById = async (_id) => {
  try {
    const student = await studentModel.findById(_id).lean();

    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  } catch (error) {
    console.error("Error in studentService.getStudentById:", error);
    throw error;
  }
};

module.exports.logLogoutActivity = async (_id) => {
  if (!_id) {
    console.log("Student ID not provided for logging activity");
    return;
  }

  // Example: Log to the console or a database
  console.log(
    `Student with ID ${_id} logged out at ${new Date().toISOString()}`
  );
};

module.exports.getStudentCourse = async (_id) => {
  try {
    // Fetch user details
    const student = await studentModel.findById(_id);

    if (!student) {
      throw new Error("student not found");
    }

    // Fetch courses based on eligibility criteria (example: department and year)
    const eligibleCourses = await CourseModel.find({
      department: student.department,
      year: student.year,
      division: student.division,
    });

    return eligibleCourses;
  } catch (error) {
    console.error("Error in service:", error.message);
    throw error;
  }
};

module.exports.getStudentLab = async (_id, rollNo) => {
  try {
    // Fetch user details
    const student = await studentModel.findById(_id);

    if (!student) {
      throw new Error("Student not found");
    }

    // Fetch labs based on eligibility criteria (department, year, division)
    const eligibleLabs = await LabModel.find({
      department: student.department,
      year: student.year,
      division: student.division,
      strollno: { $lte: student.rollno }, // Check if roll number is greater than or equal to strollno
      endrollno: { $gte: student.rollno }, // Check if roll number is less than or equal to endrollno
    });
    // Return the eligible labs
    return eligibleLabs;
  } catch (error) {
    console.error("Error in service:", error.message);
    throw error;
  }
};
