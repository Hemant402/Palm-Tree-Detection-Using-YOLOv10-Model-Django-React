import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/AboutPage.css";

export default function AboutUs() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    position: "",
    interested_at: "",
    description: "",
    profile_pic: ""
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/palm/about-us/")
      .then((res) => {
         if (res.data.length > 0) {
          setData(res.data[0]);
        }
      })
      .catch(() => console.log("No About Us Data Found"));
  }, []);

  return (
    <div className="about-container">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      {/* Card */}
      <div className="about-card">
        <div className="about-image-wrapper">
          <img src={data.profile_pic? `http://127.0.0.1:8000${data.profile_pic}`: "/default-profile.png"} alt="Profile" className="about-image" />
        </div>

        <div className="about-details">
          <h2 className="about-name">{data.name || "No Name Provided"}</h2>
          <h4 className="about-role">{data.position || "No Position"}</h4><h4 className="about-interest">{data.interested_at || "No any Interest"}</h4>
          <p className="about-description">
            {data.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
}
