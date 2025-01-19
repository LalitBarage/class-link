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
