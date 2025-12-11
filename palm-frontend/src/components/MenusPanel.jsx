import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MenuPanel() {
  const [menus, setMenus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [menuName, setMenuName] = useState("");
  const [menuIcon, setMenuIcon] = useState("");
  const [menuLink, setMenuLink] = useState("");

  const API = "http://127.0.0.1:8000/api/palm";

  // Load menus
  const fetchMenus = () => {
    axios.get(`${API}/menus/`).then((res) => setMenus(res.data));
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Open modal for Add or Edit
  const openModal = (menu = null) => {
    setShowModal(true);

    if (menu) {
      // EDIT MODE
      setEditId(menu.id);
      setMenuName(menu.menu_name);
      setMenuIcon(null); 
      setMenuLink(menu.menu_link);
      setSelectedMenu(menu);
    } else {
      // ADD MODE
      setEditId(null);
      setMenuName("");
      setMenuIcon(null);
      setMenuLink("");
      setSelectedMenu(null);
    }
  };

  // Save Menu (create or update)
 const saveMenu = () => {
  const formData = new FormData();
  formData.append("menu_name", menuName);
  formData.append("menu_link", menuLink);

  if (menuIcon) {
    formData.append("menu_icon", menuIcon);
  }

  if (editId) {
    axios.post(`${API}/menus/update/${editId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(() => {
      fetchMenus();
      setShowModal(false);
    });
  } else {
    axios.post(`${API}/menus/add/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(() => {
      fetchMenus();
      setShowModal(false);
    });
  }
};


  // Delete Menu
  const deleteMenu = (id) => {
    if (window.confirm("Delete this menu?")) {
      axios.delete(`${API}/menus/delete/${id}/`).then(fetchMenus);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Menu Management</h2>

      <button onClick={() => openModal()} style={{padding: "10px 15px",marginBottom: "20px",background: "#4a63e7",color: "white",border: "none",borderRadius: "5px",}}>+ Add Menu</button>

      {/* Menu Table */}
      <table width="100%" cellPadding="10" style={{ borderCollapse: "collapse", background: "white", padding: "2px"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Menu Name</th>
            <th>Icon</th>
            <th>Link</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.menu_name}</td>
              <td>{m.menu_icon ? (<img src={`http://127.0.0.1:8000${m.menu_icon}`} alt="icon" width="40" height="40" style={{ objectFit: "contain", borderRadius: "5px", border: "1px solid #ddd" }}/>) : ("No Icon")}</td>
              <td>{m.menu_link}</td>
              <td>{m.menu_created_at?.slice(0, 10)}</td>
              <td>
                <button onClick={() => openModal(m)} style={{ marginRight: "10px", marginTop: "4px", marginBottom: "4px", background: "#4a63e7", padding: "4px 8px", border: "none", color: "white", borderRadius: "4px", }}>Edit</button>
                <button onClick={() => deleteMenu(m.id) } style={{ marginTop: "4px", marginBottom: "4px", background: "red", padding: "6px 12px", border: "none", color: "white", borderRadius: "4px"}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={{position: "fixed",top: "0",left: "0",width: "100%",height: "100%",background: "rgba(0,0,0,0.4)",display: "flex",justifyContent: "center",alignItems: "center",}}>
          <div style={{background: "white",padding: "20px",width: "400px",borderRadius: "10px",}}>
            <h3>{editId ? "Edit Menu" : "Add Menu"}</h3>

            <label>Menu Name</label>
            <input
              value={menuName} placeholder="Enter menu title"
              onChange={(e) => setMenuName(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>Menu Icon</label>
            <input type="file" accept="image/png" onChange={(e) => setMenuIcon(e.target.files[0])} style={{ marginBottom: "15px" }}
            />

            {menuIcon && (
                <img src={URL.createObjectURL(menuIcon)} alt="menu-icon" width="60" style={{ marginBottom: "15px", display: "block", border: "1px solid #ddd", padding: "5px", borderRadius: "5px"}}/>
            )}

            {!menuIcon && editId && selectedMenu?.menu_icon && (
              <img src={`http://127.0.0.1:8000${selectedMenu.menu_icon}`} alt="existing menu icon" width="60" style={{ marginBottom: "15px", display: "block", border: "1px solid #ddd", padding: "5px",borderRadius: "5px"}}/>)}


            <label>Menu Link</label>
            <input
              value={menuLink} placeholder="Enter a Menu link"
              onChange={(e) => setMenuLink(e.target.value)}
              style={{ width: "100%", marginBottom: "15px" }}
            />

            <button
              onClick={saveMenu} style={{padding: "10px",width: "100%", background: "#4a63e7", color: "white", border: "none", borderRadius: "5px", marginBottom: "10px",}}>Save</button>

            <button onClick={() => setShowModal(false)} style={{ padding: "10px",width: "100%",background: "#aaa",color: "white",border: "none",borderRadius: "5px",}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  ); 
};


