import { useState, useEffect } from "react";
import API from "../../api/axios";
import "./ManageClientPayments.css";

function toInputDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

export default function ManageClientPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const paymentMethods = ["UPI", "Bank Transfer", "Cash", "Card", "Cheque", "Other"];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await API.get("/api/client-payments");
      setPayments(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to fetch client payments" });
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (payment) => {
    setSelectedPayment({
      ...payment,
      paymentDate: toInputDate(payment.paymentDate)
    });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedPayment({ ...selectedPayment, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/api/client-payments/${selectedPayment._id}`, {
        clientName: selectedPayment.clientName,
        amount: Number(selectedPayment.amount),
        paymentDate: selectedPayment.paymentDate,
        paymentMethod: selectedPayment.paymentMethod,
        status: selectedPayment.status
      });

      setMessage({ type: "success", text: "Client payment updated successfully!" });
      setEditModal(false);
      fetchPayments();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to update client payment" });
    }
  };

  const handleDelete = (payment) => {
    setSelectedPayment(payment);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/api/client-payments/${selectedPayment._id}`);
      setMessage({ type: "success", text: "Client payment deleted successfully!" });
      setDeleteModal(false);
      fetchPayments();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to delete client payment" });
    }
  };

  const formatDate = (dateValue) =>
    new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(amount || 0);

  return (
    <div className="manage-client-payments">
      <div className="page-header">
        <div>
          <h2>Manage Client Payments</h2>
          <p>View and manage all client payment records</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <strong>{payments.length}</strong> Total Payments
          </span>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
          <button className="alert-close" onClick={() => setMessage({ type: "", text: "" })}>×</button>
        </div>
      )}

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by client name, payment method, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading client payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="no-data">
            <span>📭</span>
            <p>No client payments found</p>
          </div>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>
                    <p className="client-name">{payment.clientName}</p>
                  </td>
                  <td>{formatAmount(payment.amount)}</td>
                  <td>{formatDate(payment.paymentDate)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => handleEdit(payment)}>✏️</button>
                      <button className="btn-delete" onClick={() => handleDelete(payment)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Client Payment</h3>
              <button className="modal-close" onClick={() => setEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Client Name</label>
                    <input
                      type="text"
                      name="clientName"
                      value={selectedPayment.clientName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      name="amount"
                      min="0"
                      step="0.01"
                      value={selectedPayment.amount}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Payment Date</label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={selectedPayment.paymentDate}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={selectedPayment.paymentMethod}
                      onChange={handleEditChange}
                      required
                    >
                      {paymentMethods.map((method, index) => (
                        <option key={index} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={selectedPayment.status}
                      onChange={handleEditChange}
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Payment</h3>
              <button className="modal-close" onClick={() => setDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <span className="delete-icon">⚠️</span>
                <p>Are you sure you want to delete this client payment record?</p>
                <p className="delete-warning">This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
