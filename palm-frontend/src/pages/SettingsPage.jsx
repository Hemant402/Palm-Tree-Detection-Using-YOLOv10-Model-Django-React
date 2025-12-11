import React, { useState } from "react";

import SettingsSidebar from "../components/SettingsSidebar";
import UsersPanel from "../components/UsersPanel";
import ImageLogoPanel from "../components/ImageLogoPanel";
import MenusPanel from "../components/MenusPanel";
import ReportsPanel from "../components/ReportsPanel";
import AboutUsPanel from "../components/AboutUsPanel";

const SettingsPage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
  // default menu
  const [activeMenu, setActiveMenu] = useState("logo-title");
  

  // Block normal users
  if (!user?.is_staff && !user?.is_superuser) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>⚠ Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
    
      {/* Sidebar */}
      <SettingsSidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        user={user}
      />

      {/* Right Panels */}
      <div style={styles.contentArea}>
        {/* Panels */}
        {activeMenu === "users" && <UsersPanel user={user} />}
        {activeMenu === "images" && <ImageLogoPanel />}
        {activeMenu === "menus" && <MenusPanel />}
        {activeMenu === "reports" && <ReportsPanel />}
        {activeMenu === "aboutus" && <AboutUsPanel />}
      </div>
    </div>
  );
};

// Inline Styles (you can replace with CSS)
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    backgroundColor: "#f7f8fa",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "#4a63e7",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
    zIndex: 10,
  },
  contentArea: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },
};

export default SettingsPage;
