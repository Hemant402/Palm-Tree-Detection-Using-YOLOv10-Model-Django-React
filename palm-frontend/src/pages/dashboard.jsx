import React, {  useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/dashboard-style.css";  
//import logo from "../assets/images/logo.png";
// import add_details from "../assets/images/add_details.png";
// import detection from "../assets/images/scan.png";
// import reports from "../assets/images/reports.png";
// import about_us from "../assets/images/about.png";
// import settings from "../assets/images/settings.png";
import api from "../api";

export default function Dashboard({ user, setUser }) {
    //const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const logout = async () => {
    await api.post("logout/", {}, { withCredentials: true }); 
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
};
const [dashboardDesign, setDashboardDesign] = useState({});

useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/palm/dashboard-design/").then(res => setDashboardDesign(res.data));
}, []);

useEffect(() => {
  console.log("DASHBOARD USER:", user);
}, [user]);

useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/palm/menus/")
  .then(res => setMenus(res.data));
}, []);

 if (!user) {
  return <div>
    <p>Loading...</p>
    <button onClick={() => navigate("/login")}>Go to Login</button>
  </div>;
}

  return (
    <div className="main-container">

      {/* Header */}
      <header className="container-fluid">
        <button onClick={logout} className="btn btn-danger" style={{ float: "right", marginTop: "20px"}}>
          Logout
        </button>
        <img src={dashboardDesign.logo? `http://127.0.0.1:8000${dashboardDesign.logo}`: "/default-logo.png"} alt="Logo" style={{position: "absolute", height: "80px", width: "80px", marginTop: "30px"}}/>
      </header>

      <div className="row">
        
        {/* Left Column */}
        <div className="col-4">
          <h1 className="text-secondary">
            {dashboardDesign.title}
          </h1>
        </div>

        {/* Right Column */}
        <div className="col-8">
          <div className="container">

            {/* First row of hexagons */}
            <div className="hexagonArea first">
              {menus.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      className="hexagon"
                      onClick={() => navigate(item.menu_link)}
                      style={{ cursor: "pointer" }}
                    >
                      <img 
                        src={`http://127.0.0.1:8000${item.menu_icon}`} 
                        alt={item.menu_name} 
                      />
                      <h3 style={{ fontSize: "14px" }}>{item.menu_name}</h3>
                    </div>
                  ))}
             
            </div> 
             

            {/* Second row of hexagons */}
            {(user.is_staff || user.is_superuser) && (
            <div className="hexagonArea last">
              {menus.slice(3).map((item) => (
                  <div 
                    key={item.id} 
                    className="hexagon"
                    onClick={() => navigate(item.menu_link)}
                    style={{ cursor: "pointer" }}
                  >
                    <img 
                      src={`http://127.0.0.1:8000${item.menu_icon}`} 
                      alt={item.menu_name} 
                    />
                    <h3 style={{ fontSize: "14px" }}>{item.menu_name}</h3>
                  </div>
                ))}
            </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
