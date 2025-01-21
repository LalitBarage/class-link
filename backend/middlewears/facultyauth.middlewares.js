const jwt = require("jsonwebtoken");
const facultyModel = require("../models/faculty.model");

const facultyauthMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const isBlacklisted = await facultyModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const faculty = await facultyModel.findById(decoded._id);

    req.faculty = faculty;

    return next();
  } catch (err) {
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = facultyauthMiddleware;
