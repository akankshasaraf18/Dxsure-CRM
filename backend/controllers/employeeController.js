const Employee = require("../models/Employee");

// CREATE EMPLOYEE
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, designation, salary, joiningDate, address } = req.body;

    // Check if employee with email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this email already exists" });
    }

    const employee = await Employee.create({
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      address
    });

    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL EMPLOYEES
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE EMPLOYEE
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, designation, salary, joiningDate, address, status } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, department, designation, salary, joiningDate, address, status },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully", employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
