const Admin = require("../models/Admin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// ADMIN LOGIN
// ==========================

const loginAdmin = async (req, res) => {

    try {

        const { username, password } = req.body;

        // Validate fields
        if (!username || !password) {

            return res.status(400).json({
                message: "Username and password are required"
            });

        }

        // Find admin
        const admin = await Admin.findOne({
            username: username.trim()
        });

        if (!admin) {

            return res.status(401).json({
                message: "Invalid username or password"
            });

        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordCorrect) {

            return res.status(401).json({
                message: "Invalid username or password"
            });

        }

        // Generate JWT
        const token = jwt.sign(

            {
                id: admin._id,
                role: "admin"
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        return res.status(200).json({

            message: "Admin login successful!",

            token,

            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }

        });

    } catch (error) {

        console.error("Admin Login Error:", error.message);

        return res.status(500).json({
            message: "Server error during admin login"
        });

    }

};

module.exports = {
    loginAdmin
};