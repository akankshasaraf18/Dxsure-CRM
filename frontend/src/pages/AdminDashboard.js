import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CreateEmployee from "./admin/CreateEmployee";
import ManageEmployees from "./admin/ManageEmployees";
import CreateClient from "./admin/CreateClient";
import ManageClients from "./admin/ManageClients";
import CreateVendor from "./admin/CreateVendor";
import ManageVendors from "./admin/ManageVendors";
import PettyCashEntry from "./admin/PettyCashEntry";
import ManagePettyCash from "./admin/ManagePettyCash";
import ClientPaymentEntry from "./admin/ClientPaymentEntry";
import ManageClientPayments from "./admin/ManageClientPayments";
import "./AdminDashboard.css";

// Dashboard Home Content
function DashboardHome() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [counts, setCounts] = useState({
    employees: 0,
    clients: 0,
    vendors: 0,
    clientPayments: 0,
  });

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      if (!token) {
        return;
      }

      try {
        const [employeesRes, clientsRes, vendorsRes, clientPaymentsRes] = await Promise.all([
          API.get("/api/employees"),
          API.get("/api/clients"),
          API.get("/api/vendors"),
          API.get("/api/client-payments"),
        ]);

        setCounts({
          employees: Array.isArray(employeesRes.data) ? employeesRes.data.length : 0,
          clients: Array.isArray(clientsRes.data) ? clientsRes.data.length : 0,
          vendors: Array.isArray(vendorsRes.data) ? vendorsRes.data.length : 0,
          clientPayments: Array.isArray(clientPaymentsRes.data) ? clientPaymentsRes.data.length : 0,
        });
      } catch (error) {
        // Keep dashboard usable even if one of the endpoints fails.
        setCounts({
          employees: 0,
          clients: 0,
          vendors: 0,
          clientPayments: 0,
        });
        console.error(error.response?.data || error.message);
      }
    };

    fetchDashboardCounts();
  }, [token]);

  const stats = [
    { title: "Total Employees", value: counts.employees, icon: "👥", color: "#667eea" },
    { title: "Total Clients", value: counts.clients, icon: "🏢", color: "#10b981" },
    { title: "Total Vendors", value: counts.vendors, icon: "🤝", color: "#f59e0b" },
    { title: "Client Payments", value: counts.clientPayments, icon: "💳", color: "#8b5cf6" },
  ];

  const recentActivities = [
    { action: "New employee added", time: "2 hours ago", icon: "👤" },
    { action: "Client added", time: "4 hours ago", icon: "🏢" },
    { action: "Vendor registered", time: "6 hours ago", icon: "🤝" },
    { action: "Payment received from ABC Corp", time: "1 day ago", icon: "💳" },
  ];

  return (
    <div className="dashboard-home">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-icon">{activity.icon}</span>
                <div className="activity-info">
                  <p className="activity-action">{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => navigate("/admin-dashboard/create-employee")}>
              <span>➕</span>
              <span>Add Employee</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate("/admin-dashboard/create-client")}>
              <span>🏢</span>
              <span>New Client</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate("/admin-dashboard/create-vendor")}>
              <span>🤝</span>
              <span>Add Vendor</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate("/admin-dashboard/petty-cash-entry")}>
              <span>🧾</span>
              <span>Petty Cash Entry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? "" : "sidebar-closed"}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Navbar toggleSidebar={toggleSidebar} />
      
      <main className="main-content">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="create-employee" element={<CreateEmployee />} />
          <Route path="manage-employees" element={<ManageEmployees />} />
          <Route path="clients" element={<ManageClients />} />
          <Route path="create-client" element={<CreateClient />} />
          <Route path="vendors" element={<ManageVendors />} />
          <Route path="create-vendor" element={<CreateVendor />} />
          <Route path="petty-cash" element={<ManagePettyCash />} />
          <Route path="petty-cash-entry" element={<PettyCashEntry />} />
          <Route path="client-payments" element={<ManageClientPayments />} />
          <Route path="client-payment-entry" element={<ClientPaymentEntry />} />
        </Routes>
      </main>
    </div>
  );
}
