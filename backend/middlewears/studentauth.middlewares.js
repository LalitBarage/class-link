const jwt = require("jsonwebtoken");
const studentModel = require("../models/student.model"); // Import the Student model

const studentAuthMiddleware = async (req, res, next) => {
  // Extract the token from cookies or the Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Unauthorized" }); // Return 401 if no token is provided
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the student in the database using the ID from the token
    const student = await studentModel.findById(decoded._id);

    if (!student) {
      return res.status(404).send({ error: "Student not found" }); // Return 404 if student doesn't exist
    }

    // Attach the student object to the request for downstream handlers
    req.student = student;

    // Pass control to the next middleware/handler
    return next();
  } catch (err) {
    // Handle invalid tokens or errors
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = studentAuthMiddleware;
