import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Users,
    Building2,
    BedDouble,
    CheckCircle,
    UserX,
    KeyRound,
    LogOut,
    RefreshCw
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import API from "../../services/api";


function AdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [floors, setFloors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Fetch dashboard data
    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const [statsResponse, floorsResponse] =
                await Promise.all([
                    API.get("/admin/stats"),
                    API.get("/admin/floors")
                ]);

            console.log("Stats:", statsResponse.data);
            console.log("Floors:", floorsResponse.data);

            setStats(
                statsResponse.data.statistics || statsResponse.data.stats || statsResponse.data
            );

            setFloors(
                floorsResponse.data.floors || floorsResponse.data
            );

        } catch (err) {

            console.error("Dashboard Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard information."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDashboardData();

    }, []);


    // Logout
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/admin/login");

    };


    // Loading screen
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    Loading Admin Dashboard...
                </h2>

            </div>
        );

    }


    if (error) {

        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">

                <p className="text-red-600">{error}</p>

                <button
                    onClick={fetchDashboardData}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    Try Again
                </button>

            </div>
        );

    }


    if (!stats || !Array.isArray(floors)) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Invalid dashboard data received from server.</p>
            </div>
        );

    }


    // Dashboard cards
    const cards = [

        {
            title: "Total Students",
            value: stats.totalStudents ?? 0,
            icon: Users,
            color: "bg-blue-100 text-blue-700"
        },

        {
            title: "Total Rooms",
            value: stats.totalRooms ?? 0,
            icon: Building2,
            color: "bg-purple-100 text-purple-700"
        },

        {
            title: "Total Capacity",
            value: stats.totalCapacity ?? 0,
            icon: BedDouble,
            color: "bg-indigo-100 text-indigo-700"
        },

        {
            title: "Occupied Beds",
            value: stats.occupiedBeds ?? 0,
            icon: CheckCircle,
            color: "bg-green-100 text-green-700"
        },

        {
            title: "Available Beds",
            value: stats.availableBeds ?? 0,
            icon: BedDouble,
            color: "bg-teal-100 text-teal-700"
        },

        {
            title: "Unallocated Students",
            value: stats.unallocatedStudents ?? 0,
            icon: UserX,
            color: "bg-orange-100 text-orange-700"
        },

        {
            title: "Available Hostel IDs",
            value: stats.availableHostelIds ?? 0,
            icon: KeyRound,
            color: "bg-pink-100 text-pink-700"
        }

    ];


    // Occupancy chart data
    const occupancyData = [

        {
            name: "Occupied",
            value: stats.occupiedBeds ?? 0
        },

        {
            name: "Available",
            value: stats.availableBeds ?? 0
        }

    ];


    return (

        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}

            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">

                <div>

                    <h1 className="text-2xl font-bold text-blue-700">
                        Hostel Admin Panel
                    </h1>

                    <p className="text-sm text-gray-500">
                        Hostel Management System
                    </p>

                </div>


                <div className="flex items-center gap-4">

                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 text-blue-600"
                    >

                        <RefreshCw size={18} />

                        Refresh

                    </button>



                    <button
                        onClick={() => navigate("/admin/rooms")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Manage Rooms
                    </button>

                    <button
                        onClick={() => navigate("/admin/hostel-ids")}
                        className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
                        >
                        Manage Hostel IDs
                    </button>



                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </nav>


            <main className="max-w-7xl mx-auto p-6">

                {/* Heading */}

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-gray-800">
                        Dashboard Overview
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Monitor students, rooms and hostel occupancy.
                    </p>

                </div>


                {/* Statistics Cards */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {cards.map((card) => {

                        const Icon = card.icon;

                        return (

                            <div
                                key={card.title}
                                className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between"
                            >

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        {card.title}
                                    </p>

                                    <h3 className="text-3xl font-bold mt-2">
                                        {card.value}
                                    </h3>

                                </div>

                                <div className={`p-4 rounded-xl ${card.color}`}>

                                    <Icon size={25} />

                                </div>

                            </div>

                        );

                    })}

                </div>


                {/* Charts */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">


                    {/* Floor Statistics */}

                    <div className="bg-white p-6 rounded-xl shadow-sm">

                        <h3 className="text-xl font-bold mb-6">
                            Floor-wise Occupancy
                        </h3>

                        <ResponsiveContainer width="100%" height={300}>

                            <BarChart data={floors}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="floor" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="occupiedBeds"
                                    fill="#2563eb"
                                    name="Occupied Beds"
                                />

                                <Bar
                                    dataKey="availableBeds"
                                    fill="#16a34a"
                                    name="Available Beds"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>


                    {/* Hostel Occupancy */}

                    <div className="bg-white p-6 rounded-xl shadow-sm">

                        <h3 className="text-xl font-bold mb-6">
                            Overall Hostel Occupancy
                        </h3>

                        <ResponsiveContainer width="100%" height={300}>

                            <PieChart>

                                <Pie
                                    data={occupancyData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >

                                    {occupancyData.map((entry, index) => (

                                        <Cell
                                            key={entry.name}
                                            fill={
                                                index === 0
                                                    ? "#2563eb"
                                                    : "#16a34a"
                                            }
                                        />

                                    ))}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Floor Summary */}

                <div className="bg-white p-6 rounded-xl shadow-sm mt-8">

                    <h3 className="text-xl font-bold mb-6">
                        Floor Summary
                    </h3>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>

                                <tr className="border-b text-gray-500">

                                    <th className="p-3">Floor</th>
                                    <th className="p-3">Rooms</th>
                                    <th className="p-3">Capacity</th>
                                    <th className="p-3">Occupied</th>
                                    <th className="p-3">Available</th>

                                </tr>

                            </thead>


                            <tbody>

                                {floors.map((floor, index) => (

                                    <tr
                                        key={floor.floor ?? index}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-3 font-semibold">
                                            Floor {floor.floor}
                                        </td>

                                        <td className="p-3">
                                            {floor.totalRooms ?? 0}
                                        </td>

                                        <td className="p-3">
                                            {floor.totalCapacity ?? 0}
                                        </td>

                                        <td className="p-3 text-blue-600 font-semibold">
                                            {floor.occupiedBeds ?? 0}
                                        </td>

                                        <td className="p-3 text-green-600 font-semibold">
                                            {floor.availableBeds ?? 0}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </main>

        </div>

    );

}

export default AdminDashboard;