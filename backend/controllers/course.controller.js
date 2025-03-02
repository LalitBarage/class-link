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

// Create a new attendance record
module.exports.createAttendance = async (req, res) => {
  try {
    const { students } = req.body;
    const { courseId, lectureId } = req.params;

    // Validate input
    if (!courseId || !lectureId || !students || students.length === 0) {
      return res
        .status(400)
        .json({ message: "All fields are required, including students." });
    }

    // Ensure each student has a status
    for (let student of students) {
      if (!student.studentId || !student.status) {
        return res.status(400).json({
          message: "Each student must have a studentId and status.",
        });
      }

      if (!["Present", "Absent", "Late", "Excused"].includes(student.status)) {
        return res.status(400).json({
          message:
            "Invalid status for student. Valid statuses are: Present, Absent, Late, Excused.",
        });
      }
    }

    // Call service to create attendance
    const attendance = await courseService.createAttendance(
      courseId,
      lectureId,
      { students }
    );

    return res.status(201).json({
      message: "Attendance record created successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Retrieve attendance by lecture ID
module.exports.getAttendanceByLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Validate input
    if (!lectureId) {
      return res.status(400).json({ message: "Lecture ID is required." });
    }

    // Call service to get attendance
    const attendance = await courseService.getAttendanceByLecture(lectureId);

    return res.status(200).json({
      message: "Attendance record retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update attendance for a specific lecture
module.exports.updateAttendance = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { students } = req.body;

    // Validate input
    if (!courseId || !lectureId || !students || students.length === 0) {
      return res.status(400).json({
        message: "Course ID, Lecture ID, and students data are required.",
      });
    }

    // Call service to update attendance
    const updatedAttendance = await courseService.updateAttendance(
      courseId,
      lectureId,
      students
    );

    return res.status(200).json({
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    console.error("Error updating attendance:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAttendanceByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const attendance = await courseService.getAttendanceByCourse(courseId);
    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getLectureDate = async (req, res) => {
  const { lectureId } = req.params;

  try {
    // Fetch the lecture date from the service layer
    const date = await courseService.getLectureDateById(lectureId);

    if (!date) {
      return res.status(404).json({ message: "Lecture date not found" });
    }

    // Return the date as the response
    res.json({ date });
  } catch (err) {
    console.error("Error fetching lecture date:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getStudentLectureCounts = async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    const data = await courseService.getStudentLectureCounts(courseId, studentId);

    if (!data) {
      return res.status(404).json({ message: "No data found for the given course and student." });
    }

    res.status(200).json({
      message: "Lecture counts retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching lecture counts:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};