const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  mobileno: {
    type: String,
    required: true,
  },
  rollno: {
    type: Number,
    required: true,
  },
  prnno: {
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
  parentfullname: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  parentemail: {
    type: String,
    required: true,
  },
  parentmobileno: {
    type: String,
    required: true,
  },
});

module.exports = studentSchema;
