const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const courseController = require("../controllers/course.controller");
const studentModel = require("../models/student.model");
const courseModel = require("../models/course.model");

// Course registration route
router.post(
  "/register",
  [
    // courseId
    body("courseId")
      .notEmpty()
      .withMessage("Course ID is required")
      .isString()
      .withMessage("Course ID must be a string"),

    // courseName
    body("courseName")
      .notEmpty()
      .withMessage("Course name is required")
      .isString()
      .withMessage("Course name must be a string"),

    // department
    body("department")
      .notEmpty()
      .withMessage("Department is required")
      .isString()
      .withMessage("Department must be a string"),

    // year
    body("year")
      .notEmpty()
      .withMessage("Year is required")
      .isString()
      .withMessage("Year must be a string"),

    // division
    body("division")
      .notEmpty()
      .withMessage("Division is required")
      .isString()
      .withMessage("Division must be a string"),

    // facultyId
    body("facultyId")
      .notEmpty()
      .withMessage("Faculty ID is required")
      .isString()
      .withMessage("Faculty ID must be a string"),
  ],
  courseController.registerCourse
);

// Get all courses
router.get("/list", courseController.getAllCourses);

// Update course by courseId
router.put("/update/:courseId", courseController.updateCourse);

// Delete course by courseId
router.delete("/remove/:courseId", courseController.deleteCourse);

router.get("/:courseId/lecture", courseController.getLectures);

router.post("/:courseId/lecture", courseController.addLecture);

router.get("/students/:courseId", courseController.getStudentsByCourseId);

router.get("/:courseId/attendance", courseController.getAttendanceByCourse);

router.post(
  "/:courseId/lecture/:lectureId/attendance",
  courseController.createAttendance
);

router.get(
  "/:courseId/lecture/:lectureId/attendance",
  courseController.getAttendanceByLecture
);

router.put(
  "/:courseId/lecture/:lectureId/attendance",
  courseController.updateAttendance
);

router.get("/lecture/:lectureId/date", courseController.getLectureDate);

router.get("/:courseId/students/:studentId/lecture-counts", courseController.getStudentLectureCounts);

module.exports = router;
