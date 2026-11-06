import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    RefreshCw,
    Building2,
    BedDouble,
    Users,
    X,
    ArrowRightLeft,
    Trash2
} from "lucide-react";

import API from "../../services/api";

function AdminRoomManagement() {

    const navigate = useNavigate();

    // =================================
    // STATES
    // =================================

    const [rooms, setRooms] = useState([]);

    const [students, setStudents] = useState([]);

    const [allocatedStudents, setAllocatedStudents] = useState([]);

    const [selectedFloor, setSelectedFloor] = useState("all");

    // Assignment modal
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState("");

    // Change room modal
    const [studentToChange, setStudentToChange] = useState(null);
    const [newRoomNumber, setNewRoomNumber] = useState("");

    // Loading states
    const [loading, setLoading] = useState(true);
    const [studentLoading, setStudentLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [changing, setChanging] = useState(false);
    const [cancellingStudentId, setCancellingStudentId] = useState(null);

    // Error states
    const [error, setError] = useState("");
    const [studentError, setStudentError] = useState("");

    // =================================
    // FETCH ALL ROOMS
    // =================================

    const fetchRooms = async () => {

        try {

            setLoading(true);
            setError("");

            // Always fetch all rooms.
            // Floor filtering will happen in React.
            const response = await API.get("/rooms");

            const data = response.data;

            setRooms(
                Array.isArray(data)
                    ? data
                    : data.rooms || []
            );

        } catch (err) {

            console.error("Room Management Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to retrieve rooms."
            );

        } finally {

            setLoading(false);

        }

    };

    // =================================
    // FETCH ALL STUDENTS
    // =================================

    const fetchStudents = async () => {

        try {

            setStudentLoading(true);
            setStudentError("");

            // Fetch first page
            const firstResponse = await API.get("/admin/students", {
                params: {
                    page: 1,
                    limit: 100
                }
            });

            const firstData = firstResponse.data;

            let allStudents = firstData.students || [];

            const totalPages =
                firstData.pagination?.totalPages || 1;

            // Fetch remaining pages
            if (totalPages > 1) {

                const remainingRequests = [];

                for (let page = 2; page <= totalPages; page++) {

                    remainingRequests.push(
                        API.get("/admin/students", {
                            params: {
                                page,
                                limit: 100
                            }
                        })
                    );

                }

                const remainingResponses = await Promise.all(
                    remainingRequests
                );

                remainingResponses.forEach((response) => {

                    allStudents = [
                        ...allStudents,
                        ...(response.data.students || [])
                    ];

                });

            }

            // Students without room allocation
            const unallocated = allStudents.filter(
                (student) =>
                    !student.room &&
                    student.status !== "inactive"
            );

            // Students with room allocation
            const allocated = allStudents.filter(
                (student) => student.room
            );

            setStudents(unallocated);

            setAllocatedStudents(allocated);

        } catch (err) {

            console.error("Student Fetch Error:", err);

            setStudentError(
                err.response?.data?.message ||
                "Unable to retrieve students."
            );

        } finally {

            setStudentLoading(false);

        }

    };

    // =================================
    // INITIAL DATA FETCH
    // =================================

    useEffect(() => {

        fetchRooms();

        fetchStudents();

    }, []);

    // =================================
    // REFRESH ALL DATA
    // =================================

    const refreshData = async () => {

        await Promise.all([
            fetchRooms(),
            fetchStudents()
        ]);

    };

    // =================================
    // ASSIGN ROOM TO STUDENT
    // =================================

    const handleAssignRoom = async () => {

        if (!selectedStudentId || !selectedRoom) {

            alert("Please select a student.");

            return;

        }

        try {

            setAssigning(true);

            const response = await API.patch(
                `/admin/students/${selectedStudentId}/room`,
                {
                    roomNumber: selectedRoom.roomNumber
                }
            );

            alert(
                response.data.message ||
                "Room assigned successfully!"
            );

            // Close modal
            setSelectedRoom(null);
            setSelectedStudentId("");

            // Refresh rooms and students
            await refreshData();

        } catch (err) {

            console.error("Room Assignment Error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to assign room."
            );

        } finally {

            setAssigning(false);

        }

    };

    // =================================
    // CHANGE STUDENT ROOM
    // =================================

    const handleChangeRoom = async () => {

        if (!studentToChange || !newRoomNumber) {

            alert("Please select a new room.");

            return;

        }

        try {

            setChanging(true);

            const response = await API.patch(
                `/admin/students/${studentToChange._id}/room`,
                {
                    roomNumber: Number(newRoomNumber)
                }
            );

            alert(
                response.data.message ||
                "Student room changed successfully."
            );

            // Close modal
            setStudentToChange(null);
            setNewRoomNumber("");

            // Refresh room and student information
            await refreshData();

        } catch (err) {

            console.error("Change Room Error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to change student room."
            );

        } finally {

            setChanging(false);

        }

    };

    // =================================
    // CANCEL ROOM ALLOCATION
    // =================================

    const handleCancelAllocation = async (student) => {

        const confirmed = window.confirm(
            `Are you sure you want to cancel the room allocation of ${student.name}?`
        );

        if (!confirmed) return;

        try {

            setCancellingStudentId(student._id);

            const response = await API.delete(
                `/admin/students/${student._id}/room`
            );

            alert(
                response.data.message ||
                "Room allocation cancelled successfully."
            );

            // Refresh rooms and students
            await refreshData();

        } catch (err) {

            console.error("Cancel Allocation Error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to cancel room allocation."
            );

        } finally {

            setCancellingStudentId(null);

        }

    };

    // =================================
    // ROOM FILTERING
    // =================================

    const displayedRooms =
        selectedFloor === "all"
            ? rooms
            : rooms.filter(
                (room) => room.floor === Number(selectedFloor)
            );

    // =================================
    // ROOM STATISTICS
    // =================================

    const totalRooms = displayedRooms.length;

    const occupiedBeds = displayedRooms.reduce(
        (total, room) =>
            total + (room.occupiedBeds || 0),
        0
    );

    const availableBeds = displayedRooms.reduce(
        (total, room) =>
            total + (room.availableBeds || 0),
        0
    );

    // =================================
    // RENDER
    // =================================

    return (

        <div className="min-h-screen bg-gray-100">

            {/* NAVBAR */}

            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-gray-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={22} />
                    </button>

                    <div>

                        <h1 className="text-2xl font-bold text-blue-700">
                            Room Management
                        </h1>

                        <p className="text-sm text-gray-500">
                            Hostel Administration
                        </p>

                    </div>

                </div>

                <button
                    onClick={refreshData}
                    disabled={loading || studentLoading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >

                    <RefreshCw size={18} />

                    Refresh

                </button>

            </nav>

            <main className="max-w-7xl mx-auto p-6">

                {/* PAGE HEADING */}

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-gray-800">
                        Hostel Rooms
                    </h2>

                    <p className="text-gray-500 mt-2">
                        View room occupancy and manage student allocations.
                    </p>

                </div>

                {/* ROOM STATISTICS */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white p-5 rounded-xl shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Total Rooms
                                </p>

                                <h3 className="text-3xl font-bold mt-2">
                                    {totalRooms}
                                </h3>

                            </div>

                            <Building2 size={30} className="text-blue-600" />

                        </div>

                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Occupied Beds
                                </p>

                                <h3 className="text-3xl font-bold mt-2 text-blue-600">
                                    {occupiedBeds}
                                </h3>

                            </div>

                            <BedDouble size={30} className="text-blue-600" />

                        </div>

                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Available Beds
                                </p>

                                <h3 className="text-3xl font-bold mt-2 text-green-600">
                                    {availableBeds}
                                </h3>

                            </div>

                            <BedDouble size={30} className="text-green-600" />

                        </div>

                    </div>

                </div>

                {/* STUDENT ALLOCATION SUMMARY */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

                    <div className="bg-white rounded-xl shadow-sm p-5">

                        <div className="flex items-center gap-3">

                            <Users size={28} className="text-orange-500" />

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Students Without Room Allocation
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800">

                                    {studentLoading
                                        ? "Loading..."
                                        : students.length
                                    }

                                </h3>

                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">

                        <div className="flex items-center gap-3">

                            <Users size={28} className="text-green-600" />

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Allocated Students
                                </p>

                                <h3 className="text-2xl font-bold text-gray-800">

                                    {studentLoading
                                        ? "Loading..."
                                        : allocatedStudents.length
                                    }

                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

                {studentError && (

                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {studentError}
                    </div>

                )}

                {/* ALLOCATED STUDENTS TABLE */}

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

                    <div className="flex flex-wrap justify-between items-center gap-3 mb-5">

                        <div>

                            <h2 className="text-xl font-bold text-gray-800">
                                Allocated Students
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Change or cancel existing room allocations.
                            </p>

                        </div>

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {allocatedStudents.length} Students
                        </span>

                    </div>

                    {studentLoading ? (

                        <p className="text-gray-500 py-5">
                            Loading students...
                        </p>

                    ) : allocatedStudents.length === 0 ? (

                        <p className="text-gray-500 py-5">
                            No students have been allocated rooms yet.
                        </p>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead>

                                    <tr className="border-b text-gray-500 text-sm">

                                        <th className="p-3">Student</th>
                                        <th className="p-3">Hostel ID</th>
                                        <th className="p-3">Room</th>
                                        <th className="p-3">Floor</th>
                                        <th className="p-3">Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {allocatedStudents.map((student) => (

                                        <tr
                                            key={student._id}
                                            className="border-b hover:bg-gray-50"
                                        >

                                            <td className="p-3 font-semibold">
                                                {student.name}
                                            </td>

                                            <td className="p-3">
                                                {student.hostelId}
                                            </td>

                                            <td className="p-3 font-semibold text-blue-600">
                                                {student.room?.roomNumber || "N/A"}
                                            </td>

                                            <td className="p-3">
                                                {student.floor || student.room?.floor || "N/A"}
                                            </td>

                                            <td className="p-3">

                                                <div className="flex flex-wrap gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setStudentToChange(student);
                                                            setNewRoomNumber("");
                                                        }}
                                                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
                                                    >

                                                        <ArrowRightLeft size={15} />

                                                        Change Room

                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelAllocation(student)}
                                                        disabled={cancellingStudentId === student._id}
                                                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                                                    >

                                                        <Trash2 size={15} />

                                                        {cancellingStudentId === student._id
                                                            ? "Cancelling..."
                                                            : "Cancel Allocation"
                                                        }

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                {/* FLOOR FILTER */}

                <div className="bg-white p-5 rounded-xl shadow-sm mb-8">

                    <label className="block text-gray-700 font-semibold mb-3">
                        Filter Rooms by Floor
                    </label>

                    <select
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="all">
                            All Floors
                        </option>

                        {[1, 2, 3, 4, 5].map((floor) => (

                            <option key={floor} value={floor}>
                                Floor {floor}
                            </option>

                        ))}

                    </select>

                </div>

                {/* ROOM DISPLAY */}

                {loading ? (

                    <div className="text-center py-12">

                        <p className="text-lg text-gray-600">
                            Loading rooms...
                        </p>

                    </div>

                ) : error ? (

                    <div className="bg-red-50 text-red-600 p-5 rounded-xl text-center">

                        <p>{error}</p>

                        <button
                            onClick={fetchRooms}
                            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            Try Again
                        </button>

                    </div>

                ) : displayedRooms.length === 0 ? (

                    <div className="bg-white p-10 rounded-xl text-center">

                        <p className="text-gray-500">
                            No rooms found.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                        {displayedRooms.map((room) => {

                            const isFull =
                                room.status === "full" ||
                                room.availableBeds <= 0;

                            const occupiedPercentage =
                                room.capacity > 0
                                    ? Math.round(
                                        (room.occupiedBeds / room.capacity) * 100
                                    )
                                    : 0;

                            return (

                                <div
                                    key={room._id}
                                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                                >

                                    {/* ROOM HEADER */}

                                    <div className="flex justify-between items-start mb-4">

                                        <div>

                                            <h3 className="text-xl font-bold text-gray-800">
                                                Room {room.roomNumber}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Floor {room.floor}
                                            </p>

                                        </div>

                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                                isFull
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}
                                        >

                                            {isFull ? "Full" : "Available"}

                                        </span>

                                    </div>

                                    {/* ROOM DETAILS */}

                                    <div className="space-y-3">

                                        <div className="flex justify-between text-sm">

                                            <span className="text-gray-500">
                                                Total Capacity
                                            </span>

                                            <span className="font-semibold">
                                                {room.capacity}
                                            </span>

                                        </div>

                                        <div className="flex justify-between text-sm">

                                            <span className="text-gray-500">
                                                Occupied Beds
                                            </span>

                                            <span className="font-semibold text-blue-600">
                                                {room.occupiedBeds}
                                            </span>

                                        </div>

                                        <div className="flex justify-between text-sm">

                                            <span className="text-gray-500">
                                                Available Beds
                                            </span>

                                            <span className="font-semibold text-green-600">
                                                {room.availableBeds}
                                            </span>

                                        </div>

                                    </div>

                                    {/* OCCUPANCY BAR */}

                                    <div className="mt-5">

                                        <div className="flex justify-between text-xs text-gray-500 mb-2">

                                            <span>
                                                Room Occupancy
                                            </span>

                                            <span>
                                                {occupiedPercentage}%
                                            </span>

                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2">

                                            <div
                                                className={`h-2 rounded-full ${
                                                    isFull
                                                        ? "bg-red-500"
                                                        : "bg-blue-600"
                                                }`}
                                                style={{
                                                    width: `${occupiedPercentage}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* ASSIGN STUDENT BUTTON */}

                                    <div className="mt-5">

                                        <button
                                            type="button"
                                            disabled={
                                                isFull ||
                                                studentLoading ||
                                                students.length === 0
                                            }
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setSelectedStudentId("");
                                            }}
                                            className={`w-full py-2 rounded-lg font-semibold transition ${
                                                isFull ||
                                                studentLoading ||
                                                students.length === 0
                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                        >

                                            {isFull
                                                ? "Room Full"
                                                : studentLoading
                                                    ? "Loading Students..."
                                                    : students.length === 0
                                                        ? "No Unallocated Students"
                                                        : "Assign Student"
                                            }

                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </main>

            {/* ================================= */}
            {/* ASSIGNMENT MODAL */}
            {/* ================================= */}

            {selectedRoom && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

                        <div className="flex justify-between items-center mb-3">

                            <h2 className="text-2xl font-bold text-gray-800">
                                Assign Student
                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedRoom(null);
                                    setSelectedStudentId("");
                                }}
                                disabled={assigning}
                                className="text-gray-500 hover:text-red-600"
                            >

                                <X size={22} />

                            </button>

                        </div>

                        <p className="text-gray-500 mb-6">

                            Select a student to assign to Room{" "}

                            <span className="font-bold text-blue-600">
                                {selectedRoom.roomNumber}
                            </span>

                        </p>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Student
                        </label>

                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="">
                                Choose a student
                            </option>

                            {students.map((student) => (

                                <option
                                    key={student._id}
                                    value={student._id}
                                >

                                    {student.name} — {student.hostelId}

                                </option>

                            ))}

                        </select>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedRoom(null);
                                    setSelectedStudentId("");
                                }}
                                disabled={assigning}
                                className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAssignRoom}
                                disabled={!selectedStudentId || assigning}
                                className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >

                                {assigning
                                    ? "Assigning..."
                                    : "Confirm Assignment"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ================================= */}
            {/* CHANGE ROOM MODAL */}
            {/* ================================= */}

            {studentToChange && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

                        <div className="flex justify-between items-center mb-4">

                            <h2 className="text-2xl font-bold text-gray-800">
                                Change Student Room
                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setStudentToChange(null);
                                    setNewRoomNumber("");
                                }}
                                disabled={changing}
                                className="text-gray-500 hover:text-red-600"
                            >

                                <X size={22} />

                            </button>

                        </div>

                        {/* STUDENT INFORMATION */}

                        <div className="bg-gray-50 p-4 rounded-lg mb-5">

                            <p className="font-semibold text-gray-800">
                                {studentToChange.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                Hostel ID: {studentToChange.hostelId}
                            </p>

                            <p className="text-sm text-gray-500">
                                Current Room: {studentToChange.room?.roomNumber || "N/A"}
                            </p>

                            <p className="text-sm text-gray-500">
                                Current Floor: {studentToChange.floor || studentToChange.room?.floor || "N/A"}
                            </p>

                        </div>

                        {/* NEW ROOM */}

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select New Room
                        </label>

                        <select
                            value={newRoomNumber}
                            onChange={(e) => setNewRoomNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="">
                                Choose an available room
                            </option>

                            {rooms
                                .filter((room) =>
                                    room.availableBeds > 0 &&
                                    Number(room.roomNumber) !==
                                        Number(studentToChange.room?.roomNumber)
                                )
                                .map((room) => (

                                    <option
                                        key={room._id}
                                        value={room.roomNumber}
                                    >

                                        Room {room.roomNumber} — Floor {room.floor} — {room.availableBeds} beds available

                                    </option>

                                ))
                            }

                        </select>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    setStudentToChange(null);
                                    setNewRoomNumber("");
                                }}
                                disabled={changing}
                                className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleChangeRoom}
                                disabled={!newRoomNumber || changing}
                                className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >

                                {changing
                                    ? "Changing..."
                                    : "Confirm Change"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default AdminRoomManagement;