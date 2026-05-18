import { useState } from "react";
import API from "../../api/axios";
import "./CreateClient.css";

export default function CreateClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    status: "prospect",
    assignedTo: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.post("/api/clients", formData);
      setMessage({ type: "success", text: "Client created successfully!" });
      setFormData({
        name: "", email: "", phone: "", company: "",
        address: "", status: "prospect", assignedTo: ""
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create client"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "", email: "", phone: "", company: "",
      address: "", status: "prospect", assignedTo: ""
    });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="create-client">
      <div className="page-header">
        <h2>Create New Client</h2>
        <p>Add a new client to the system</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <form className="client-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assigned To</label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter assigned employee name"
            />
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter client address"
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleClear}>
            Clear Form
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Client"}
          </button>
        </div>
      </form>
    </div>
  );
}
