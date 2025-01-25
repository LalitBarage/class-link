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

module.exports.getPracticalDateById = async (practicalId) => {
  try {
    // Query the database for the lecture with the given lectureId
    const practical = await practicalModel.findById(practicalId);

    if (!practical) {
      return null; // If no lecture found, return null
    }

    // Return the date of the lecture
    return practical.date; // Assuming the Lecture model has a 'date' field
  } catch (err) {
    console.error("Error fetching practical date:", err);
    throw new Error("Service layer error");
  }
};

module.exports.getStudentLectureCounts = async (labid, studentId) => {
  try {
    // Fetch total lectures and attended lectures for the given course and student
    const attendanceRecords = await labattendanceModel.find({ labid, "students.studentId": studentId });

    if (!attendanceRecords.length) {
      return null;
    }

    const totalLabs = attendanceRecords.length;
    const attendedLabs = attendanceRecords.reduce((count, record) => {
      const student = record.students.find((s) => s.studentId.toString() === studentId);
      return student && student.status === "Present" ? count + 1 : count;
    }, 0);

    // Fetch student details
    const student = await studentModel.findById(studentId).select("fullname rollno");

    if (!student) {
      throw new Error("Student not found");
    }

    return {
      studentId,
      fullname: `${student.fullname.firstname} ${student.fullname.lastname}`,
      rollno: student.rollno,
      totalLabs,
      attendedLabs,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

