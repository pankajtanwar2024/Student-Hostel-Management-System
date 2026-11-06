import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

function StudentLogin() {

    // Store form data
    const [formData, setFormData] = useState({
        hostelId: "",
        password: ""
    });

    // Store error and loading states
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle login submission
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await API.post(
                "/auth/login",
                formData
            );

            // Store JWT
            localStorage.setItem("token", response.data.token);

            // Store student information
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...response.data.student,
                    role: "student"
                })
            );

            // Navigate to student dashboard
            navigate("/student/dashboard");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Login failed. Please check your credentials."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

                <h1 className="text-3xl font-bold text-center text-blue-700">
                    Student Login
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-8">
                    Login to your Hostel Management Account
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Hostel ID */}

                    <div className="mb-5">

                        <label className="block mb-2 font-medium">
                            Hostel ID
                        </label>

                        <input
                            type="text"
                            name="hostelId"
                            value={formData.hostelId}
                            onChange={handleChange}
                            placeholder="Enter your Hostel ID"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Password */}

                    <div className="mb-5">

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Error Message */}

                    {error && (

                        <p className="text-red-600 text-sm mb-4">
                            {error}
                        </p>

                    )}

                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >

                        {loading ? "Logging in..." : "Login"}

                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">

                    Don't have an account?

                    <Link
                        to="/student/register"
                        className="text-blue-600 font-semibold ml-1"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default StudentLogin;