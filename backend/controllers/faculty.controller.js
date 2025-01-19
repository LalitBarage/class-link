const facultyModel = require("../models/faculty.model");
const facultyService = require("../services/faculty.service");
const { validationResult } = require("express-validator");

module.exports.registerFaculty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const {
    fullname,
    email,
    mobileno,
    facultyId,
    qualification,
    designation,
    department,
    password,
  } = req.body;

  const hashedPassword = await facultyModel.hashPassword(password);

  const faculty = await facultyService.createFaculty({
    firstname: fullname.firstname,
    middlename: fullname.middlename,
    lastname: fullname.lastname,
    email,
    mobileno,
    facultyId,
    qualification,
    designation,
    department,
    password: hashedPassword,
  });

  const token = faculty.generateAuthToken();

  res.status(201).json({ token, faculty });
};

module.exports.getAllFaculties = async (req, res, next) => {
  try {
    const faculties = await facultyService.getAllFaculties();
    res.status(200).json({ faculties });
  } catch (error) {
    next(error); // Pass errors to error-handling middleware
  }
};

module.exports.deleteFaculty = async (req, res, next) => {
  try {
    const { id } = req.params;
    await facultyService.deleteFaculty(id);
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting faculty", error: error.message });
  }
};
