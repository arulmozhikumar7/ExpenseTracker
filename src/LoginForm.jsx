// LoginForm.jsx
import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Validate username and password
      if (!username || !password) {
        alert("Please enter both username and password");
        return;
      }

      // Send login request to the server
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      // Handle the login on the client side
      if (response.status === 200) {
        alert("Login successful");
        onLogin(response.data.token); // You can add more logic here if needed
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert("Internal Server Error");
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
