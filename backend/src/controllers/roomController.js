const Room = require("../models/Room");


// =================================
// GET ALL ROOMS
// =================================

const getAllRooms = async (req, res) => {

    try {

        const { floor } = req.query;

        const filter = {};

        // Validate floor
        if (floor !== undefined) {

            const floorNumber = Number(floor);

            if (
                !Number.isInteger(floorNumber) ||
                floorNumber < 1 ||
                floorNumber > 5
            ) {

                return res.status(400).json({
                    message: "Floor must be between 1 and 5"
                });

            }

            filter.floor = floorNumber;

        }

        // Retrieve rooms
        const rooms = await Room.find(filter)
            .populate("occupants", "name hostelId")
            .sort({ roomNumber: 1 });

        // Format room information
        const formattedRooms = rooms.map(room => ({

            _id: room._id,

            roomNumber: room.roomNumber,

            floor: room.floor,

            capacity: room.capacity,

            occupiedBeds: room.occupants.length,

            availableBeds: room.capacity - room.occupants.length,

            status: room.occupants.length >= room.capacity
                ? "full"
                : "available",

            occupants: room.occupants

        }));

        return res.status(200).json({

            message: "Rooms retrieved successfully",

            totalRooms: formattedRooms.length,

            rooms: formattedRooms

        });

    } catch (error) {

        console.error("Room Retrieval Error:", error.message);

        return res.status(500).json({

            message: "Failed to retrieve rooms"

        });

    }

};


// =================================
// GET SINGLE ROOM
// =================================

const getRoomByNumber = async (req, res) => {

    try {

        const roomNumber = Number(req.params.roomNumber);

        if (!Number.isInteger(roomNumber)) {

            return res.status(400).json({
                message: "Invalid room number"
            });

        }

        const room = await Room.findOne({
            roomNumber
        }).populate("occupants", "name hostelId universityRollNo");

        if (!room) {

            return res.status(404).json({

                message: "Room not found"

            });

        }

        return res.status(200).json({

            room: {

                roomNumber: room.roomNumber,

                floor: room.floor,

                capacity: room.capacity,

                occupiedBeds: room.occupants.length,

                availableBeds: room.capacity - room.occupants.length,

                status: room.occupants.length >= room.capacity
                    ? "full"
                    : "available",

                occupants: room.occupants

            }

        });

    } catch (error) {

        console.error(error.message);

        return res.status(500).json({

            message: "Failed to retrieve room"

        });

    }

};


module.exports = {

    getAllRooms,

    getRoomByNumber

};