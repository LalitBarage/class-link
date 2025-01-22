import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Student from "./Components/Student";
import Faculty from "./Components/Faculty";
import Course from "./Components/Course";
import AddLab from "./Components/AddLab";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Course />} />
        <Route path="/addlab" element={<AddLab />} />
        <Route path="/student" element={<Student />} />
        <Route path="/faculty" element={<Faculty />} />
      </Routes>
    </div>
  );
};

export default App;
