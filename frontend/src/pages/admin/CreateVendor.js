import { useState } from "react";
import API from "../../api/axios";
import "./CreateVendor.css";

const SERVICE_TYPES = [
  "IT Services", "Logistics", "Marketing", "Legal",
  "Accounting", "Consulting", "Facility Management",
  "Security", "Catering", "Maintenance", "Other"
];

export default function CreateVendor() {
  const [formData, setFormData] = useState({
    vendorName: "",
    companyName: "",
    phone: "",
    email: "",
    serviceType: "",
    address: "",
    status: "pending"
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
      await API.post("/api/vendors", formData);
      setMessage({ type: "success", text: "Vendor created successfully!" });
      setFormData({
        vendorName: "", companyName: "", phone: "", email: "",
        serviceType: "", address: "", status: "pending"
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create vendor"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      vendorName: "", companyName: "", phone: "", email: "",
      serviceType: "", address: "", status: "pending"
    });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="create-vendor">
      <div className="page-header">
        <h2>Create New Vendor</h2>
        <p>Add a new vendor to the system</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <form className="vendor-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Vendor Name *</label>
            <input
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              placeholder="Enter vendor contact name"
              required
            />
          </div>

          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
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
            <label>Service Type *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">Select Service Type</option>
              {SERVICE_TYPES.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter vendor address"
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleClear}>
            Clear Form
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Vendor"}
          </button>
        </div>
      </form>
    </div>
  );
}
