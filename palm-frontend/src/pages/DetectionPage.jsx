import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/detection_style.css";
function DetectionPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const API_URL = "http://127.0.0.1:8000/api/palm/detect-palms/";

  const handleDetect = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setResults(res.data?.data || []);
    } catch (error) {
      console.error("Detection error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      {/* Back Button */}
      <div className="back-btn mt-4">
        <button className="btn" onClick={() => navigate("/dashboard")}>
            ← Back
        </button>
        </div>

<div className="detect-layout-container">

  {/* LEFT SIDE - Detect Container */}
  <div className="left-detect">
    <h2 className="text-center mb-4">Palm Detection</h2>
    <div className="detect-card">
      <div className="text-center mb-4">
        <button onClick={handleDetect} className="btn btn-success btn-lg px-5 py-3 detect-btn">
          {loading ? "Detecting..." : "Detect"}
        </button>
      </div>

      {/* Optional: Add placeholder for detection preview or text */}
      <div className="detect-info">
        <p>Click detect to process palm images from the database.</p>
      </div>

    </div>
  </div>

  {/* RIGHT SIDE - Scrollable Table */}
  <div className="right-table">

    {results.length > 0 && (
      <div className="table-wrapper">

        <h4 className="table-title">Detected Palm Images</h4>

        <div className="scroll-table-wrapper">
          <table className="table table-bordered table-striped detect-table">
            <thead className="table-dark">
              <tr>
                <th>Original Image</th>
                <th>Detected Image</th>
                <th>Palm Count</th>
              </tr>
            </thead>

            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td><img src={`http://127.0.0.1:8000/media/${item.original}`} alt="original" className="table-img"/></td>

                  <td><img src={`http://127.0.0.1:8000/media/${item.detected}`} alt="detected" className="table-img"/></td>
                  <td className="text-center">
                    <span className="badge bg-success fs-5">
                      {item.palm_count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    )}
  </div>

</div>


    </div>
  );
}

export default DetectionPage;
