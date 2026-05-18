import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import API from "../../api/axios";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import EmployeeProfile from "./EmployeeProfile";
import "./EmployeeDashboard.css";

function DashboardHome({ profile, clients }) {
  return (
    <section className="employee-page-card">
      <h1>Welcome, {profile?.name || "Employee"}</h1>
      <p>This is your employee dashboard.</p>

      <div className="employee-summary-grid">
        <div className="employee-summary-item">
          <h3>Role</h3>
          <p>{profile?.role || "employee"}</p>
        </div>
        <div className="employee-summary-item">
          <h3>Assigned Clients</h3>
          <p>{clients.length}</p>
        </div>
        <div className="employee-summary-item">
          <h3>Tasks</h3>
          <p>3 pending (placeholder)</p>
        </div>
      </div>
    </section>
  );
}

function ClientsView({ clients, loading }) {
  return (
    <section className="employee-page-card">
      <h2>Assigned Clients (View Only)</h2>

      {loading ? <p>Loading clients...</p> : null}

      {!loading && clients.length === 0 ? (
        <p>No assigned clients found.</p>
      ) : null}

      {!loading && clients.length > 0 ? (
        <div className="employee-table-wrap">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.company}</td>
                  <td>{client.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export default function EmployeeDashboard() {
  const [profile, setProfile] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch profile and assigned clients in parallel for faster dashboard load.
        const [profileRes, clientsRes] = await Promise.all([
          API.get("/api/auth/me", { headers }),
          API.get("/api/clients/my-assigned", { headers })
        ]);

        setProfile(profileRes.data.user || null);
        setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div className="employee-dashboard-layout">
      <EmployeeSidebar />

      <main className="employee-main-content">
        <Routes>
          <Route index element={<DashboardHome profile={profile} clients={clients} />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="clients" element={<ClientsView clients={clients} loading={loading} />} />
        </Routes>
      </main>
    </div>
  );
}
