import { useState } from "react";
import API from "../../api/axios";
import "./ClientPaymentEntry.css";

const PAYMENT_METHODS = [
  "UPI",
  "Bank Transfer",
  "Cash",
  "Card",
  "Cheque",
  "Other"
];

export default function ClientPaymentEntry() {
  const [formData, setFormData] = useState({
    clientName: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "",
    status: "completed"
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
      await API.post("/api/client-payments", {
        ...formData,
        amount: Number(formData.amount)
      });

      setMessage({ type: "success", text: "Client payment recorded successfully!" });
      setFormData({
        clientName: "",
        amount: "",
        paymentDate: "",
        paymentMethod: "",
        status: "completed"
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to record client payment"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      clientName: "",
      amount: "",
      paymentDate: "",
      paymentMethod: "",
      status: "completed"
    });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="client-payment-entry">
      <div className="page-header">
        <h2>Client Payment Entry</h2>
        <p>Record a payment received from a client</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Client Name *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
              required
            />
          </div>

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
            <label>Payment Date *</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select payment method</option>
              {PAYMENT_METHODS.map((method, index) => (
                <option key={index} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleClear}>
            Clear Form
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Record Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}
