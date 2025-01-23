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

module.exports.getLectures = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const lectures = await courseService.getLectures(courseId);
    res.status(200).json({ lectures });
  } catch (error) {
    next(error);
  }
};

module.exports.addLecture = async (req, res, next) => {
  const { courseId } = req.params; // Extract courseId from the request params
  const lectureData = req.body; // Extract lecture data from the request body

  try {
    // Add the lecture using the custom courseId
    const newLecture = await courseService.addLecture(courseId, lectureData);

    if (!newLecture) {
      // If no course is found, return a 404
      return res.status(404).json({ message: "Course not found" });
    }

    // Respond with the added lecture
    res
      .status(201)
      .json({ message: "Lecture added successfully", lecture: newLecture });
  } catch (error) {
    next(error); // Pass the error to error handling middleware
  }
};


module.exports.getStudentsByCourseId = async (req, res) => {
  const { courseId } = req.params; // Get courseId from URL parameter

  try {
    // Call the service function to get students by courseId
    const students = await courseService.getStudentsByCourseId(courseId);

    // Return the students as a response
    res.status(200).json({ students });
  } catch (err) {
    // If an error occurs, return an error response
    res.status(500).json({ message: err.message });
  }
};