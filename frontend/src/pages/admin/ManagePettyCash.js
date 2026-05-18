import { useState, useEffect } from "react";
import API from "../../api/axios";
import "./ManagePettyCash.css";

function toInputDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

export default function ManagePettyCash() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await API.get("/api/pettycash");
      setEntries(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to fetch petty cash entries" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setSelectedEntry({
      ...entry,
      date: toInputDate(entry.date)
    });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedEntry({ ...selectedEntry, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/api/pettycash/${selectedEntry._id}`, {
        amount: Number(selectedEntry.amount),
        description: selectedEntry.description,
        date: selectedEntry.date,
        createdBy: selectedEntry.createdBy || "Admin"
      });

      setMessage({ type: "success", text: "Petty cash entry updated successfully!" });
      setEditModal(false);
      fetchEntries();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to update petty cash entry" });
    }
  };

  const handleDelete = (entry) => {
    setSelectedEntry(entry);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/api/pettycash/${selectedEntry._id}`);
      setMessage({ type: "success", text: "Petty cash entry deleted successfully!" });
      setDeleteModal(false);
      fetchEntries();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to delete petty cash entry" });
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
    <div className="manage-petty-cash">
      <div className="page-header">
        <div>
          <h2>Manage Petty Cash</h2>
          <p>View and manage petty cash expense entries</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <strong>{entries.length}</strong> Total Entries
          </span>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
          <button className="alert-close" onClick={() => setMessage({ type: "", text: "" })}>×</button>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading petty cash entries...</div>
        ) : entries.length === 0 ? (
          <div className="no-data">
            <span>📭</span>
            <p>No petty cash entries found</p>
          </div>
        ) : (
          <table className="petty-cash-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id}>
                  <td>{formatAmount(entry.amount)}</td>
                  <td>
                    <p className="entry-description">{entry.description}</p>
                  </td>
                  <td>{formatDate(entry.date)}</td>
                  <td>{entry.createdBy || "Admin"}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => handleEdit(entry)}>✏️</button>
                      <button className="btn-delete" onClick={() => handleDelete(entry)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editModal && selectedEntry && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Petty Cash Entry</h3>
              <button className="modal-close" onClick={() => setEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      name="amount"
                      min="0"
                      step="0.01"
                      value={selectedEntry.amount}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      value={selectedEntry.date}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={selectedEntry.description}
                      onChange={handleEditChange}
                      rows="3"
                      required
                    />
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

      {deleteModal && selectedEntry && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Entry</h3>
              <button className="modal-close" onClick={() => setDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <span className="delete-icon">⚠️</span>
                <p>Are you sure you want to delete this petty cash entry?</p>
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
