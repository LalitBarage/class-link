const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const studentController = require("../controllers/student.controller");

router.post(
  "/register",
  [
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

    // rollno
    body("rollno")
      .notEmpty()
      .withMessage("Roll number is required")
      .isInt({ min: 1 })
      .withMessage("Roll number must be a positive integer"),

    // prnno
    body("prnno")
      .notEmpty()
      .withMessage("PRN number is required")
      .isString()
      .withMessage("PRN number must be a string"),

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

      body("department")
      .notEmpty()
      .withMessage("Department is required")
      .isString()
      .withMessage("Department must be a string"),

    // parentfullname.firstname
    body("parentfullname.firstname")
      .notEmpty()
      .withMessage("Parent first name is required")
      .isString()
      .withMessage("Parent first name must be a string"),

    // parentfullname.lastname
    body("parentfullname.lastname")
      .notEmpty()
      .withMessage("Parent last name is required")
      .isString()
      .withMessage("Parent last name must be a string"),

    // parentemail
    body("parentemail")
      .notEmpty()
      .withMessage("Parent email is required")
      .isEmail()
      .withMessage("Parent email must be valid"),

    // parentmobileno
    body("parentmobileno")
      .notEmpty()
      .withMessage("Parent mobile number is required")
      .isMobilePhone()
      .withMessage("Parent mobile number must be valid"),

    // password
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  studentController.registerStudent
);

router.get("/list", studentController.getAllStudents);
router.delete("/student/:id", studentController.deleteStudent);

router.put("/update/:id", studentController.updateStudentInfo);
module.exports = router;
