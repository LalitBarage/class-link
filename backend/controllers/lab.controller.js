const labService = require("../services/lab.service");

// Create a new lab
exports.createLab = async (req, res, next) => {
  try {
    const labData = req.body; // Extract data from the request body
    const lab = await labService.createLab(labData); // Call the service to create a lab
    res.status(201).json({
      success: true,
      message: "Lab created successfully",
      lab,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create lab",
    });
  }
};

// Get all labs
exports.getAllLabs = async (req, res, next) => {
  try {
    const labs = await labService.getAllLabs(); // Call the service to fetch all labs
    res.status(200).json({
      success: true,
      labs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch labs",
    });
  }
};

// Update an existing lab
exports.updateLab = async (req, res, next) => {
    try {
      const { labid } = req.params; // Extract labid from URL parameters
      const labData = req.body; // Extract the updated data from the request body
  
      // Find and update the lab with the specified labid
      const updatedLab = await labService.updateLab(labid, labData);
  
      if (!updatedLab) {
        return res.status(404).json({
          success: false,
          message: "Lab not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Lab updated successfully",
        lab: updatedLab,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update lab",
      });
    }
  };
  

  // Delete a lab
exports.deleteLab = async (req, res, next) => {
    const { labid } = req.params;
    try {
       // Extract labid from URL parameters
  
      // Call service to delete the lab with the specified labid
      const deletedLab = await labService.deleteLab(labid);
  
      if (!deletedLab) {
        return res.status(404).json({
          success: false,
          message: "Lab not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Lab deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete lab",
      });
    }
  };
  

  // Search labs by name or other fields
exports.searchLabs = async (req, res, next) => {
    try {
      const { query } = req.query; // Get search query from URL query parameter
  
      // Call service to search labs based on the query
      const labs = await labService.searchLabs(query);
  
      res.status(200).json({
        success: true,
        labs,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to search labs",
      });
    }
  };
  
