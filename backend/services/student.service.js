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


module.exports.getAllStudents = async () => {
  const students = await studentModel.find({}, "-password").lean();
  return students;
};

module.exports.deleteStudent = async (id) => {
  if (!id) {
    throw new Error("Student ID is required");
  }

  return await studentModel.findByIdAndDelete(id); // Use studentModel instead of students
};
