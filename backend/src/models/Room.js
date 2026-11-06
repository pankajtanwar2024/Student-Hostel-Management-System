const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({

    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },

    floor: {
        type: Number,
        required: true
    },

    capacity: {
        type: Number,
        default: 5
    },

    occupants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }
    ]

}, {
    timestamps: true
});


roomSchema.virtual("availableBeds").get(function () {
    const occupantsCount = this.occupants?.length ?? 0;
    return this.capacity - occupantsCount;
});

roomSchema.virtual("status").get(function () {
    const occupantsCount = this.occupants?.length ?? 0;
    return occupantsCount >= this.capacity
        ? "full"
        : "available";
});


roomSchema.set("toJSON", { virtuals: true });

roomSchema.set("toObject", { virtuals: true });


module.exports = mongoose.model("Room", roomSchema);