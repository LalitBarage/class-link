const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const labattendanceSchema = new Schema({
  labid: {
    type: "String",
    required: true,
  },
  practicalId: {
    type: Schema.Types.ObjectId,
    ref: "practical",
    required: true,
  },
  students: [
    {
      studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      fullname: {
        firstname: {
          type: String,
          required: true,
        },
        lastname: {
          type: String,
          required: true,
        },
      },
      rollno: {
        type: Number,
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

module.exports = mongoose.model("Labattendance", labattendanceSchema);
