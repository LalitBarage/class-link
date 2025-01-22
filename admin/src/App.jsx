import {useContext, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Student from "./Components/Student";
import Faculty from "./Components/Faculty";
import Course from "./Components/Course";
import AddLab from "./Components/AddLab";
import { Context } from "./main";
import Login from "./Components/Login";
import axios from "axios";

const App = () => {
  const { isAuthenticated, setIsAuthenticated,user, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/admin/profile",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user); 
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
  
    fetchUser(); 
  }, []);
  return (
    <div>
     
      <Router>
      <Navbar />
        <Routes>
      <Route path="/" element={isAuthenticated ? <Course /> : <Login />} />
        <Route path="/addlab" element={<AddLab />} />
        <Route path="/student" element={<Student />} />
        <Route path="/faculty" element={<Faculty />} />
      </Routes>
      </Router>

    </div>
  );
};

export default App;
