const facultyModel = require("../models/faculty.model");

module.exports.createFaculty = async ({
  firstname,
  middlename,
  lastname,
  email,
  mobileno,
  facultyId,
  qualification,
  designation,
  department,
  password,
}) => {
  if (
    !firstname ||
    !middlename ||
    !lastname ||
    !email ||
    !mobileno ||
    !facultyId ||
    !qualification ||
    !designation ||
    !department ||
    !password
  ) {
    throw new Error("All fields are required");
  }

  const faculty = await facultyModel.create({
    fullname: {
      firstname,
      middlename,
      lastname,
    },
    email,
    mobileno,
    facultyId,
    qualification,
    designation,
    department,
    role: "faculty",
    password,
  });

  return faculty;
};

module.exports.getAllFaculties = async () => {
  const faculties = await facultyModel.find({}, "-password").lean();
  return faculties;
};

module.exports.deleteFaculty = async (id) => {
  return await Faculty.findByIdAndDelete(id);
};
