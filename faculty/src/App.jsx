import { useContext, useEffect } from 'react';
import './App.css'
import axios from "axios";
import { Context } from "./main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Faculty from "./Components/Faculty";
import Login from "./Components/Login"

function App() {
  const { isAuthenticated, setIsAuthenticated,user, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/faculty/profile",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.faculty); // Store user data in Context
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
  
    fetchUser(); // Fetch user data on app mount
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Faculty /> : <Login />} />
          <Route path="/login" element={<Login />} />
          
        </Routes>
    </Router>
    </>
  )
}

export default App
