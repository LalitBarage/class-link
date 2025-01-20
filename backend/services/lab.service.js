const LabModel = require("../models/lab.model");

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

  
  
