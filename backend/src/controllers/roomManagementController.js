const mongoose = require("mongoose");

const Student = require("../models/Student");
const Room = require("../models/Room");


// ========================================
// ADMIN: ALLOCATE OR CHANGE STUDENT ROOM
// ========================================

const assignRoomToStudent = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const { studentId } = req.params;

        const roomNumber = Number(req.body.roomNumber);

        if (!mongoose.isValidObjectId(studentId)) {

            return res.status(400).json({
                message: "Invalid student ID"
            });

        }

        if (!Number.isInteger(roomNumber)) {

            return res.status(400).json({
                message: "Invalid room number"
            });

        }

        let result;

        await session.withTransaction(async () => {

            // Find student
            const student = await Student.findById(studentId)
                .session(session);

            if (!student) {
                throw new Error("STUDENT_NOT_FOUND");
            }

            if (student.status === "inactive") {
                throw new Error("STUDENT_INACTIVE");
            }

            // Find target room
            const targetRoom = await Room.findOne({
                roomNumber
            }).session(session);

            if (!targetRoom) {
                throw new Error("ROOM_NOT_FOUND");
            }

            // Prevent assigning the same room
            if (
                student.room &&
                student.room.toString() === targetRoom._id.toString()
            ) {
                throw new Error("SAME_ROOM");
            }

            // Atomically add student to target room
            const updatedRoom = await Room.findOneAndUpdate(

                {
                    _id: targetRoom._id,

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

            if (!updatedRoom) {
                throw new Error("ROOM_FULL");
            }

            // Remove student from previous room
            if (student.room) {

                const oldRoom = await Room.findOneAndUpdate(

                    {
                        _id: student.room,

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

                if (!oldRoom) {
                    throw new Error("OLD_ROOM_INCONSISTENT");
                }

            }

            // Update student document
            student.room = updatedRoom._id;

            student.floor = updatedRoom.floor;

            student.status = "allocated";

            await student.save({ session });

            result = {

                studentId: student._id,

                studentName: student.name,

                roomNumber: updatedRoom.roomNumber,

                floor: updatedRoom.floor,

                occupiedBeds: updatedRoom.occupants.length,

                availableBeds:
                    updatedRoom.capacity - updatedRoom.occupants.length

            };

        });

        return res.status(200).json({

            message: "Student room allocation updated successfully",

            allocation: result

        });

    } catch (error) {

        console.error("Admin Room Management:", error.message);

        const errors = {

            STUDENT_NOT_FOUND: [404, "Student not found"],

            STUDENT_INACTIVE: [403, "Student account is inactive"],

            ROOM_NOT_FOUND: [404, "Room not found"],

            SAME_ROOM: [400, "Student is already allocated to this room"],

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

            message: "Failed to update room allocation"

        });

    } finally {

        await session.endSession();

    }

};


// ========================================
// ADMIN: CANCEL STUDENT ROOM ALLOCATION
// ========================================

const cancelStudentAllocation = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const { studentId } = req.params;

        if (!mongoose.isValidObjectId(studentId)) {

            return res.status(400).json({
                message: "Invalid student ID"
            });

        }

        await session.withTransaction(async () => {

            const student = await Student.findById(studentId)
                .session(session);

            if (!student) {
                throw new Error("STUDENT_NOT_FOUND");
            }

            if (!student.room) {
                throw new Error("NO_ROOM_ALLOCATED");
            }

            // Remove student from room
            const room = await Room.findOneAndUpdate(

                {
                    _id: student.room,

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

            if (!room) {
                throw new Error("ROOM_INCONSISTENT");
            }

            // Update student
            student.room = null;

            student.floor = null;

            student.status = "pending";

            await student.save({ session });

        });

        return res.status(200).json({

            message: "Student room allocation cancelled successfully"

        });

    } catch (error) {

        console.error("Cancellation Error:", error.message);

        const errors = {

            STUDENT_NOT_FOUND: [404, "Student not found"],

            NO_ROOM_ALLOCATED: [400, "Student has no allocated room"],

            ROOM_INCONSISTENT: [
                409,
                "Room allocation is inconsistent"
            ]

        };

        if (errors[error.message]) {

            const [status, message] = errors[error.message];

            return res.status(status).json({ message });

        }

        return res.status(500).json({

            message: "Failed to cancel room allocation"

        });

    } finally {

        await session.endSession();

    }

};


module.exports = {

    assignRoomToStudent,

    cancelStudentAllocation

};