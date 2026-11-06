import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import {
    User,
    GraduationCap,
    Building2,
    BedDouble,
    LogOut,
    DoorOpen
} from "lucide-react";

function StudentDashboard() {

    // Store student information
    const [student, setStudent] = useState(null);

    // Loading state
    const [loading, setLoading] = useState(true);

    // Error state
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // Fetch student information when dashboard opens
    useEffect(() => {

        fetchStudentProfile();

    }, []);


    // Get student profile from backend
    const fetchStudentProfile = async () => {

        try {

            const response = await API.get("/students/profile");

            setStudent(response.data.student);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to load student profile."
            );

            if (err.response?.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/student/login");

            }

        } finally {

            setLoading(false);

        }

    };


    // Logout functionality
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/student/login");

    };


    // Display loading message
    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    Loading Dashboard...
                </h2>

            </div>

        );

    }


    // Display error
    if (error || !student) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <p className="text-red-600">
                    {error || "Student information not found."}
                </p>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-100">


            {/* Navigation Bar */}

            <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">

                <h1 className="text-xl font-bold text-blue-700">

                    Hostel Management System

                </h1>


                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </nav>



            <main className="max-w-7xl mx-auto p-6">


                {/* Welcome Section */}

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-gray-800">

                        Welcome, {student.name}!

                    </h2>

                    <p className="text-gray-500 mt-2">

                        Welcome to your student hostel dashboard.

                    </p>

                </div>



                {/* Student Information */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                    <div className="bg-white p-6 rounded-xl shadow">

                        <User className="text-blue-600 mb-3" size={30} />

                        <p className="text-gray-500">
                            Hostel ID
                        </p>

                        <h3 className="text-xl font-bold">
                            {student.hostelId}
                        </h3>

                    </div>



                    <div className="bg-white p-6 rounded-xl shadow">

                        <GraduationCap className="text-green-600 mb-3" size={30} />

                        <p className="text-gray-500">
                            Course
                        </p>

                        <h3 className="text-xl font-bold">
                            {student.course}
                        </h3>

                    </div>



                    <div className="bg-white p-6 rounded-xl shadow">

                        <Building2 className="text-purple-600 mb-3" size={30} />

                        <p className="text-gray-500">
                            University
                        </p>

                        <h3 className="text-xl font-bold">
                            {student.university}
                        </h3>

                    </div>


                </div>



                {/* Room Allocation Section */}

                <div className="bg-white rounded-xl shadow mt-8 p-6">

                    <h3 className="text-2xl font-bold mb-6">

                        Room Allocation

                    </h3>


                    {student.room ? (

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div>

                                <p className="text-gray-500">
                                    Room Number
                                </p>

                                <h3 className="text-2xl font-bold">
                                    {student.room.roomNumber}
                                </h3>

                            </div>


                            <div>

                                <p className="text-gray-500">
                                    Floor
                                </p>

                                <h3 className="text-2xl font-bold">
                                    {student.room.floor}
                                </h3>

                            </div>


                            <div>

                                <p className="text-gray-500">
                                    Room Capacity
                                </p>

                                <h3 className="text-2xl font-bold">
                                    {student.room.capacity} Students
                                </h3>

                            </div>

                        </div>

                    ) : (

                        <div className="text-center py-8">

                            <BedDouble
                                size={45}
                                className="mx-auto text-gray-400 mb-3"
                            />

                            <h4 className="text-xl font-semibold">

                                No Room Allocated

                            </h4>

                            <p className="text-gray-500 mt-2">

                                You haven't selected a hostel room yet.

                            </p>


                            <button
                                onClick={() => navigate("/student/rooms")}
                                className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >

                                Select Your Room

                            </button>

                        </div>

                    )}

                </div>



                {/* Academic Information */}

                <div className="bg-white rounded-xl shadow mt-8 p-6">

                    <h3 className="text-2xl font-bold mb-5">

                        Academic Information

                    </h3>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                        <div>
                            <p className="text-gray-500">Roll Number</p>

                            <p className="font-semibold">
                                {student.universityRollNo}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">Branch</p>

                            <p className="font-semibold">
                                {student.branch}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">Year</p>

                            <p className="font-semibold">
                                {student.year}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">Semester</p>

                            <p className="font-semibold">
                                {student.semester}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">Email</p>

                            <p className="font-semibold">
                                {student.email}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">Phone</p>

                            <p className="font-semibold">
                                {student.phone}
                            </p>
                        </div>


                    </div>

                </div>


            </main>

        </div>

    );

}

export default StudentDashboard;