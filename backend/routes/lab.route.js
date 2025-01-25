const express = require("express");
const router = express.Router();
const labController = require("../controllers/lab.controller");

// Route to create a new lab
router.post("/create", labController.createLab);

// Route to fetch all labs
router.get("/all", labController.getAllLabs);

router.put("/update/:labid", labController.updateLab); // Route to update a lab
router.delete("/delete/:labid", labController.deleteLab); // Route to delete a lab
router.get("/search", labController.searchLabs);

router.get("/:labid/practical", labController.getPracticals); //done1

router.post("/:labid/practical", labController.addPractical);

router.get("/:labid/students", labController.getStudents);

router.post(
  "/:labid/practical/:practicalId/attendance",
  labController.createAttendance
);

router.get(
  "/:courseId/practical/:practicalId/attendance",
  labController.getAttendanceByLab
);
router.put(
  "/:labid/practical/:practicalId/attendance",
  labController.updateAttendance
);




module.exports = router;

