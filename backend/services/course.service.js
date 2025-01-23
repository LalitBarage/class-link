const courseModel = require("../models/course.model");
const lectureModel = require("../models/lecture.model");

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
    const course = await lectureModel.findOne({ courseId });
    if (!course) {
      return null;
    }
    return course.lectures;
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
