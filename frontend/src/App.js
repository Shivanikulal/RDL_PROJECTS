// import React, { useState } from "react";
// import "./App.css";

// function App() {
//   const [entries, setEntries] = useState([]);
//   const [name, setName] = useState("");
//   const [message, setMessage] = useState("");
//   const [editingIndex, setEditingIndex] = useState(null);

//   const handleSubmit = () => {
//     if (!name || !message) return;
//     if (editingIndex !== null) {
//       const updatedEntries = entries.map((entry, index) => 
//         index === editingIndex ? { name, message } : entry
//       );
//       setEntries(updatedEntries);
//       setEditingIndex(null);
//     } else {
//       setEntries([...entries, { name, message }]);
//     }
//     setName("");
//     setMessage("");
//   };

//   const handleEdit = (index) => {
//     setName(entries[index].name);
//     setMessage(entries[index].message);
//     setEditingIndex(index);
//   };

//   const handleDelete = (index) => {
//     setEntries(entries.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="app-container">
//       <h1>Simple CRUD App</h1>
//       <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
//       <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
//       <button onClick={handleSubmit}>{editingIndex !== null ? "Update" : "Submit"}</button>
//       <ul>
//         {entries.map((entry, index) => (
//           <li key={index}>
//             {entry.name}: {entry.message}
//             <button onClick={() => handleEdit(index)}>Edit</button>
//             <button onClick={() => handleDelete(index)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Edit, Delete } from "@mui/icons-material"; // MUI Icons
import { Snackbar, Alert, Button } from "@mui/material"; // MUI Snackbar & Alert

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState(""); // Snackbar message
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://reqres.in/api/users?page=2");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleCreate = async () => {
    if (!name || !email) return;
    try {
      const response = await axios.post("https://reqres.in/api/users", { name, email });
      setUsers([...users, { id: response.data.id, first_name: name, email }]);
      setName("");
      setEmail("");
      showSnackbar("User created successfully!");
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const handleEdit = (user) => {
    setName(user.first_name);
    setEmail(user.email);
    setEditingUser(user);
  };

  const handleUpdate = async () => {
    if (!name || !email || !editingUser) return;
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser.id}`, { name, email });
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, first_name: name, email } : user)));
      setEditingUser(null);
      setName("");
      setEmail("");
      showSnackbar("User updated successfully!");
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      showSnackbar("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  // Function to show Snackbar message
  const showSnackbar = (msg) => {
    setMessage(msg);
    setOpenSnackbar(true);
  };

  return (
    <div className="app-container">
      <h1>CRUD App with API</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {!editingUser ? (
        <button onClick={handleCreate}>Create</button>
      ) : (
        <button onClick={handleUpdate}>Update</button>
      )}
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-list-item">
            <span className="user-info">{user.first_name}</span>
            <span className="user-info">{user.email}</span>
            <div className="button-container">
              <button onClick={() => handleEdit(user)}>
                <Edit /> {/* MUI Edit Icon */}
              </button>
              <button onClick={() => handleDelete(user.id)}>
                <Delete /> {/* MUI Delete Icon */}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* MUI Snackbar for Success Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // 3 seconds
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Position bottom-left
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
