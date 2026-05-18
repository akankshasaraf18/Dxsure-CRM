import { useState, useEffect } from "react";
import API from "../../api/axios";
import "./ManageEmployees.css";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const departments = [
    "Engineering", "Sales", "Marketing", "Human Resources",
    "Finance", "Operations", "Customer Support", "IT"
  ];

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to fetch employees" });
    } finally {
      setLoading(false);
    }
  };

  // Filter employees by search
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Edit
  const handleEdit = (employee) => {
    setSelectedEmployee({ ...employee });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedEmployee({
      ...selectedEmployee,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/employees/${selectedEmployee._id}`, selectedEmployee);
      setMessage({ type: "success", text: "Employee updated successfully!" });
      setEditModal(false);
      fetchEmployees();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to update employee" });
    }
  };

  // Handle Delete
  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/api/employees/${selectedEmployee._id}`);
      setMessage({ type: "success", text: "Employee deleted successfully!" });
      setDeleteModal(false);
      fetchEmployees();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to delete employee" });
    }
  };

 

  // Format salary
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  return (
    <div className="manage-employees">
      <div className="page-header">
        <div>
          <h2>Manage Employees</h2>
          <p>View and manage all employees</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <strong>{employees.length}</strong> Total Employees
          </span>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
          <button className="alert-close" onClick={() => setMessage({ type: "", text: "" })}>×</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Employees Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading employees...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="no-data">
            <span>📭</span>
            <p>No employees found</p>
          </div>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Phone</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className="employee-info">
                      <div className="avatar">{emp.name.charAt(0)}</div>
                      <div>
                        <p className="emp-name">{emp.name}</p>
                        <p className="emp-email">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.phone}</td>
                  <td>{formatSalary(emp.salary)}</td>
                  <td>
                    <span className={`status-badge ${emp.status}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => handleEdit(emp)}>
                        ✏️
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(emp)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Employee</h3>
              <button className="modal-close" onClick={() => setEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedEmployee.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={selectedEmployee.email}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={selectedEmployee.phone}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      name="department"
                      value={selectedEmployee.department}
                      onChange={handleEditChange}
                      required
                    >
                      {departments.map((dept, idx) => (
                        <option key={idx} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={selectedEmployee.designation}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Salary (₹)</label>
                    <input
                      type="number"
                      name="salary"
                      value={selectedEmployee.salary}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={selectedEmployee.status}
                      onChange={handleEditChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Employee</h3>
              <button className="modal-close" onClick={() => setDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <span className="delete-icon">⚠️</span>
                <p>Are you sure you want to delete <strong>{selectedEmployee.name}</strong>?</p>
                <p className="delete-warning">This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
