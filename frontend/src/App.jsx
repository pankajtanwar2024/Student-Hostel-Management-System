import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import StudentLogin from "./pages/auth/StudentLogin";
import StudentRegister from "./pages/auth/StudentRegister";
import AdminLogin from "./pages/auth/AdminLogin";

import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RoomSelection from "./pages/student/RoomSelection";
import StudentManagement from "./pages/admin/StudentManagement";
import AdminRoomManagement from "./pages/admin/AdminRoomManagement.jsx";
import HostelIdManagement from "./pages/admin/HostelIdManagement";
import LandingPage from "./pages/LandingPage";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Default Route */}

                <Route path="/" element={<LandingPage />} />

                {/* Student Authentication */}

                <Route
                    path="/student/login"
                    element={<StudentLogin />}
                />

                <Route
                    path="/student/register"
                    element={<StudentRegister />}
                />

                {/* Admin Authentication */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/* Student Dashboard */}

                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Dashboard */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/rooms"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <RoomSelection />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/students"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <StudentManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/rooms"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminRoomManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/hostel-ids"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                        <HostelIdManagement />
                        </ProtectedRoute>
                    }
                />
                

            </Routes>

        </BrowserRouter>

    );

}

export default App;