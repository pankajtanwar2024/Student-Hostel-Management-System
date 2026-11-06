const Student = require("../models/Student");


// =================================
// GET ALL STUDENTS
// =================================

const getAllStudents = async (req, res) => {

    try {

        const {
            search,
            floor,
            status,
            page = 1,
            limit = 10
        } = req.query;

        const currentPage = Math.max(1, Number(page) || 1);

        const pageSize = Math.min(
            100,
            Math.max(1, Number(limit) || 10)
        );

        const filter = {};

        // Search functionality
        if (search) {

            const searchRegex = new RegExp(
                search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );

            filter.$or = [

                {
                    name: searchRegex
                },

                {
                    hostelId: searchRegex
                },

                {
                    universityRollNo: searchRegex
                },

                {
                    email: searchRegex
                }

            ];

        }

        // Floor filter
        if (floor) {

            const floorNumber = Number(floor);

            if (!Number.isInteger(floorNumber) ||
                floorNumber < 1 ||
                floorNumber > 5) {

                return res.status(400).json({
                    message: "Invalid floor number"
                });

            }

            filter.floor = floorNumber;

        }

        // Status filter
        if (status) {

            if (!["pending", "allocated", "inactive"].includes(status)) {

                return res.status(400).json({
                    message: "Invalid student status"
                });

            }

            filter.status = status;

        }

        // Total matching students
        const totalStudents = await Student.countDocuments(filter);

        // Fetch students
        const students = await Student.find(filter)

            .select("-password")

            .populate("room", "roomNumber floor capacity")

            .sort({
                createdAt: -1
            })

            .skip((currentPage - 1) * pageSize)

            .limit(pageSize);

        return res.status(200).json({

            message: "Students retrieved successfully",

            pagination: {

                totalStudents,

                currentPage,

                totalPages: Math.ceil(totalStudents / pageSize),

                pageSize

            },

            students

        });

    } catch (error) {

        console.error("Student Management Error:", error.message);

        return res.status(500).json({

            message: "Failed to retrieve students"

        });

    }

};


// =================================
// GET STUDENT BY ID
// =================================

const getStudentById = async (req, res) => {

    try {

        const student = await Student.findById(req.params.id)

            .select("-password")

            .populate("room");

        if (!student) {

            return res.status(404).json({

                message: "Student not found"

            });

        }

        return res.status(200).json({

            message: "Student details retrieved successfully",

            student

        });

    } catch (error) {

        if (error.name === "CastError") {

            return res.status(400).json({

                message: "Invalid student ID"

            });

        }

        return res.status(500).json({

            message: "Failed to retrieve student details"

        });

    }

};


module.exports = {

    getAllStudents,

    getStudentById

};