const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectToDb = require("./db/db");
const studentRoute = require("./routes/student.route");
const facultyRoute = require("./routes/faculty.route");
const labRoute = require("./routes/lab.route");
const courseRoute = require("./routes/course.route");

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/student", studentRoute);
app.use("/faculty", facultyRoute);
app.use("/lab", labRoute);
app.use("/course", courseRoute);

module.exports = app;
