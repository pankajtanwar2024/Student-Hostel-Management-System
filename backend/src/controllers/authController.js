const Student = require("../models/Student");
const HostelId = require("../models/HostelId");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// STUDENT REGISTRATION
// ==========================

const registerStudent = async (req, res) => {

    try {

        const {
            hostelId,
            password,
            name,
            email,
            phone,
            universityRollNo,
            course,
            branch,
            year,
            semester,
            university
        } = req.body;

        // Check required fields
        if (
            !hostelId || !password || !name || !email ||
            !phone || !universityRollNo || !course ||
            !branch || !year || !semester || !university
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        // Find and atomically claim an unused Hostel ID
        const validHostelId = await HostelId.findOneAndUpdate(
            {
                hostelId: hostelId.trim().toUpperCase(),
                isRegistered: false
            },
            {
                $set: {
                    isRegistered: true
                }
            },
            {
                new: true
            }
        );

        if (!validHostelId) {

            return res.status(400).json({
                message: "Invalid or already registered Hostel ID"
            });

        }

        try {

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create student
            const student = await Student.create({

                hostelId: validHostelId.hostelId,

                password: hashedPassword,

                name,
                email,
                phone,

                universityRollNo,
                course,
                branch,
                year,
                semester,
                university

            });

            // Link Hostel ID with student
            validHostelId.student = student._id;

            await validHostelId.save();

            return res.status(201).json({

                message: "Student registered successfully!",

                student: {
                    id: student._id,
                    hostelId: student.hostelId,
                    name: student.name,
                    email: student.email
                }

            });

        } catch (error) {

            // Release the Hostel ID if student creation fails
            await HostelId.updateOne(
                {
                    _id: validHostelId._id,
                    isRegistered: true,
                    student: null
                },
                {
                    $set: {
                        isRegistered: false
                    }
                }
            );

            throw error;

        }

    } catch (error) {

        console.error("Registration Error:", error.message);

        if (error.code === 11000) {

            return res.status(409).json({
                message: "Email, Hostel ID or University Roll Number already exists"
            });

        }

        return res.status(500).json({
            message: "Server error during registration"
        });

    }

};


// ==========================
// STUDENT LOGIN
// ==========================

const loginStudent = async (req, res) => {

    try {

        const { hostelId, password } = req.body;

        if (!hostelId || !password) {

            return res.status(400).json({
                message: "Hostel ID and password are required"
            });

        }

        // Find student
        const student = await Student.findOne({

            hostelId: hostelId.trim().toUpperCase()

        });

        if (!student) {

            return res.status(401).json({
                message: "Invalid Hostel ID or password"
            });

        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            student.password
        );

        if (!isPasswordCorrect) {

            return res.status(401).json({
                message: "Invalid Hostel ID or password"
            });

        }

        // Generate JWT
        const token = jwt.sign(

            {
                id: student._id,
                role: "student"

            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        return res.status(200).json({

            message: "Login successful!",

            token,

            student: {
                id: student._id,
                hostelId: student.hostelId,
                name: student.name,
                email: student.email,
                room: student.room
            }

        });

    } catch (error) {

        console.error("Login Error:", error.message);

        return res.status(500).json({
            message: "Server error during login"
        });

    }

};


module.exports = {
    registerStudent,
    loginStudent
};