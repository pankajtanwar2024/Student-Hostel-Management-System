const Room = require("../models/Room");

const generateRooms = async () => {

    try {

        // Check whether rooms already exist
        const existingRooms = await Room.countDocuments();

        if (existingRooms > 0) {
            console.log("Rooms already exist!");
            return;
        }

        const rooms = [];

        // Generate 5 floors
        for (let floor = 1; floor <= 5; floor++) {

            // Generate 20 rooms per floor
            for (let room = 1; room <= 20; room++) {

                const roomNumber = floor * 100 + room;

                rooms.push({

                    roomNumber: roomNumber,

                    floor: floor,

                    capacity: 5,

                    occupants: [],

                    status: "available"

                });

            }

        }

        // Insert all rooms into MongoDB
        await Room.insertMany(rooms);

        console.log("100 Hostel Rooms Generated Successfully!");

    } catch (error) {

        console.error("Room Generation Failed:", error.message);

    }

};

module.exports = generateRooms;