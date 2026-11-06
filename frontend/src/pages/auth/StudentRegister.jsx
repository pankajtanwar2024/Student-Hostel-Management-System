import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

function StudentRegister() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        hostelId: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        universityRollNo: "",
        course: "",
        branch: "",
        year: "",
        semester: "",
        university: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    // Submit registration form
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await API.post(
                "/auth/register",
                formData
            );

            setSuccess(
                response.data.message || "Registration successful!"
            );

            // Redirect to login after successful registration
            setTimeout(() => {
                navigate("/student/login");
            }, 1500);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center text-blue-700">
                    Student Registration
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-8">
                    Create your Hostel Management Account
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {[
                            {
                                name: "hostelId",
                                label: "Hostel ID",
                                placeholder: "Enter issued Hostel ID"
                            },
                            {
                                name: "name",
                                label: "Full Name",
                                placeholder: "Enter your name"
                            },
                            {
                                name: "email",
                                label: "Email",
                                placeholder: "Enter your email"
                            },
                            {
                                name: "phone",
                                label: "Phone Number",
                                placeholder: "Enter phone number"
                            },
                            {
                                name: "universityRollNo",
                                label: "University Roll Number",
                                placeholder: "Enter roll number"
                            },
                            {
                                name: "course",
                                label: "Course",
                                placeholder: "B.Tech"
                            },
                            {
                                name: "branch",
                                label: "Branch",
                                placeholder: "Robotics and AI"
                            },
                            {
                                name: "year",
                                label: "Year",
                                placeholder: "Enter academic year"
                            },
                            {
                                name: "semester",
                                label: "Semester",
                                placeholder: "Enter semester"
                            },
                            {
                                name: "university",
                                label: "University",
                                placeholder: "Enter university name"
                            }
                        ].map((field) => (

                            <div key={field.name}>

                                <label className="block mb-2 font-medium">
                                    {field.label}
                                </label>

                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        ))}

                        {/* Password */}

                        <div className="md:col-span-2">

                            <label className="block mb-2 font-medium">
                                Create Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                minLength={8}
                                required
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>

                    {/* Error */}

                    {error && (

                        <p className="text-red-600 mt-5">
                            {error}
                        </p>

                    )}

                    {/* Success */}

                    {success && (

                        <p className="text-green-600 mt-5">
                            {success}
                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-7 hover:bg-blue-700 disabled:opacity-50"
                    >

                        {loading ? "Registering..." : "Register Account"}

                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">

                    Already registered?

                    <Link
                        to="/student/login"
                        className="text-blue-600 font-semibold ml-1"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default StudentRegister;