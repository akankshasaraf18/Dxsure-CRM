import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post(
        "/api/auth/login",
        { email: email.trim().toLowerCase(), password }
      );

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const userRole = user?.role;

      // Redirect based on role
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      const message = err?.response?.data?.message || "Invalid Credentials";
      alert(`${message} ❌`);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="login-container">
      <div className="login-card">
        <h2>DXSure CRM Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <div className="login-footer">
          © DXSure CRM System
        </div>
      </div>
    </div>
  );
}