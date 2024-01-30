// RegisterForm.jsx
import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      // Validate username and password
      if (!username || !password) {
        alert("Please enter both username and password");
        return;
      }

      // Send registration request to the server
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });

      // Handle the registration on the client side
      if (response.status === 201) {
        alert("User registered successfully");
        onRegister(); // You can add more logic here if needed
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
      alert("Internal Server Error");
    }
  };

  return (
    <div>
      <h2>Regi</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterForm;
