const facultyModel = require("../models/faculty.model");
const facultyService = require("../services/faculty.service");
const { validationResult } = require("express-validator");

module.exports.registerFaculty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { fullname, email, mobileno, facultyId, designation, password } =
    req.body;

  const hashedPassword = await facultyModel.hashPassword(password);

  const faculty = await facultyService.createFaculty({
    firstname: fullname.firstname,
    middlename: fullname.middlename,
    lastname: fullname.lastname,
    email,
    mobileno,
    facultyId,
    designation,
    password: hashedPassword,
  });

  const token = faculty.generateAuthToken();

  res.status(201).json({ token, faculty });
};
