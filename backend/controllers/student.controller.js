const studentModel = require("../models/student.model");
const studentService = require("../services/student.service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const {
    fullname,
    email,
    mobileno,
    rollno,
    prnno,
    year,
    division,
    parentfullname,
    parentemail,
    parentmobileno,
    password,
    department,
  } = req.body;

  const hashedPassword = await studentModel.hashPassword(password);

  const student = await studentService.createStudent({
    firstname: fullname.firstname,
    middlename: fullname.middlename,
    lastname: fullname.lastname,
    email,
    mobileno,
    rollno,
    prnno,
    year,
    division,
    parentfirstname: parentfullname.firstname,
    parentlastname: parentfullname.lastname,
    parentemail,
    parentmobileno,
    password: hashedPassword,
    department,
  });

  const token = student.generateAuthToken();

  res.status(201).json({ token, student });
};

module.exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json({ students });
  } catch (error) {
    next(error); 
  }
};


module.exports.deleteStudent = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedStudent = await studentService.deleteStudent(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports.updateStudentInfo = async (req, res, next) => {
  const { id } = req.params;

  // Find the student by ID
  let student = await studentModel.findById(id);
  if (!student) {
    return next(new ErrorHandler("Student Not Found", 404));
  }

  // If the password is being updated, hash it before applying the update
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  // Update the student with the new data from req.body
  student = await studentModel.findByIdAndUpdate(id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Validate the new data against the schema
    useFindAndModify: false, // Ensure MongoDB native findOneAndUpdate is used
  });

  // Send the response
  res.status(200).json({
    success: true,
    message: "Student information updated successfully",
    student,
  });
};


module.exports.loginStudent = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate email and password
    const student = await studentService.authenticateStudent(email, password);
    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = student.generateAuthToken();

    // Set the token in cookies
    res.cookie("token", token, { httpOnly: true });

    // Exclude the password from the response
    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({ token, student: studentData });
  } catch (error) {
    console.error("Error logging in student:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.getStudentProfile = async (req, res, next) => {
  res.status(200).json(req.student);
};

module.exports.logoutStudent = async (req, res, next) => {
  try {
    // Clear the authentication token cookie
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
     blacklistTokenModel.create({ token });

    res.status(200).json({ message: "Student logged out successfully" });
  } catch (error) {
    console.error("Error logging out student:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
