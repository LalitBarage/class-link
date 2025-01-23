const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  courseId: {
    type: "String",
    required: true,
  },
  lectureId: {
    type: Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  students: [
    {
      studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Excused"],
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
