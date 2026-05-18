import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "./Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!role) {
      nextErrors.role = "Role is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await API.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      setApiMessage({ type: "success", text: "Registration successful. You can now login." });
      setName("");
      setEmail("");
      setPassword("");
      setRole("employee");
      setErrors({});
    } catch (err) {
      console.error(err.response?.data || err.message);
      setApiMessage({
        type: "error",
        text: err?.response?.data?.message || "Registration failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Register</h2>

        <form className="register-form" onSubmit={handleRegister} noValidate>
          <div className="field-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name ? <p className="field-error">{errors.name}</p> : null}
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email ? <p className="field-error">{errors.email}</p> : null}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password ? <p className="field-error">{errors.password}</p> : null}
          </div>

          <div className="field-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role ? <p className="field-error">{errors.role}</p> : null}
          </div>

          {apiMessage.text ? (
            <p className={`form-message ${apiMessage.type}`}>{apiMessage.text}</p>
          ) : null}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}