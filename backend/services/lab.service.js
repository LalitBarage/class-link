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

exports.getPracticals = async (labid) => {
  try {
    const labs = await practicalModel.find({ labid });
    return labs || null;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw error;
  }
};

exports.addPractical = async (labid, labData) => {
  try {
    const lab = await LabModel.findOne({ labid });
    if (!lab) {
      console.error("Lab not found");
      return null;
    }
    const newPractical = new practicalModel({ ...labData, labid });
    await newPractical.save();
    return newPractical;
  } catch (error) {
    console.error("Error adding lab", error);
    throw error;
  }
};

exports.createAttendance = async (labid, practicalId, { students }) => {
  try {
    const attendance = new labattendanceModel({
      labid,
      practicalId,
      students,
    });

    await practicalModel.findByIdAndUpdate(practicalId, { status: true });
    return await attendance.save();
  } catch (error) {
    throw new Error(`Error creating attendance: ${error.message}`);
  }
};

exports.getAttendanceByLab = async (practicalId) => {
  try {
    const attendance = await labattendanceModel.findOne({ practicalId });
    if (!attendance) {
      throw new Error("Attendance record not found.");
    }
    return attendance;
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
};

exports.updateAttendance = async (labid, practicalId, students) => {
  try {
    const updatedAttendance = await labattendanceModel.findOneAndUpdate(
      { labid, practicalId },
      { $set: { students } },
      { new: true }
    );
    if (!updatedAttendance) {
      throw new Error(
        "Attendance record not found for the given lab and practical."
      );
    }
    return updatedAttendance;
  } catch (error) {
    throw new Error(`Error updating attendance: ${error.message}`);
  }
};

exports.getStudentsByLabId = async (labid) => {
  try {
    const lab = await LabModel.findOne({ labid });
    if (!lab) {
      throw new Error("Lab not found");
    }
    const students = await studentModel.find({
      rollno: { $gte: lab.strollno, $lte: lab.endrollno },
      department: lab.department,
      division: lab.division,
      year: lab.year,
    });
    if (students.length === 0) {
      throw new Error("No students found for this lab");
    }
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.fetchLabAttendance = async (labid) => {
  // Fetch attendance for a specific labId and populate the required fields
  try {
    console.log("Fetching lab attendance data for lab:", labid);
    const attendance = await labattendanceModel.find({ labid });

    if (!attendance || attendance.length === 0) {
      return null;
    }

    // Format the attendance data as needed
    

    return attendance;
  } catch (error) {
    console.error("Error fetching lab attendance data:", error);
    throw new Error("Database error while fetching lab attendance.");
  }
};


module.exports.getPracticalDate = async(practicalId) => {
  try{
    const practical = await practicalModel.findById(practicalId);

    if(!practical) {
      return null;
    }
    return practical.date;
  }
  catch(error) {
    console.error("Error Fetching practical date:", error);
    throw new error("Internal server error");
  }
  
};