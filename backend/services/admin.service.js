const adminModel = require("../models/admin.model");

module.exports.createAdmin = async ({
  firstname,
  middlename,
  lastname,
  email,
  password,
}) => {
  if (!firstname || !lastname || !email || !password) {
    throw new Error("All fields are required");
  }

  const hashedPassword = await adminModel.hashPassword(password);

  const admin = await adminModel.create({
    fullname: {
      firstname,
      middlename,
      lastname,
    },
    email,
    password: hashedPassword,
  });

  return admin;
};

module.exports.findAdminByEmail = async (email, password) => {
  try {
    const admin = await adminModel.findOne({ email }).select("+password");
    if (!admin) {
      throw new Error("Admin not found");
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return admin;
  } catch (error) {
    console.error("Error in adminService.findAdminByEmail:", error);
    throw error;
  }
};
