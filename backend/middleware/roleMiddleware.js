const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user?.role) {
    return res.status(403).json({ message: "Forbidden. Role is missing." });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
  }

  next();
};

exports.allowAdmin = requireRole(["admin"]);
exports.allowEmployee = requireRole(["employee"]);
exports.allowAdminOrEmployee = requireRole(["admin", "employee"]);
