const adminService = require("../services/admin.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { fullname, email, password } = req.body;

  try {
    const admin = await adminService.createAdmin({
      firstname: fullname.firstname,
      middlename: fullname.middlename,
      lastname: fullname.lastname,
      email,
      password,
    });

    const token = admin.generateAuthToken();

    res.status(201).json({ token, admin });
  } catch (error) {
    next(error);
  }
};

module.exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const admin = await adminService.findAdminByEmail(email, password);

    const token = admin.generateAuthToken();

    res.cookie("token", token);

    const adminWithoutPassword = admin.toObject();
    delete adminWithoutPassword.password;

    res.status(200).json({ token, admin: adminWithoutPassword });
  } catch (error) {
    console.error("Error logging in admin:", error.message);
    if (
      error.message === "Admin not found" ||
      error.message === "Invalid credentials"
    ) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.logoutAdmin = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports.getAdminProfile = async (req, res, next) => {
  res.status(200).json(req.admin);
};
