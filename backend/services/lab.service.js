const labModel = require("../models/lab.model");
const LabModel = require("../models/lab.model");
const labdetailModel = require("../models/labdetail.model");
const studentModel = require("../models/student.model");

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
        labData,   // Data to update
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

  module.exports.getLabs = async (labid) => {
    try {
      const lab = await labdetailModel.find({ labid });
      if (!lab) {
        return null;
      }
      return lab;
    } catch (error) {
      console.error("Error fetching labs:", error);
      throw error;
    }
  };
  
  module.exports.addLab = async (labid, labData) => {
    try {
      // Find the course by the custom courseId
      const lab = await labModel.findOne({ labid });
      if (!lab) {
        console.error("lab not found");
        return null;
      }
  
      // Create a new lecture document with the custom courseId
      const newLab = new labdetailModel({ ...labData, labid });
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
  console.log("Lab details:", lab);

  // Fetch students matching the lab criteria
  const students = await studentModel.find({
    rollno: { $gte: lab.strollno, $lte: lab.endrollno },
    department: lab.department,
    division: lab.division,
    class: lab.class,
  });

  return students;
};