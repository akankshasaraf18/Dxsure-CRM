import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

export default function Navbar({ toggleSidebar }) {
  const [user, setUser] = useState({ name: "", role: "" });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || "User",
          role: decoded.role || "employee",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const getCurrentDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <span className="hamburger">☰</span>
        </button>
        <div className="page-info">
          <h1 className="page-title">Admin Dashboard</h1>
          <span className="page-date">{getCurrentDate()}</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-actions">
          <button className="action-btn notification-btn">
            <span>🔔</span>
            <span className="notification-badge">3</span>
          </button>
          <button className="action-btn">
            <span>⚙️</span>
          </button>
        </div>

        <div className="user-menu">
          <button 
            className="user-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <a href="#profile" className="dropdown-item">
                <span>👤</span> My Profile
              </a>
              <a href="#settings" className="dropdown-item">
                <span>⚙️</span> Settings
              </a>
              <hr className="dropdown-divider" />
              <a href="/login" className="dropdown-item logout" onClick={() => localStorage.removeItem("token")}>
                <span>🚪</span> Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
