import { useState, useEffect } from "react";
import API from "../../api/axios";
import "./ManageClients.css";

export default function ManageClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try {
      const res = await API.get("/api/clients");
      setClients(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to fetch clients" });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (client) => {
    setSelectedClient({ ...client });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedClient({ ...selectedClient, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/clients/${selectedClient._id}`, selectedClient);
      setMessage({ type: "success", text: "Client updated successfully!" });
      setEditModal(false);
      fetchClients();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to update client" });
    }
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/api/clients/${selectedClient._id}`);
      setMessage({ type: "success", text: "Client deleted successfully!" });
      setDeleteModal(false);
      fetchClients();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to delete client" });
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });

  return (
    <div className="manage-clients">
      <div className="page-header">
        <div>
          <h2>Manage Clients</h2>
          <p>View and manage all clients</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <strong>{clients.length}</strong> Total Clients
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
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="no-data">
            <span>📭</span>
            <p>No clients found</p>
          </div>
        ) : (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client._id}>
                  <td>
                    <div className="client-info">
                      <div className="avatar">{client.name.charAt(0)}</div>
                      <div>
                        <p className="client-name">{client.name}</p>
                        <p className="client-email">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{client.company}</td>
                  <td>{client.phone}</td>
                  <td>
                    <span className={`status-badge ${client.status}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>{client.assignedTo || "—"}</td>
                  <td>{formatDate(client.createdAt)}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => handleEdit(client)}>✏️</button>
                      <button className="btn-delete" onClick={() => handleDelete(client)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && selectedClient && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Client</h3>
              <button className="modal-close" onClick={() => setEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={selectedClient.name} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={selectedClient.email} onChange={handleEditChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={selectedClient.phone} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" name="company" value={selectedClient.company} onChange={handleEditChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={selectedClient.status} onChange={handleEditChange}>
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assigned To</label>
                    <input type="text" name="assignedTo" value={selectedClient.assignedTo || ""} onChange={handleEditChange} placeholder="Employee name" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input type="text" name="address" value={selectedClient.address || ""} onChange={handleEditChange} placeholder="Client address" />
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

      {/* Delete Confirmation Modal */}
      {deleteModal && selectedClient && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Client</h3>
              <button className="modal-close" onClick={() => setDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <span className="delete-icon">⚠️</span>
                <p>Are you sure you want to delete <strong>{selectedClient.name}</strong>?</p>
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
