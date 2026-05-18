import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || "Employee",
          role: decoded.role || "employee",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="employee-dashboard">
      <header className="employee-header">
        <div className="header-left">
          <span className="logo-icon">💼</span>
          <h1>DXSure CRM</h1>
        </div>
        <div className="header-right">
          <span className="user-greeting">Welcome, {user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="employee-main">
        <div className="welcome-card">
          <h2>Employee Dashboard</h2>
          <p>Welcome to the Employee Portal. Your dashboard features will be available here soon.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">📋</span>
            <h3>My Tasks</h3>
            <p>View and manage your assigned tasks</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎫</span>
            <h3>Tickets</h3>
            <p>Handle support tickets</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Day Plan</h3>
            <p>Plan your daily activities</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">👤</span>
            <h3>Profile</h3>
            <p>Update your profile settings</p>
          </div>
        </div>
      </main>
    </div>
  );
}
