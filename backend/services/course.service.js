const studentModel = require("../models/student.model");
const courseModel = require("../models/course.model");
const lectureModel = require("../models/lecture.model");
const attendanceModel = require("../models/attendance.model");

module.exports.createCourse = async (courseData) => {
  try {
    const course = new courseModel(courseData);
    await course.save();
    return course;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

module.exports.getAllCourses = async () => {
  try {
    const courses = await courseModel.find();
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

module.exports.updateCourse = async (courseId, updateData) => {
  try {
    const course = await courseModel.findOneAndUpdate(
      { courseId },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    return course;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

module.exports.deleteCourse = async (courseId) => {
  try {
    const result = await courseModel.findOneAndDelete({ courseId });
    return result;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

module.exports.getLectures = async (courseId) => {
  try {
    const lecture = await lectureModel.find({ courseId });
    if (!lecture) {
      return null;
    }
    return lecture;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw error;
  }
};

module.exports.addLecture = async (courseId, lectureData) => {
  try {
    // Find the course by the custom courseId
    const course = await courseModel.findOne({ courseId });
    if (!course) {
      console.error("Course not found");
      return null;
    }

    // Create a new lecture document with the custom courseId
    const newLecture = new lectureModel({ ...lectureData, courseId });
    await newLecture.save();

    // Return the newly created lecture document
    return newLecture;
  } catch (error) {
    console.error("Error adding lecture:", error);
    throw error;
  }
};

module.exports.getStudentsByCourseId = async (courseId) => {
  try {
    // Find the course by courseId
    const course = await courseModel.findOne({ courseId });

    if (!course) {
      throw new Error("Course not found");
    }

    // Find students matching the course's year, department, and division
    const students = await studentModel.find({
      year: course.year,
      department: course.department,
      division: course.division,
    });

    if (students.length === 0) {
      throw new Error("No students found for this course");
    }

    return students;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports.createAttendance = async (courseId, lectureId, { students }) => {
  try {
    const attendance = new attendanceModel({
      courseId,
      lectureId,
      students,
    });

    await lectureModel.findByIdAndUpdate(lectureId, { status: true });
    // Save to the database
    return await attendance.save();
  } catch (error) {
    throw new Error(`Error creating attendance: ${error.message}`);
  }
};

// Get attendance by lecture ID
module.exports.getAttendanceByLecture = async (lectureId) => {
  try {
    // Fetch attendance record and populate student details
    const attendance = await attendanceModel.findOne({ lectureId });

    if (!attendance) {
      throw new Error("Attendance record not found.");
    }

    // Format the attendance data

    return attendance;
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
};

// Update attendance for a lecture
module.exports.updateAttendance = async (courseId, lectureId, students) => {
  try {
    // Update attendance for specific course and lecture
    const updatedAttendance = await attendanceModel.findOneAndUpdate(
      { courseId, lectureId }, // Query to find the document
      { $set: { students } }, // Update the students array
      { new: true } // Return the updated document
    );

    if (!updatedAttendance) {
      throw new Error(
        "Attendance record not found for the given course and lecture."
      );
    }

    return updatedAttendance;
  } catch (error) {
    throw new Error(`Error updating attendance: ${error.message}`);
  }
};

module.exports.getAttendanceByCourse = async (courseId) => {
  try {
    // Fetch attendance records for a specific course
    const attendance = await attendanceModel.find({ courseId });

    if (!attendance) {
      throw new Error("Attendance records not found.");
    }

    return attendance;
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
};

module.exports.getLectureDateById = async (lectureId) => {
  try {
    // Query the database for the lecture with the given lectureId
    const lecture = await lectureModel.findById(lectureId);

    if (!lecture) {
      return null; // If no lecture found, return null
    }

    // Return the date of the lecture
    return lecture.date; // Assuming the Lecture model has a 'date' field
  } catch (err) {
    console.error("Error fetching lecture date:", err);
    throw new Error("Service layer error");
  }
};

module.exports.getStudentLectureCounts = async (courseId, studentId) => {
  try {
    // Fetch total lectures and attended lectures for the given course and student
    const attendanceRecords = await attendanceModel.find({ courseId, "students.studentId": studentId });

    if (!attendanceRecords.length) {
      return null;
    }

    const totalLectures = attendanceRecords.length;
    const attendedLectures = attendanceRecords.reduce((count, record) => {
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
      totalLectures,
      attendedLectures,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
