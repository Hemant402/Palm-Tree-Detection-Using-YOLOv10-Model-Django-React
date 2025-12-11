import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/Results.css";

const Results = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;

const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;
const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

const totalPages = Math.ceil(tableData.length / rowsPerPage);
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/palm/getDetections/");
      setTableData(response.data);
    } catch (error) {
      console.error("Error loading detections:", error);
    }
  };

  const downloadPDF = () => {
    window.open("http://localhost:8000/api/palm/downloadReportPDF/", "_blank");
  };




  return (
    <div className="results-page">

      {/* Header Row */}
      <div className="results-header">
        <div className="left-side">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        </div>

        <div className="right-side">
        <button className="download-btn" onClick={downloadPDF}>
          ⬇ Download PDF
        </button>
        </div>
      </div>

      <h2 className="results-title">Palm Detection Report</h2>

      {/* Scrollable Table */}
    <div className="scroll-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th>Image ID</th>
              <th>Admin ID</th>
              <th>Palm ID</th>
              <th>X Min</th>
              <th>Y Min</th>
              <th>X Max</th>
              <th>Y Max</th>
              <th>Confidence</th>
              <th>Date Processed</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row, index) => (
                <tr key={index}>
                    <td>{row.image_id}</td>
                    <td>{row.admin_id}</td>
                    <td>{row.palm_id}</td>
                    <td>{row.x_min}</td>
                    <td>{row.y_min}</td>
                    <td>{row.x_max}</td>
                    <td>{row.y_max}</td>
                    <td>{row.confidence}</td>
                    <td>{row.date_processed}</td>
                </tr>
                ))}
          </tbody>
        </table>
      </div>
       <div className="pagination">
        <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
        >
            Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
            <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
            >
            {i + 1}
            </button>
        ))}

        <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
        >
            Next
        </button>
        </div>
    </div>
  );
};

export default Results;
