import { useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "./main";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Home from "./Components/Home";
import CourseReport from "./Components/CourseReport";
import LabReport from "./Components/LabReport";

function App() {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/student/profile",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data); // Store user data in Context
      } catch (error) {
        setIsAuthenticated(false);
        setUser({}); // Handle failure case
      }
    };

    fetchUser(); // Fetch user data on app mount
  }, [setIsAuthenticated, setUser]);

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/course/:courseId/report"
          element={isAuthenticated ? <CourseReport /> : <Navigate to="/login" />}
        />
        <Route
          path="/lab/:labid/report"
          element={isAuthenticated ? <LabReport /> : <Navigate to="/login" />}
        />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
