import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
// import Home from "./Components/Home";
// import Student from "./Components/Student";
// import Faculty from "./Components/Faculty";
// import Course from "./Components/Course";
// import AddLab from "./Components/AddLab";
import FHome from "./Components/FacultyModule/FHome";
import CourseReport from "./Components/FacultyModule/CourseReport";
// import Course from "./Admin/Course";

const App = () => {
  return (
     <div>
    
    {/* //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/student" element={<Student />} />
    //     <Route path="/faculty" element={<Faculty />} />
    //     <Route path="/course" element={<Course />} />
    //     <Route path="/addlab" element={<AddLab />} />
    //   </Routes> */}
    <Routes>
      <Route path="/" element={<FHome/>}/>
      <Route path="/report" element={<CourseReport/>}/>
    </Routes>
    
</div>
    
  );
};

export default App;