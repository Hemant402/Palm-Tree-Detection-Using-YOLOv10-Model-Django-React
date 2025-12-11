// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function ImageLogoPanel() {
//   const [title, setTitle] = useState("");
//   const [logo, setLogo] = useState(null);
//   const [preview, setPreview] = useState("");

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/api/palm/dashboard-design/").then(res => {
//       setTitle(res.data.title);
//       setPreview(res.data.logo);
//     });
//   }, []);

//   const handleSave = () => {
//     const formData = new FormData();
//     formData.append("title", title);
    
//     if (logo) formData.append("logo", logo);

//     axios.put("http://127.0.0.1:8000/api/palm/dashboard-design/update/", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     }).then(() => alert("Saved Successfully"));
//   };

//   return (
//     <div>
//       <h2>Dashboard Design Settings</h2>

//       <label>Dashboard Title</label>
//       <input value={title} onChange={e => setTitle(e.target.value)} />

//       <label>Dashboard Logo</label>
//       <input type="file" onChange={e => setLogo(e.target.files[0])} />

//       {preview && <img src={preview} alt="logo" width="120" />}

//       <button onClick={handleSave}>Save</button>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ImageLogoPanel() {
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch existing system settings
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/palm/dashboard-design/")
      .then((res) => {
        setTitle(res.data.title || "");
        setPreview(res.data.logo || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // When user chooses a new file → update preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("title", title);

    if (logo) formData.append("logo", logo);

    axios
      .put(
        "http://127.0.0.1:8000/api/palm/dashboard-design/update/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then(() => alert("✔ Saved Successfully"))
      .catch(() => alert("❌ Error saving changes"));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "20px auto",
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Dashboard Design Settings
      </h2>

      {/* Title Field */}
      <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
        Dashboard Title
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      />

      {/* Logo Input */}
      <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
        Dashboard Logo
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        style={{
          marginBottom: "15px",
        }}
      />

      {/* Image Preview */}
      {preview && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={preview}
            alt="logo"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "contain",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "8px",
              background: "#fafafa",
            }}
          />
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "12px",
          background: "#4a63e7",
          color: "white",
          fontSize: "16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Save Changes
      </button>
    </div>
  );
}

