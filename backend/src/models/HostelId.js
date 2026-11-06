const mongoose = require("mongoose");

const hostelIdSchema = new mongoose.Schema({

    hostelId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    isRegistered: {
        type: Boolean,
        default: false
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("HostelId", hostelIdSchema);