const mongoose = require("mongoose");

const Room = require("../models/Room");

const Student = require("../models/Student");


// ========================================
// STUDENT: CHANGE ALLOCATED ROOM
// ========================================

const changeStudentRoom = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const studentId = req.user.id;

        const newRoomNumber = Number(req.body.roomNumber);

        if (!Number.isInteger(newRoomNumber)) {

            return res.status(400).json({
                message: "Invalid room number"
            });

        }

        let allocation;

        await session.withTransaction(async () => {

            const student = await Student.findById(studentId)
                .session(session);

            if (!student) {
                throw new Error("STUDENT_NOT_FOUND");
            }

            if (student.status !== "allocated" || !student.room) {
                throw new Error("NO_EXISTING_ROOM");
            }

            const oldRoomId = student.room;

            const newRoom = await Room.findOne({
                roomNumber: newRoomNumber
            }).session(session);

            if (!newRoom) {
                throw new Error("ROOM_NOT_FOUND");
            }

            if (newRoom._id.toString() === oldRoomId.toString()) {
                throw new Error("SAME_ROOM");
            }

            // Add student to new room
            const updatedNewRoom = await Room.findOneAndUpdate(

                {
                    _id: newRoom._id,

                    $expr: {
                        $lt: [
                            { $size: "$occupants" },
                            "$capacity"
                        ]
                    }

                },

                {
                    $addToSet: {
                        occupants: student._id
                    }
                },

                {
                    new: true,
                    session
                }

            );

            if (!updatedNewRoom) {
                throw new Error("ROOM_FULL");
            }

            // Remove student from old room
            const updatedOldRoom = await Room.findOneAndUpdate(

                {
                    _id: oldRoomId,

                    occupants: student._id

                },

                {
                    $pull: {
                        occupants: student._id
                    }
                },

                {
                    new: true,
                    session
                }

            );

            if (!updatedOldRoom) {
                throw new Error("OLD_ROOM_INCONSISTENT");
            }

            // Update student
            student.room = updatedNewRoom._id;

            student.floor = updatedNewRoom.floor;

            await student.save({ session });

            allocation = {

                oldRoom: updatedOldRoom.roomNumber,

                newRoom: updatedNewRoom.roomNumber,

                floor: updatedNewRoom.floor,

                availableBeds:
                    updatedNewRoom.capacity -
                    updatedNewRoom.occupants.length

            };

        });

        return res.status(200).json({

            message: "Room changed successfully",

            allocation

        });

    } catch (error) {

        console.error("Room Change Error:", error.message);

        const errors = {

            STUDENT_NOT_FOUND: [404, "Student not found"],

            NO_EXISTING_ROOM: [400, "You do not have an allocated room"],

            ROOM_NOT_FOUND: [404, "Selected room does not exist"],

            SAME_ROOM: [400, "You already occupy this room"],

            ROOM_FULL: [409, "Selected room is full"],

            OLD_ROOM_INCONSISTENT: [
                409,
                "Previous room allocation is inconsistent"
            ]

        };

        if (errors[error.message]) {

            const [status, message] = errors[error.message];

            return res.status(status).json({ message });

        }

        return res.status(500).json({

            message: "Room change failed"

        });

    } finally {

        await session.endSession();

    }

};


// =================================
// ALLOCATE ROOM TO STUDENT
// =================================

const allocateRoom = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const studentId = req.user.id;

        const roomNumber = Number(req.params.roomNumber);

        if (!Number.isInteger(roomNumber)) {

            return res.status(400).json({

                message: "Invalid room number"

            });

        }

        let allocatedRoom = null;

        await session.withTransaction(async () => {

            // Find student
            const student = await Student.findById(studentId)
                .session(session);

            if (!student) {

                throw new Error("STUDENT_NOT_FOUND");

            }

            // Check student status
            if (student.status === "inactive") {

                throw new Error("STUDENT_INACTIVE");

            }

            // Check whether student already has a room
            if (student.room) {

                throw new Error("ROOM_ALREADY_ALLOCATED");

            }

            // Atomically reserve one available bed
            const room = await Room.findOneAndUpdate(

                {

                    roomNumber,

                    // Check actual occupancy against capacity
                    $expr: {

                        $lt: [

                            { $size: "$occupants" },

                            "$capacity"

                        ]

                    }

                },

                {

                    $addToSet: {

                        occupants: student._id

                    }

                },

                {

                    new: true,

                    session

                }

            );

            if (!room) {

                throw new Error("ROOM_NOT_AVAILABLE");

            }

            // Update student information
            const updatedStudent = await Student.findOneAndUpdate(

                {

                    _id: student._id,

                    room: null,

                    status: "pending"

                },

                {

                    $set: {

                        room: room._id,

                        floor: room.floor,

                        status: "allocated"

                    }

                },

                {

                    new: true,

                    session

                }

            );

            if (!updatedStudent) {

                throw new Error("STUDENT_ALLOCATION_FAILED");

            }

            allocatedRoom = room;

        });

        return res.status(200).json({

            message: "Room allocated successfully!",

            allocation: {

                studentId,

                roomNumber: allocatedRoom.roomNumber,

                floor: allocatedRoom.floor,

                capacity: allocatedRoom.capacity,

                occupiedBeds: allocatedRoom.occupants.length,

                availableBeds:
                    allocatedRoom.capacity - allocatedRoom.occupants.length

            }

        });

    } catch (error) {

        console.error("Room Allocation Error:", error.message);

        const errors = {

            STUDENT_NOT_FOUND: [404, "Student not found"],

            STUDENT_INACTIVE: [403, "Inactive students cannot select rooms"],

            ROOM_ALREADY_ALLOCATED: [409, "You already have an allocated room"],

            ROOM_NOT_AVAILABLE: [409, "Room is full or does not exist"],

            STUDENT_ALLOCATION_FAILED: [409, "Student allocation could not be completed"]

        };

        if (errors[error.message]) {

            const [statusCode, message] = errors[error.message];

            return res.status(statusCode).json({

                message

            });

        }

        return res.status(500).json({

            message: "Room allocation failed"

        });

    } finally {

        await session.endSession();

    }

};


module.exports = {

    allocateRoom,
    changeStudentRoom

};
