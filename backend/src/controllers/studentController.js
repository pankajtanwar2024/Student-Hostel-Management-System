const Student = require("../models/Student");

// Get logged-in student profile

const getStudentProfile = async (req, res) => {

    try {

        // Get student ID from verified JWT
        const student = await Student.findById(req.user.id)
            .select("-password")
            .populate("room");

        if (!student) {

            return res.status(404).json({
                message: "Student not found."
            });

        }

        return res.status(200).json({

            message: "Student profile retrieved successfully.",

            student

        });

    } catch (error) {

        console.error(error.message);

        return res.status(500).json({
            message: "Server error."
        });

    }

};

module.exports = {
    getStudentProfile
};