import React, { useEffect, useState } from "react";

const UsersPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    date_joined: "",
  });

  // Fetch all users
  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const validateForm = () => {
  const newErrors = {};

  // Validate ONLY fields that user has filled or touched

  if (formData.first_name.trim() === "") {
    newErrors.first_name = "First name is required.";
  } else if (!/^[A-Za-z]{3,}$/.test(formData.first_name)) {
    newErrors.first_name = "First name must be at least 3 letters.";
  }

  if (formData.last_name.trim() === "") {
    newErrors.last_name = "Last name is required.";
  } else if (!/^[A-Za-z]{3,}$/.test(formData.last_name)) {
    newErrors.last_name = "Last name must be at least 3 letters.";
  }

  if (formData.username.trim() === "") {
    newErrors.username = "Username is required.";
  } else if (!/^[A-Za-z0-9]{4,}$/.test(formData.username)) {
    newErrors.username = "Username must be at least 4 characters.";
  }

  if (formData.email.trim() === "") {
    newErrors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email.";
  }

  if (formData.password.trim() !== "" && formData.confirm_password.trim() !== "") {
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match.";
    }
  }

  if (formData.password.trim() !== "") {
    const passwordStrong =
      /[a-z]/.test(formData.password) &&
      /[A-Z]/.test(formData.password) &&
      /[0-9]/.test(formData.password) &&
      /[^A-Za-z0-9]/.test(formData.password) &&
      formData.password.length >= 8;

    if (!passwordStrong) {
      newErrors.password =
        "Password must include uppercase, lowercase, digit, special character, and be at least 8 characters long.";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleStaffCreate = async () => {
     if (!validateForm()) return;
    try {
      const res = await fetch("http://localhost:8000/api/users/create-staff/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (res.ok) {
        alert("Staff user created!");
        setShowAddModal(false);
        loadUsers();
      } else {
        alert("Failed to create staff user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/users/delete/${id}/`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        alert("User deleted");
        loadUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

// UPDATE existing user
const handleUpdateUser = async () => {
  try {
    const res = await fetch(`http://localhost:8000/api/users/update/${editingUser.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("User updated successfully!");
      setShowEditModal(false);
      loadUsers();
    } else {
      alert("Failed to update user");
    }
  } catch (err) {
    console.error("Update error:", err);
  }
};


  return (
    <div style={{ padding: "10px" }}>
      <h2>Users Management</h2>

      {/* Add Staff Button */}
      <button style={styles.addBtn} onClick={() => setShowAddModal(true)}> + Add Staff</button>

      {/* Users Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Staff</th>
            <th>Superuser</th>
            <th>Date Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.is_staff ? "✔" : "❌"}</td>
              <td>{u.is_superuser ? "✔" : "❌"}</td>
              <td>{u.date_joined?.substring(0, 10) || "N/A"}</td>
              <td>
                <button 
                  style={styles.editBtn}
                  onClick={() => {
                    setEditingUser(u);
                    setFormData({
                        first_name: u.first_name,
                        last_name: u.last_name,
                        username: u.username,
                        email: u.email,
                        password: "",
                        confirm_password: "",
                        date_joined: u.date_joined?.substring(0, 10),
                      });
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>

                {!u.is_superuser && (
                  <button style={styles.deleteBtn}onClick={() => deleteUser(u.id)} > Delete </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div style={styles.modalBackground}>
          <div style={styles.modal}>
            <h3>Create Staff User</h3>

            <input name="first_name" placeholder="First Name" onChange={handleChange} required/>
            {errors.first_name && <p style={styles.error}>{errors.first_name}</p>}
            <input name="last_name" placeholder="Last Name" onChange={handleChange} required/>
            {errors.last_name && <p style={styles.error}>{errors.last_name}</p>}
            <input name="username" placeholder="Username" onChange={handleChange} required/>
            {errors.username && <p style={styles.error}>{errors.username}</p>}
            <input name="email" placeholder="Email" onChange={handleChange} required/>
            {errors.email && <p style={styles.error}>{errors.email}</p>}
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
            {errors.password && <p style={styles.error}>{errors.password}</p>}
            <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange}
             required/>
             {errors.confirm_password && <p style={styles.error} className="errorMessage">{errors.confirm_password}</p>}
            <button onClick={handleStaffCreate}>Add</button>
            <button onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showEditModal && (
              <div style={styles.modalBackground}>
                <div style={styles.modal}>
                  <h3>Edit User</h3>
                  <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange}/>
                  <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange}/>
                  <input name="username" placeholder="Username" value={formData.username} onChange={handleChange}/>
                  <input name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <input type="password"name="password" placeholder="New Password (optional)" value={formData.password} onChange={handleChange}/>
                  <input type="password" name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange}/>
                  <button onClick={handleUpdateUser}>Update</button>
                  <button onClick={() => setShowEditModal(false)}>Close</button>
                </div>
              </div>
            )}


    </div>
  );
};

const styles = {
  addBtn: {
    background: "#4a63e7",
    padding: "10px 16px",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
    marginBottom: "15px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },

  editBtn: {
    background: "#4a63e7",
    padding: "4px 8px",
    border: "none",
    color: "white",
    borderRadius: "4px",
    marginRight: "10px",
    marginBottom: "4px",
  },

  deleteBtn: {
    background: "red",
    padding: "6px 12px",
    border: "none",
    color: "white",
    borderRadius: "4px",
  },

  modalBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    background: "white",
    padding: "20px",
    width: "400px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  error: {
    color: "red",
    fontSize: "14px",
    fontWeight: "8",
  },
};

export default UsersPanel;
