import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    // Check authentication
    if (!token || !user) {

        return <Navigate to="/student/login" replace />;

    }

    // Check user role
    if (!allowedRoles.includes(user.role)) {

        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/student/dashboard" replace />;

    }

    return children;

}

export default ProtectedRoute;