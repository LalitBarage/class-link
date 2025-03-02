const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  labid: {
    type: String,
    required: true,
    unique: true, // Ensures each labid is unique
  },
  facultyid: {
    type: String,
    required: true,
  },
  strollno: {
    type: Number,
    required: true,
  },
  endrollno: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  labname: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Lab", labSchema);
