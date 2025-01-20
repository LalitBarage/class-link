const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
  facultyId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
