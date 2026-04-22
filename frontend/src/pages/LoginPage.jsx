import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <Header showLogout={false} />

      <h2 className="auth-title">Login</h2>

      <p className="auth-description">
        Enter your username and password to access your account!
      </p>

      <div className="auth-form">
        <div className="auth-row">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-row">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-button" onClick={handleLogin}>
          Login
        </button>

        <p className="auth-link-text">
          New user? <Link to="/register">Create Account</Link>
        </p>
      </div>

      <p className="auth-bottom-text">
        Keep track of all your races - date, pace and finish time!{" "}
        <strong>Stay organized!</strong>
      </p>
    </div>
  );
}