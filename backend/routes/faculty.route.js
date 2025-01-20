const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const facultyController = require("../controllers/faculty.controller");

// Faculty registration route
router.post(
  "/register",
  [
    // fullname.firstname
    body("fullname.firstname")
      .notEmpty()
      .withMessage("First name is required")
      .isString()
      .withMessage("First name must be a string"),

    // fullname.middlename
    body("fullname.middlename")
      .notEmpty()
      .withMessage("Middle name is required")
      .isString()
      .withMessage("Middle name must be a string"),

    // fullname.lastname
    body("fullname.lastname")
      .notEmpty()
      .withMessage("Last name is required")
      .isString()
      .withMessage("Last name must be a string"),

    // email
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be valid"),

    // mobileno
    body("mobileno")
      .notEmpty()
      .withMessage("Mobile number is required")
      .isMobilePhone()
      .withMessage("Mobile number must be valid"),

    // facultyId
    body("facultyId")
      .notEmpty()
      .withMessage("Faculty ID is required")
      .isString()
      .withMessage("Faculty ID must be a string"),

    body("qualification")
      .notEmpty()
      .withMessage("Qualification is required")
      .isString()
      .withMessage("Qualification must be a string"),

    // designation
    body("designation")
      .notEmpty()
      .withMessage("Designation is required")
      .isString()
      .withMessage("Designation must be a string"),

    body("department")
      .notEmpty()
      .withMessage("Department is required")
      .isString()
      .withMessage("Department must be a string"),

    // password
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  facultyController.registerFaculty
);

router.get("/list", facultyController.getAllFaculties);

router.delete("/remove/:facultyId", facultyController.deleteFaculty);

router.put("/update/:facultyId", facultyController.updateFaculty);

module.exports = router;
