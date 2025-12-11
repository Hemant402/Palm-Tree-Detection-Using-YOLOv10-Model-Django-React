import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AboutUsPanel() {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [interested_at, setInterest] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  // Load data
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/palm/about-us/").then(res => {
      setCards(res.data);
    });
  }, []);

  const openModal = (card = null) => {
    setShowModal(true);

    if (card) {
      setEditId(card.card_id);
      setName(card.name);
      setPosition(card.position);
      setInterest(card.interested_at);
      setDescription(card.description);
      setPreview(card.profile_pic);
      setProfilePic(null);
    } else {
      setEditId(null);
      setName("");
      setPosition("");
      setInterest("");
      setDescription("");
      setProfilePic(null);
      setPreview("");
    }
  };

  // Save or Update
  const saveCard = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    formData.append("interested_at", interested_at);
    formData.append("description", description);
    if (profilePic) formData.append("profile_pic", profilePic);

    if (!editId) {
      // ADD
      axios
        .post("http://127.0.0.1:8000/api/palm/about-us/add/", formData)
        .then(() => {
          window.location.reload();
        });
    } else {
      // UPDATE
      axios.post(`http://127.0.0.1:8000/api/palm/about-us/update/${editId}/`,formData).then(() => window.location.reload());}};

  const deleteCard = (id) => {
    if (window.confirm("Delete this card?")) {
      axios
        .delete(`http://127.0.0.1:8000/api/palm/about-us/delete/${id}/`)
        .then(() => window.location.reload());
    }
  };

  return (
    <div>
      <h2>About Us Panel</h2>

      <button
        onClick={() => openModal()}
        style={{ marginBottom: "15px", padding: "10px", background: "#0A74DA", color: "white", border: "none", borderRadius: "5px" }}
      >
        + Add New Card
      </button>

      {/* Card List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {cards.map((c) => (
          <div
            key={c.card_id}
            style={{
              width: "250px",
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
            }}
          >
            {c.profile_pic && (
              <img
                src={`http://127.0.0.1:8000${c.profile_pic}`}
                alt="profile"
                width="100%"
                style={{ borderRadius: "10px", marginBottom: "10px" }}
              />
            )}
            <h3>{c.name}</h3>
            <p style={{ color: "#666" }}>{c.position}</p>
            <p style={{ color: "#28bb15ff" }}>{c.interested_at}</p>
            <p>{c.description}</p>

            <button
              onClick={() => openModal(c)}
              style={{ marginRight: "10px", background: "#4a63e7", padding: "5px 10px", color: "white", border: "none", borderRadius: "4px" }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteCard(c.card_id)}
              style={{ background: "red", padding: "5px 10px", color: "white", border: "none", borderRadius: "4px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalWrapper}>
          <div style={modalBox}>
            <h3>{editId ? "Edit Card" : "Add New Card"}</h3>

            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Profile Name" />

            <label>Position</label>
            <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Enter Position" />

            <label>Interest</label>
            <input value={interested_at} onChange={(e) => setInterest(e.target.value)} placeholder="Enter Interest Field" />

            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="How you describe yourself ?"/>

            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />

            {profilePic && (
              <img src={URL.createObjectURL(profilePic)} alt="Profile" width="120" style={{ marginTop: "10px" }} />
            )}

            {!profilePic && preview && (
              <img src={`http://127.0.0.1:8000${preview}`} alt="Profile " width="120" style={{ marginTop: "10px" }} />
            )}

            <button onClick={saveCard} style={saveBtn}>Save</button>
            <button onClick={() => setShowModal(false)} style={cancelBtn}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalWrapper = {
  position: "fixed",
  top: 0, left: 0,
  width: "100%", height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex", justifyContent: "center", alignItems: "center"
};

const modalBox = {
  background: "white",
  padding: "20px",
  width: "400px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const saveBtn = {
  background: "#0A74DA",
  padding: "10px",
  color: "white",
  border: "none",
  borderRadius: "5px",
  marginTop: "10px"
};

const cancelBtn = {
  background: "#aaa",
  padding: "10px",
  color: "white",
  border: "none",
  borderRadius: "5px"
};


