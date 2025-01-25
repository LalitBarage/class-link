import { useContext, useEffect } from "react";

import axios from "axios";
import { Context } from "./main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Home from "./Components/Home"

function App() { 
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
  useContext(Context);

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
        setUser({});
      }
    };

    fetchUser(); // Fetch user data on app mount
  }, [setIsAuthenticated, setUser]);

  return (
    <>
    <Router>
        {isAuthenticated && <Navbar />}
        <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        </Routes>
      </Router>
    </>
  )
};

export default App;