import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/AddDetails.css";

const AddDetails = () => {
  const [images, setImages] = useState([]);
  const [fileNames, setFileNames] = useState([]);
//   const [previewURLs, setPreviewURLs] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  // Handle file selection + validation + preview
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];
    const names = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is too large! Max file size is 5 MB.`);
      } else {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    setImages(validFiles);
    setFileNames(names); 
    // setPreviewURLs(previews);
  };

                // Upload files to backend
                const handleUpload = async () => {
                  if (images.length === 0) {
                    alert("Please select at least one image!");
                    return;
                  }

                  try {
                    const formData = new FormData();
                    formData.append("admin_id", 1);

                    images.forEach((img) => {
                      formData.append("images", img);
                    });

                    await axios.post("http://localhost:8000/api/palm/uploadPalmImage/", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });

                    // Show success animation
                    setShowSuccess(true);
                    setImages([]);
                  //   setPreviewURLs([]);

                    setTimeout(() => {
                      setShowSuccess(false);
                    }, 2000);

                  } catch (error) {
                    console.error(error);
                    alert("Error uploading image!");
                  }
                };

                React.useEffect(() => {
                fetchTableData();
              }, []);

              const fetchTableData = async () => {
                try {
                  const response = await axios.get("http://localhost:8000/api/palm/getPalmImages/");
                  setTableData(response.data); 
                } catch (error) {
                  console.error("Error fetching table data:", error);
                }
              };

              const handleDelete = async (imageId) => {
                if (!window.confirm("Are you sure you want to delete this image?")) return;

                try {
                  await axios.delete(`http://localhost:8000/api/palm/deletePalmImage/${imageId}/`);

                  // Refresh table after delete
                  fetchTableData();

                } catch (error) {
                  console.error("Delete error:", error);
                  alert("Error deleting the image!");
                }
              };

  return (
    <div className="upload-pages">

      {/* Back Button */}
      <div className="back-btn-wrapper" style={{width: "100%", display: "flex", justifyContent: "flex-start"}}>
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>
      </div>

      {/* Success Animation */}
      {/* {showSuccess && (
        <div className="success-popup">
          <div className="success-check">✔</div>
          <p>Uploaded Successfully!</p>
        </div>
      )}

      <div className="upload-card">
        <h2 className="upload-title">Upload Palm Images</h2>

        <div className="upload-box">

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="file-input"
          /> */}

          {/* Image Preview Grid */}
          {/* {previewURLs.length > 0 && (
            <div className="preview-grid">
              {previewURLs.map((src, index) => (
                <img key={index} src={src} alt="Preview" className="preview-img" />
              ))}
            </div>
          )} */}

           {/* {fileNames.length > 0 && (
            <div className="file-name-list">
                <strong>Selected Files:</strong>
                <ul>
                {fileNames.map((name, index) => (
                <li key={index}>{name}</li>
                ))}
                </ul>
            </div>
            )}


          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={images.length === 0}
          >
            Upload
          </button>
        </div>
      </div> */}
      {/* Scrollable Table Section */}
        {/* <div className="table-container">
          <h3 className="table-title">Uploaded Palm Images</h3>

          <div className="scroll-table-wrapper">
            <table className="scroll-table">
              <thead>
                <tr>
                  <th>Image ID</th>
                  <th>Filename</th>
                  <th>Image</th>
                  <th>Date Processed</th>
                  <th>Palm Count</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.image_id}</td>
                    <td>{row.filename}</td>
                    <td>
                        <img 
                          src={row.image_url} 
                          alt={row.filename} 
                          className="table-thumb"
                        /></td>
                    <td>{row.date_processed}</td>
                    <td>{row.palm_count}</td>
                    <td><button className="delete-btn" onClick={() => handleDelete(row.image_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
                        {/* Success Animation */}
                        {showSuccess && (
                          <div className="success-popup">
                            <div className="success-check">✔</div>
                            <p>Uploaded Successfully!</p>
                          </div>
                        )}

                        <div className="left-right-container">

                          {/* LEFT SIDE – Upload Section */}
                          <div className="left-upload">
                            <div className="upload-card">
                              <h2 className="upload-title">Upload Palm Images</h2>

                              <div className="upload-box">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleFileSelect}
                                  className="file-input"
                                />

                                {fileNames.length > 0 && (
                                  <div className="file-name-list">
                                    <strong>Selected Files:</strong>
                                    <ul>
                                      {fileNames.map((name, index) => (
                                        <li key={index}>{name}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <button
                                  className="upload-btn"
                                  onClick={handleUpload}
                                  disabled={images.length === 0}
                                >
                                  Upload
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT SIDE – Scrollable Table */}
                          <div className="right-table">
                            <div className="table-container">
                              <h3 className="table-title">Uploaded Palm Images</h3>

                              <div className="scroll-table-wrapper">
                                <table className="scroll-table">
                                  <thead>
                                    <tr>
                                      <th>Image ID</th>
                                      <th>Filename</th>
                                      <th>Image</th>
                                      <th>Date Processed</th>
                                      <th>Palm Count</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {tableData.map((row, index) => (
                                      <tr key={index}>
                                        <td>{row.image_id}</td>
                                        <td>{row.filename}</td>
                                        <td>
                                          <img 
                                            src={row.image_url} 
                                            alt={row.filename} 
                                            className="table-thumb"
                                          />
                                        </td>
                                        <td>{row.date_processed}</td>
                                        <td>{row.palm_count}</td>
                                        <td>
                                          <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(row.image_id)}
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>

                                </table>
                              </div>
                            </div>
                          </div>

                        </div>
    </div>
  );
};

export default AddDetails;
