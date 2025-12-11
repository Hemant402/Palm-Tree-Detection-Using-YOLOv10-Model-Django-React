import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Splash.css"; // Import CSS file
// import leaf from "../assets/images/leaf.jpg";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/register");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="main-container">
    <div className="splashed">
      <div className="splash-container">
        <div className="main-text">Palm Tree Detection</div>

        <div className="text">
          <h1>Please Wait...</h1>
        </div>

        <div className="loading">
          <div className="line-box">
            <div className="line"></div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
