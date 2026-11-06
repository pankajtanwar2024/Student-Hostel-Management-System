import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import {
    ArrowLeft,
    BedDouble,
    Building2,
    CheckCircle,
    Users
} from "lucide-react";


function RoomSelection() {

    const navigate = useNavigate();

    // Selected floor
    const [selectedFloor, setSelectedFloor] = useState(1);

    // Store rooms
    const [rooms, setRooms] = useState([]);

    // Store student profile
    const [student, setStudent] = useState(null);

    // Loading state
    const [loading, setLoading] = useState(true);

    // Allocation state
    const [allocating, setAllocating] = useState(false);

    // Error message
    const [error, setError] = useState("");

    // Success message
    const [success, setSuccess] = useState("");


    // Fetch student profile
    const fetchStudentProfile = async () => {

        try {

            const response = await API.get("/students/profile");

            setStudent(response.data.student);

        } catch (err) {

            if (err.response?.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/student/login");

            } else {

                setError("Unable to fetch student information.");

            }

        }

    };


    // Fetch rooms of selected floor
    const fetchRooms = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                `/rooms?floor=${selectedFloor}`
            );

            // Support either an array response or { rooms: [...] }
            const roomData = Array.isArray(response.data)
                ? response.data
                : response.data.rooms;

            setRooms(roomData || []);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to fetch rooms."
            );

        } finally {

            setLoading(false);

        }

    };


    // Fetch data when page opens or floor changes
    useEffect(() => {

        fetchStudentProfile();

    }, []);

    useEffect(() => {

        fetchRooms();

    }, [selectedFloor]);


    // Allocate or change room
    const handleRoomSelection = async (roomNumber) => {
        console.log("handleRoomSelection executed:", roomNumber);

        const isChangingRoom = Boolean(student?.room);

        const confirmation = window.confirm(
            isChangingRoom
                ? `Do you want to change your room to ${roomNumber}?`
                : `Do you want to select room ${roomNumber}?`
        );

        if (!confirmation) return;

        try {

            setAllocating(true);
            setError("");
            setSuccess("");

            let response;

            if (isChangingRoom) {

                // Change existing room
                response = await API.patch(
                    "/rooms/change",
                    {
                        roomNumber
                    }
                );

            } else {

                // First-time room allocation
                response = await API.post(
                    `/rooms/${roomNumber}/allocate`
                );

            }

            setSuccess(
                response.data.message ||
                `Room ${roomNumber} selected successfully!`
            );

            // Refresh student and room information
            await fetchStudentProfile();
            await fetchRooms();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Room allocation failed."
            );

        } finally {

            setAllocating(false);

        }

    };


    // Loading screen
    if (loading && rooms.length === 0) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-xl font-semibold">
                    Loading Rooms...
                </h2>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-100">


            {/* Navbar */}

            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">

                <h1 className="text-xl font-bold text-blue-700">

                    Hostel Management System

                </h1>

                <button
                    onClick={() => navigate("/student/dashboard")}
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

                        Select Your Hostel Room

                    </h2>

                    <p className="text-gray-500 mt-2">

                        Choose your preferred floor and available room.

                    </p>

                </div>



                {/* Current Room */}

                {student?.room && (

                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mb-8">

                        <h3 className="font-semibold text-blue-800">

                            Your Current Room

                        </h3>

                        <p className="text-blue-700 mt-2">

                            Room {student.room.roomNumber},
                            Floor {student.room.floor}

                        </p>

                        <p className="text-sm text-blue-600 mt-1">

                            You can select another available room below.

                        </p>

                    </div>

                )}



                {/* Floor Selection */}

                <div className="bg-white p-6 rounded-xl shadow mb-8">

                    <h3 className="text-xl font-bold mb-5">

                        Select Floor

                    </h3>


                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

                        {[1, 2, 3, 4, 5].map((floor) => (

                            <button
                                key={floor}
                                onClick={() => setSelectedFloor(floor)}
                                className={`p-4 rounded-lg font-semibold transition ${
                                    selectedFloor === floor
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                                }`}
                            >

                                <Building2
                                    className="mx-auto mb-2"
                                    size={25}
                                />

                                Floor {floor}

                            </button>

                        ))}

                    </div>

                </div>



                {/* Success Message */}

                {success && (

                    <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-5">

                        {success}

                    </div>

                )}



                {/* Error Message */}

                {error && (

                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">

                        {error}

                    </div>

                )}



                {/* Room List */}

                <div className="bg-white p-6 rounded-xl shadow">


                    <div className="flex justify-between items-center mb-6">

                        <h3 className="text-2xl font-bold">

                            Floor {selectedFloor} Rooms

                        </h3>

                        <span className="text-gray-500">

                            {rooms.length} Rooms

                        </span>

                    </div>


                    {loading ? (

                        <p className="text-center py-8">
                            Loading rooms...
                        </p>

                    ) : rooms.length === 0 ? (

                        <p className="text-center py-8 text-gray-500">
                            No rooms found on this floor.
                        </p>

                    ) : (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                            {rooms.map((room) => {

                                const occupiedBeds =
                                    room.occupiedBeds ??
                                    room.occupants?.length ??
                                    0;

                                const availableBeds =
                                    room.availableBeds ??
                                    room.capacity - occupiedBeds;

                                const isFull =
                                    room.status === "full" ||
                                    availableBeds <= 0;

                                const isCurrentRoom =
                                    student?.room?._id === room._id;

                                return (

                                    <div
                                        key={room._id}
                                        className={`border rounded-xl p-5 ${
                                            isFull
                                                ? "border-red-200 bg-red-50"
                                                : "border-green-200 bg-green-50"
                                        }`}
                                    >

                                        <div className="flex justify-between items-center mb-4">

                                            <h4 className="text-xl font-bold">

                                                Room {room.roomNumber}

                                            </h4>

                                            {isFull ? (

                                                <span className="text-xs font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">

                                                    FULL

                                                </span>

                                            ) : (

                                                <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">

                                                    AVAILABLE

                                                </span>

                                            )}

                                        </div>



                                        {/* Occupancy */}

                                        <div className="flex items-center gap-2 text-gray-600 mb-3">

                                            <Users size={18} />

                                            <span>

                                                {occupiedBeds}/{room.capacity} Students

                                            </span>

                                        </div>



                                        {/* Available Beds */}

                                        <div className="flex items-center gap-2 text-gray-600 mb-5">

                                            <BedDouble size={18} />

                                            <span>

                                                {availableBeds} Beds Available

                                            </span>

                                        </div>



                                        {/* Allocation Button */}

                                        {isCurrentRoom ? (

                                            <button
                                                disabled
                                                className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg"
                                            >

                                                <CheckCircle
                                                    size={16}
                                                    className="inline mr-2"
                                                />

                                                Current Room

                                            </button>

                                        ) : (

                                            <button
                                                onClick={() => handleRoomSelection(room.roomNumber)}
                                                disabled={isFull || allocating}
                                                className={`w-full py-2 rounded-lg font-semibold ${
                                                    isFull || allocating
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                            >

                                                {allocating
                                                    ? "Processing..."
                                                    : student?.room
                                                        ? "Change to This Room"
                                                        : "Select Room"
                                                }

                                            </button>

                                        )}

                                    </div>

                                );

                            })}

                        </div>

                    )}

                </div>

            </main>

        </div>

    );

}

export default RoomSelection;