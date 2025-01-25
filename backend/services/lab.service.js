const labModel = require("../models/lab.model");
const LabModel = require("../models/lab.model");
const practicalModel = require("../models/practical.model");
const studentModel = require("../models/student.model");
const labattendanceModel = require("../models/labattendance.model");

// Create a new lab
exports.createLab = async (labData) => {
  try {
    const newLab = await LabModel.create(labData); // Add a new lab to the database
    return newLab;
  } catch (error) {
    throw new Error(error.message || "Failed to create lab");
  }
};

// Fetch all labs
exports.getAllLabs = async () => {
  try {
    const labs = await LabModel.find(); // Fetch all labs
    return labs;
  } catch (error) {
    throw new Error("Failed to fetch labs");
  }
};

exports.updateLab = async (labid, labData) => {
  try {
    const updatedLab = await LabModel.findOneAndUpdate(
      { labid }, // Search by labid
      labData, // Data to update
      { new: true } // Return the updated document
    );
    return updatedLab;
  } catch (error) {
    throw new Error(error.message || "Failed to update lab");
  }
};

exports.deleteLab = async (labid) => {
  try {
    const deletedLab = await LabModel.findOneAndDelete({ labid });
    return deletedLab;
  } catch (error) {
    throw new Error(error.message || "Failed to delete lab");
  }
};

exports.searchLabs = async (query) => {
  try {
    const labs = await LabModel.find({
      labname: { $regex: query, $options: "i" }, // Case-insensitive search by labname
    });
    return labs;
  } catch (error) {
    throw new Error(error.message || "Failed to search labs");
  }
};

module.exports.getPractcals = async (labid) => {
  try {
    const labs = await practicalModel.find({ labid });
    if (!labs) {
      return null;
    }
    return labs;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw error;
  }
};
module.exports.addPractical = async (labid, labData) => {
  try {
    // Find the course by the custom courseId
    const lab = await labModel.findOne({ labid });
    if (!lab) {
      console.error("lab not found");
      return null;
    }

    // Create a new lecture document with the custom courseId
    const newLab = new practicalModel({ ...labData, labid });
    await newLab.save();

    // Return the newly created lecture document
    return newLab;
  } catch (error) {
    console.error("Error adding lab", error);
    throw error;
  }
};

module.exports.getStudentsForLab = async (labid) => {
  // Fetch the lab details
  const lab = await LabModel.findOne({ labid });
  if (!lab) {
    throw new Error("Lab not found");
  }

  // Fetch students matching the lab criteria
  const students = await studentModel.find({
    rollno: { $gte: lab.strollno, $lte: lab.endrollno },
    department: lab.department,
    division: lab.division,
    year: lab.class,
  });
  return students;
};


module.exports.createAttendance = async (labid, practicalId, { students }) => {
  try {
    const attendance = new labattendanceModel({
      labid,
      practicalId,
      students,
    });

    await practicalModel.findByIdAndUpdate(labid, { status: true });
    // Save to the database
    return await attendance.save();
  } catch (error) {
    throw new Error(`Error creating attendance: ${error.message}`);
  }
};

module.exports.getAttendanceByLab = async (practicalId) => {
  try {
    // Fetch attendance record and populate student details
    const attendance = await labattendanceModel.findOne({ practicalId })

    if (!attendance) {
      throw new Error("Attendance record not found.");
    }

    // Format the attendance data
   

    return attendance;
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
};

module.exports.updateAttendance = async (labid, practicalId, students) => {
  try {
    // Update attendance for specific course and lecture
    const updatedAttendance = await labattendanceModel.findOneAndUpdate(
      { labid, practicalId }, // Query to find the document
      { $set: { students } },  // Update the students array
      { new: true }            // Return the updated document
    );

    if (!updatedAttendance) {
      throw new Error("Attendance record not found for the given course and lecture.");
    }

    return updatedAttendance;
  } catch (error) {
    throw new Error(`Error updating attendance: ${error.message}`);
  }
};