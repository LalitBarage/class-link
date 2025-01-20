const studentModel = require("../models/student.model");
const studentService = require("../services/student.service");
const { validationResult } = require("express-validator");

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

  // Update the student with the new data from req.body
  student = await studentModel.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the new data against the schema
      useFindAndModify: false, // Ensure MongoDB native `findOneAndUpdate` is used
  });

  // Send the response
  res.status(200).json({
      success: true,
      message: "Student information updated successfully",
      student,
  });
};
