import { useState, useEffect } from "react";
import API from "../../api/axios";
import "./ManageVendors.css";

const SERVICE_TYPES = [
  "IT Services", "Logistics", "Marketing", "Legal",
  "Accounting", "Consulting", "Facility Management",
  "Security", "Catering", "Maintenance", "Other"
];

export default function ManageVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    try {
      const res = await API.get("/api/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to fetch vendors" });
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(v =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (vendor) => {
    setSelectedVendor({ ...vendor });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedVendor({ ...selectedVendor, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/vendors/${selectedVendor._id}`, selectedVendor);
      setMessage({ type: "success", text: "Vendor updated successfully!" });
      setEditModal(false);
      fetchVendors();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to update vendor" });
    }
  };

  const handleDelete = (vendor) => {
    setSelectedVendor(vendor);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/api/vendors/${selectedVendor._id}`);
      setMessage({ type: "success", text: "Vendor deleted successfully!" });
      setDeleteModal(false);
      fetchVendors();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to delete vendor" });
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });

  return (
    <div className="manage-vendors">
      <div className="page-header">
        <div>
          <h2>Manage Vendors</h2>
          <p>View and manage all vendors</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <strong>{vendors.length}</strong> Total Vendors
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
          placeholder="Search by vendor name, company, or service type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading vendors...</div>
        ) : filteredVendors.length === 0 ? (
          <div className="no-data">
            <span>📭</span>
            <p>No vendors found</p>
          </div>
        ) : (
          <table className="vendors-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Company</th>
                <th>Service Type</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>
                    <div className="vendor-info">
                      <div className="avatar">{vendor.vendorName.charAt(0)}</div>
                      <div>
                        <p className="vendor-name">{vendor.vendorName}</p>
                        <p className="vendor-email">{vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{vendor.companyName}</td>
                  <td>
                    <span className="service-badge">{vendor.serviceType}</span>
                  </td>
                  <td>{vendor.phone}</td>
                  <td>
                    <span className={`status-badge ${vendor.status}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td>{formatDate(vendor.createdAt)}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => handleEdit(vendor)}>✏️</button>
                      <button className="btn-delete" onClick={() => handleDelete(vendor)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && selectedVendor && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Vendor</h3>
              <button className="modal-close" onClick={() => setEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <input type="text" name="vendorName" value={selectedVendor.vendorName} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" name="companyName" value={selectedVendor.companyName} onChange={handleEditChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={selectedVendor.email} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={selectedVendor.phone} onChange={handleEditChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Service Type</label>
                    <select name="serviceType" value={selectedVendor.serviceType} onChange={handleEditChange} required>
                      {SERVICE_TYPES.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={selectedVendor.status} onChange={handleEditChange}>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input type="text" name="address" value={selectedVendor.address || ""} onChange={handleEditChange} placeholder="Vendor address" />
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
      {deleteModal && selectedVendor && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Vendor</h3>
              <button className="modal-close" onClick={() => setDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <span className="delete-icon">⚠️</span>
                <p>Are you sure you want to delete <strong>{selectedVendor.vendorName}</strong>?</p>
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
