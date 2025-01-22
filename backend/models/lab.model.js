const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  labId: {
    type: String,
    required: true,
    unique: true, // Ensures each labid is unique
  },
  facultyId: {
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
  class: {
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
