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
    // Fetch attendance record
    const attendance = await attendanceModel
      .findOne({ lectureId })
      .populate("attendance.students.studentId");

    if (!attendance) {
      throw new Error("Attendance record not found.");
    }

    return attendance;
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
};

// Update attendance for a lecture
module.exports.updateAttendance = async (lectureId, students) => {
  try {
    const updatedAttendance = await attendanceModel.findOneAndUpdate(
      { courseId },
      { lectureId },
      { $set: { students } },
      { new: true }
    );

    if (!updatedAttendance) {
      throw new Error("Attendance record not found.");
    }

    return updatedAttendance;
  } catch (error) {
    throw new Error(`Error updating attendance: ${error.message}`);
  }
};
