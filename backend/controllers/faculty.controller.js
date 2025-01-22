const facultyModel = require("../models/faculty.model");
const facultyService = require("../services/faculty.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

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
  const { facultyId } = req.params; // Get facultyId from URL params
  try {
    const result = await facultyService.deleteFaculty(facultyId); // Call the service to handle deletion logic
    if (!result) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.updateFaculty = async (req, res) => {
  const { facultyId } = req.params;
  const update = req.body;

  try {
    const faculty = await facultyService.updateFaculty(facultyId, update);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({ message: "Faculty updated successfully", faculty });
  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

module.exports.loginFaculty = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Call the service to authenticate the faculty
    const faculty = await facultyService.findFacultyByEmail(email, password);

    // Generate an authentication token
    const token = faculty.generateAuthToken();

    res.cookie("token", token);

    // Return the response without the password field
    const facultyWithoutPassword = faculty.toObject();
    delete facultyWithoutPassword.password; // Remove the password before sending the response

    res.status(200).json({ token, faculty: facultyWithoutPassword });
  } catch (error) {
    console.error("Error logging in faculty:", error.message);
    if (
      error.message === "Faculty not found" ||
      error.message === "Invalid credentials"
    ) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.getFacultyProfile = async (req, res, next) => {
  res.status(200).json(req.faculty);
};

module.exports.logoutFaculty = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports.getAssignedCourses = async (req, res, next) => {
  const faculty = req.faculty;
  try {
    const courses = await facultyService.getAssignedCourses(faculty.facultyId);
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error getting assigned courses:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.getAssignedLabs = async (req, res, next) => {
  const faculty = req.faculty;
  try {
    const labs = await facultyService.getAssignedLabs(faculty.facultyId);
    res.status(200).json({ labs });
  } catch (error) {
    console.error("Error getting assigned labs:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
