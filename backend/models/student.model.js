const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  password: {
    type: String,
    require: true,
    select: false,
  },
});

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

studentSchema.method.comparePassword = async function () {
  return await bcrypt.compare(password, this.password);
};

studentSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;
