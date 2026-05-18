import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // Check if user role is allowed
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Redirect based on role
      if (userRole === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      } else {
        return <Navigate to="/employee-dashboard" replace />;
      }
    }

    return children;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
