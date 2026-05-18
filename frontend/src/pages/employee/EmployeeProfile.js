import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";

export default function EmployeeProfile() {
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  }, []);

  const [user, setUser] = useState(storedUser);

  useEffect(() => {
    // Debug current localStorage user payload.
    console.log("EmployeeProfile user:", user);
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Optional better approach: refresh profile from API when token exists.
    const fetchProfile = async () => {
      if (!token) {
        return;
      }

      try {
        const res = await API.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profileUser = res?.data?.user || null;
        if (profileUser) {
          setUser(profileUser);
          localStorage.setItem("user", JSON.stringify(profileUser));
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <section className="employee-page-card">
        <h2>My Profile</h2>
        <p>User data not available. Please login again.</p>
      </section>
    );
  }

  return (
    <section className="employee-page-card">
      <h2>My Profile</h2>

      <div className="profile-grid">
        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span className="profile-value">{user?.name || "-"}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user?.email || "-"}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Role</span>
          <span className="profile-value">{user?.role || "employee"}</span>
        </div>
      </div>
    </section>
  );
}
