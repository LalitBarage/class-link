const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    ref: "Course",
    required: true,
  },

});

module.exports = mongoose.model("lecture", lectureSchema);
