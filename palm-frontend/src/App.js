import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from "./pages/Splash";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import AddDetails from "./pages/AddDetails";
import Loading from "./pages/Loading";
import DetectionPage from "./pages/DetectionPage";
import ResultsPage from "./pages/Results";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [user, setUser] = useState(() => {
    try {
    // Read both sessionStorage and localStorage safely
    let local = localStorage.getItem("user");
    let session = sessionStorage.getItem("user");

    // Ignore invalid "undefined" values
    if (local === "undefined") local = null;
    if (session === "undefined") session = null;

    if (local) return JSON.parse(local);
    if (session) return JSON.parse(session);
  } catch (e) {
    console.warn("Invalid stored user, clearing storage...", e);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  }
   return null;
  });

  React.useEffect(() => {
    try {
      let local = localStorage.getItem("user");
      let session = sessionStorage.getItem("user");

      if (local && local !== "undefined") {
        setUser(JSON.parse(local));
      } else if (session && session !== "undefined") {
        setUser(JSON.parse(session));
      }
    } catch (e) {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    }
  }, []);   // <-- runs only once after page loads



  return (
    <Router>
      <div>
        <Routes>
           <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
           <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
           <Route path="/add-details" element={<AddDetails />} />
           <Route path="/loading-page" element={<Loading />} />
           <Route path="/detection" element={<DetectionPage />} />
           <Route path="/results-page" element={<ResultsPage />} />
           <Route path="/about-us" element={<AboutPage />} />
           <Route path="/settings-page" element={<SettingsPage user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

