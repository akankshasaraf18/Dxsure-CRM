import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin-dashboard", icon: "🏠", label: "Dashboard" },
    { path: "/admin-dashboard/create-employee", icon: "➕", label: "Create Employee" },
    { path: "/admin-dashboard/manage-employees", icon: "👥", label: "Manage Employees" },
    { path: "/admin-dashboard/clients", icon: "🏢", label: "Manage Clients" },
    { path: "/admin-dashboard/create-client", icon: "➕", label: "Create Client" },
    { path: "/admin-dashboard/vendors", icon: "🤝", label: "Manage Vendors" },
    { path: "/admin-dashboard/create-vendor", icon: "➕", label: "Create Vendor" },
    { path: "/admin-dashboard/petty-cash", icon: "🧾", label: "Manage Petty Cash" },
    { path: "/admin-dashboard/petty-cash-entry", icon: "➕", label: "Petty Cash Entry" },
    { path: "/admin-dashboard/client-payments", icon: "💳", label: "Manage Client Payments" },
    { path: "/admin-dashboard/client-payment-entry", icon: "➕", label: "Client Payment Entry" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">💼</span>
          <span className="logo-text">DXSure CRM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <NavLink
                to={item.path}
                end={item.path === "/admin-dashboard"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
