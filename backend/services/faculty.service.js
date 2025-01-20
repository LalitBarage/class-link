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

module.exports.deleteFaculty = async (facultyId) => {
  try {
    const faculty = await facultyModel.findOneAndDelete(facultyId); // Delete from DB
    return faculty;
  } catch (error) {
    console.error("Error in service:", error);
    throw new Error("Failed to delete faculty");
  }
};

module.exports.updateFaculty = async (facultyId, update) => {
  try {
    if (update.password) {
      update.password = await facultyModel.hashPassword(update.password);
    }

    const faculty = await facultyModel.findOneAndUpdate({ facultyId }, update, {
      new: true,
      runValidators: true,
    });

    return faculty; // Return the updated faculty document
  } catch (error) {
    console.error("Error in facultyService.updateFaculty:", error);
    throw error; // Propagate the error to the controller
  }
};
