import React from "react";
import { useNavigate } from "react-router-dom";
const SettingsSidebar = ({ activeMenu, setActiveMenu, user }) => {
   const navigate = useNavigate();
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Settings</h2>

      {/* Super Admin only */}
      {user?.is_superuser && (
        <button style={activeMenu === "users" ? styles.activeBtn : styles.btn}onClick={() => setActiveMenu("users")}>
          Users
        </button>
      )}
      <button style={activeMenu === "images" ? styles.activeBtn : styles.btn}onClick={() => setActiveMenu("images")}>
        Title & Logo
      </button>

      <button style={activeMenu === "menus" ? styles.activeBtn : styles.btn}onClick={() => setActiveMenu("menus")}>
        Menus
      </button>

      <button style={activeMenu === "reports" ? styles.activeBtn : styles.btn} onClick={() => setActiveMenu("reports")}>
        Reports
      </button>

       <button style={activeMenu === "aboutus" ? styles.activeBtn : styles.btn}onClick={() => setActiveMenu("aboutus")}>
        About US
      </button>

      <button style={styles.backButton} onClick={() => navigate("/dashboard")}> ← Back</button>
      </div>
  );
};

const styles = {
  sidebar: {
    width: "260px",
    backgroundColor: "#1a1f36",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    height: "100vh",
    position: "relative",
    top: 0,
    left: 0,
  },
  title: {
    marginBottom: "20px",
    fontSize: "22px",
    textAlign: "center",
  },
  btn: {
    padding: "12px",
    backgroundColor: "#2a3148",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "left",
  },
  activeBtn: {
    padding: "12px",
    backgroundColor: "#4a63e7",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "left",
  },
  backButton: {
    marginTop: "auto",                 // pushes it to bottom
    padding: "12px",
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
}
}
export default SettingsSidebar;
