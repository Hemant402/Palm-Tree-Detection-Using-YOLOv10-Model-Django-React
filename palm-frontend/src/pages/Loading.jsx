import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/loading_style.css";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait 5 seconds, then redirect
    const timer = setTimeout(() => {
      navigate("/detection");   // redirect to Detection.jsx page
    }, 5000);

    return () => clearTimeout(timer); // cleanup on unmount
  }, [navigate]);

  return (
    <div className="scan">
      <div className="face"></div>
    </div>
  );
}
