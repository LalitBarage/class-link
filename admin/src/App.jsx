import { useContext, useEffect } from "react";
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
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/admin/profile",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };

    fetchUser();
  }, [setIsAuthenticated, setUser]);

  return (
    <div>
      <Router>
        {isAuthenticated && <Navbar />} {/* Conditionally render Navbar */}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Course /> : <Login />} />
          <Route
            path="/addlab"
            element={isAuthenticated ? <AddLab /> : <Login />}
          />
          <Route
            path="/student"
            element={isAuthenticated ? <Student /> : <Login />}
          />
          <Route
            path="/faculty"
            element={isAuthenticated ? <Faculty /> : <Login />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
