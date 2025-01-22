import { useContext, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Context } from "./main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
<<<<<<< HEAD
import CourseReport from "./Components/CourseReport";

=======
>>>>>>> 4173c485faff7d9b587eba9f9a8117b6a59612ea

function App() {
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/faculty/profile",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data); // Store user data in Context
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };

    fetchUser(); // Fetch user data on app mount
  }, [setIsAuthenticated, setUser]);

  return (
    <div>
      <Router>
        {isAuthenticated && <Navbar />}
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={isAuthenticated ? <Home/> : <Login />} />
          <Route path="/course" element={isAuthenticated ? <CourseReport /> : <Login />}/>         
=======
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
>>>>>>> 4173c485faff7d9b587eba9f9a8117b6a59612ea
        </Routes>
      </Router>
    </div>
  );
}

export default App;
