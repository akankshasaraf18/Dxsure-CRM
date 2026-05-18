import { useState } from "react";
import API from "../../api/axios";
import { jwtDecode } from "jwt-decode";
import "./PettyCashEntry.css";

function getCreatedBy() {
  const token = localStorage.getItem("token");
  if (!token) return "Admin";

  try {
    const decoded = jwtDecode(token);
    return decoded.name || "Admin";
  } catch (err) {
    return "Admin";
  }
}

export default function PettyCashEntry() {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: ""
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
      await API.post("/api/pettycash", {
        ...formData,
        amount: Number(formData.amount),
        createdBy: getCreatedBy()
      });

      setMessage({ type: "success", text: "Petty cash entry added successfully!" });
      setFormData({ amount: "", description: "", date: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add petty cash entry"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ amount: "", description: "", date: "" });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="petty-cash-entry">
      <div className="page-header">
        <h2>Petty Cash Entry</h2>
        <p>Add day-to-day expense entries</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <form className="entry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter expense description"
              rows="4"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleClear}>
            Clear Form
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}
