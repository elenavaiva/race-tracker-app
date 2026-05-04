import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
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

      alert("Account created successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <Header showBack={true} backText="Login" backPath="/" /> 

      <h2 className="auth-title">Create Account</h2>

      <p className="auth-description">
        Enter your desired username and password to create a new account!
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

        <div className="auth-row">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="auth-button" onClick={handleRegister}>
          Create Account
        </button>

        <p className="auth-link-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>

      <p className="auth-bottom-text">
        Keep track of all your races - date, pace and finish time!{" "}
        <strong>Stay organized!</strong>
      </p>
    </div>
  );
}