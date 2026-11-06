import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    ArrowLeft,
    Users,
    Eye,
    RefreshCw
} from "lucide-react";

import API from "../../services/api";


function StudentManagement() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [search, setSearch] = useState("");
    const [floor, setFloor] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Fetch students
    const fetchStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get("/admin/students", {
                params: {
                    search,
                    floor,
                    status,
                    page,
                    limit: 10
                }
            });

            console.log("Students API:", response.data);

            const data = response.data;

            setStudents(
                Array.isArray(data)
                    ? data
                    : data.students || []
            );

            setTotalPages(
                data.pagination?.totalPages ||
                data.totalPages ||
                1
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to fetch students."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchStudents();

    }, [page, floor, status]);


    // Search handler
    const handleSearch = (e) => {

        e.preventDefault();
        setPage(1);

        fetchStudents();

    };


    // View student details
    const viewStudent = (studentId) => {

        navigate(`/admin/students/${studentId}`);

    };


    return (

        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}

            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">

                <h1 className="text-2xl font-bold text-blue-700">
                    Student Management
                </h1>

                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center gap-2 text-blue-600"
                >

                    <ArrowLeft size={18} />

                    Dashboard

                </button>

            </nav>


            <main className="max-w-7xl mx-auto p-6">

                {/* Heading */}

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-gray-800">
                        Registered Students
                    </h2>

                    <p className="text-gray-500 mt-2">
                        View and manage hostel students.
                    </p>

                </div>


                {/* Search and Filters */}

                <div className="bg-white p-5 rounded-xl shadow-sm mb-6">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <form
                            onSubmit={handleSearch}
                            className="md:col-span-2 flex"
                        >

                            <input
                                type="text"
                                placeholder="Search by name, Hostel ID or roll number"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border p-3 rounded-l-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 rounded-r-lg"
                            >

                                <Search size={20} />

                            </button>

                        </form>


                        <select
                            value={floor}
                            onChange={(e) => {
                                setFloor(e.target.value);
                                setPage(1);
                            }}
                            className="border p-3 rounded-lg"
                        >

                            <option value="">All Floors</option>

                            {[1, 2, 3, 4, 5].map((item) => (

                                <option key={item} value={item}>
                                    Floor {item}
                                </option>

                            ))}

                        </select>


                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="border p-3 rounded-lg"
                        >

                            <option value="">All Statuses</option>
                            <option value="allocated">Allocated</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>

                        </select>

                    </div>

                </div>


                {/* Student Table */}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    <div className="p-5 border-b flex justify-between items-center">

                        <h3 className="text-xl font-bold flex items-center gap-2">

                            <Users size={22} />

                            Students

                        </h3>


                        <button
                            onClick={fetchStudents}
                            className="flex items-center gap-2 text-blue-600"
                        >

                            <RefreshCw size={17} />

                            Refresh

                        </button>

                    </div>


                    {loading ? (

                        <p className="text-center py-10">
                            Loading students...
                        </p>

                    ) : error ? (

                        <p className="text-center py-10 text-red-600">
                            {error}
                        </p>

                    ) : students.length === 0 ? (

                        <p className="text-center py-10 text-gray-500">
                            No students found.
                        </p>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="bg-gray-50">

                                    <tr className="text-gray-600">

                                        <th className="p-4">Name</th>
                                        <th className="p-4">Hostel ID</th>
                                        <th className="p-4">Roll Number</th>
                                        <th className="p-4">Course</th>
                                        <th className="p-4">Room</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {students.map((student) => (

                                        <tr
                                            key={student._id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="p-4 font-medium">
                                                {student.name}
                                            </td>

                                            <td className="p-4">
                                                {student.hostelId}
                                            </td>

                                            <td className="p-4">
                                                {student.universityRollNo}
                                            </td>

                                            <td className="p-4">
                                                {student.course}
                                            </td>

                                            <td className="p-4">
                                                {student.room?.roomNumber || "Not Assigned"}
                                            </td>

                                            <td className="p-4">

                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    student.status === "allocated"
                                                        ? "bg-green-100 text-green-700"
                                                        : student.status === "inactive"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                    {student.status || "pending"}
                                                </span>

                                            </td>

                                            <td className="p-4">

                                                <button
                                                    onClick={() => viewStudent(student._id)}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                                >

                                                    <Eye size={17} />

                                                    View

                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* Pagination */}

                    <div className="p-5 border-t flex justify-between items-center">

                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-40"
                        >
                            Previous
                        </button>


                        <span className="text-gray-600">
                            Page {page} of {totalPages}
                        </span>


                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                </div>

            </main>

        </div>

    );

}

export default StudentManagement;