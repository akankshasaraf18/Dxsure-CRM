import { NavLink, useNavigate } from "react-router-dom";
import "./EmployeeSidebar.css";

export default function EmployeeSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/employee-dashboard", label: "Dashboard" },
    { path: "/employee-dashboard/profile", label: "Profile" },
    { path: "/employee-dashboard/clients", label: "Clients" }
  ];

  return (
    <aside className="employee-sidebar">
      <h2 className="employee-sidebar-title">Employee Panel</h2>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/employee-dashboard"}
            className={({ isActive }) =>
              `employee-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="employee-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
