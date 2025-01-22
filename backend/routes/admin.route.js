const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const adminController = require("../controllers/admin.controller");
const adminAuthMiddleware = require("../middlewares/adminauth.middleware");

router.post(
  "/register",
  [
    body("fullname.firstname")
      .notEmpty()
      .withMessage("First name is required")
      .isString()
      .withMessage("First name must be a string"),
    body("fullname.lastname")
      .notEmpty()
      .withMessage("Last name is required")
      .isString()
      .withMessage("Last name must be a string"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  adminController.registerAdmin
);

router.post("/login", adminController.loginAdmin);

router.get("/logout", adminAuthMiddleware, adminController.logoutAdmin);

module.exports = router;
