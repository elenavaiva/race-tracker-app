import { useNavigate } from "react-router-dom";

export default function Header({ showLogout, showBack, backText, backPath }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="app-header">
      {}
      {showLogout && (
        <button className="header-button" onClick={handleLogout}>
          Logout
        </button>
      )}

      {showBack && (
        <button
          className="header-button"
          onClick={() => navigate(backPath)}
        >
          <span style={{ fontSize: "16px" }}>←</span> {backText}
        </button>
      )}

      <h1 className="app-title">Race Tracker</h1>
    </div>
  );
}