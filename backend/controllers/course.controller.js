const courseService = require("../services/course.service");
const { validationResult } = require("express-validator");

// Register course
module.exports.registerCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { courseId, courseName, department, year, division, facultyId } =
    req.body;

  try {
    const course = await courseService.createCourse({
      courseId,
      courseName,
      department,
      year,
      division,
      facultyId,
    });

    res.status(201).json({ message: "Course registered successfully", course });
  } catch (error) {
    console.error("Error registering course:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

// Get all courses
module.exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json({ courses });
  } catch (error) {
    next(error); // Pass errors to error-handling middleware
  }
};

// Update course details
module.exports.updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const update = req.body;

  try {
    const course = await courseService.updateCourse(courseId, update);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

// Delete course
module.exports.deleteCourse = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const result = await courseService.deleteCourse(courseId);
    if (!result) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
