require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");

const createAdmin = async () => {

    try {

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected!");

        // Check existing admin
        const existingAdmin = await Admin.findOne({
            username: process.env.ADMIN_USERNAME
        });

        if (existingAdmin) {

            console.log("Admin already exists!");

            return;

        }

        // Hash admin password
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
        );

        // Create admin
        const admin = await Admin.create({

            username: process.env.ADMIN_USERNAME,

            email: process.env.ADMIN_EMAIL,

            password: hashedPassword,

            role: "admin"

        });

        console.log("Admin Created Successfully!");

        console.log("Admin ID:", admin._id);

    } catch (error) {

        console.error("Admin Creation Failed:", error.message);

    } finally {

        await mongoose.disconnect();

    }

};

createAdmin();