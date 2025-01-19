const studentModel = require("../models/student.model");

module.exports.createStudent = async ({
  firstname,
  middlename,
  lastname,
  email,
  mobileno,
  rollno,
  prnno,
  year,
  division,
  parentfirstname,
  parentlastname,
  parentemail,
  parentmobileno,
  password,
  department
}) => {
  if (
    !firstname ||
    !middlename ||
    !lastname ||
    !email ||
    !mobileno ||
    !rollno ||
    !prnno ||
    !year ||
    !division ||
    !parentfirstname ||
    !parentlastname ||
    !parentemail ||
    !parentmobileno ||
    !password ||
    !department
  ) {
    throw new Error("All field are required");
  }

  const student = studentModel.create({
    fullname: {
      firstname,
      middlename,
      lastname,
    },
    email,
    mobileno,
    rollno,
    prnno,
    year,
    division,
    parentfullname: {
      firstname: parentfirstname,
      lastname: parentlastname,
    },
    parentemail,
    parentmobileno,
    role: "student",
    password,
    department
  });

  return student;
};
