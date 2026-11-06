import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function AdminLogin() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await API.post(
                "/admin/login",
                formData
            );

            // Store Admin JWT
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Store Admin information
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...response.data.admin,
                    role: "admin"
                })
            );

            // Redirect to Admin Dashboard
            navigate("/admin/dashboard");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Invalid username or password."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

                <h1 className="text-3xl font-bold text-center text-blue-700">
                    Admin Login
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-8">
                    Hostel Management Administration
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">

                        <label className="block mb-2 font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter admin username"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div className="mb-5">

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter admin password"
                            required
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {error && (

                        <p className="text-red-600 text-sm mb-4">
                            {error}
                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >

                        {loading ? "Logging in..." : "Admin Login"}

                    </button>

                </form>

            </div>

        </div>

    );

}

export default AdminLogin;