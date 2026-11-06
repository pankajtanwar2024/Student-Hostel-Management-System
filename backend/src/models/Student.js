const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    // Authentication Details
    hostelId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    // Personal Details
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    // University Details
    universityRollNo: {
        type: String,
        required: true,
        unique: true
    },

    course: {
        type: String,
        required: true
    },

    branch: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    university: {
        type: String,
        required: true
    },

    // Room Allocation
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        default: null
    },

    floor: {
        type: Number,
        default: null
    },

    status: {
        type: String,
        enum: ["pending", "allocated", "inactive"],
        default: "pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Student", studentSchema);