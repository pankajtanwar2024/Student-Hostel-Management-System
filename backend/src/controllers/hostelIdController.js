const HostelId = require("../models/HostelId");

const { randomInt } = require("crypto");

// ==========================
// GENERATE HOSTEL IDS
// ==========================

const generateHostelIds = async (req, res) => {

    try {

        const { quantity } = req.body;

        // Validate quantity
        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 100
        ) {

            return res.status(400).json({
                message: "Quantity must be between 1 and 100"
            });

        }

        const year = new Date().getFullYear();

        const generatedIds = [];

        const createdIds = [];

        // Generate unique Hostel IDs
        while (createdIds.length < quantity) {

            const randomNumber = randomInt(100000, 1000000);

            const hostelId = `HST${year}${randomNumber}`;

            if (generatedIds.includes(hostelId)) {
                continue;
            }

            generatedIds.push(hostelId);

            try {

                const newId = await HostelId.create({
                    hostelId
                });

                createdIds.push(newId.hostelId);

            } catch (error) {

                if (error.code !== 11000) {
                    throw error;
                }

                // Retry if an ID already exists
            }

        }

        return res.status(201).json({

            message: "Hostel IDs generated successfully!",

            totalGenerated: createdIds.length,

            hostelIds: createdIds

        });

    } catch (error) {

        console.error("Hostel ID Generation Error:", error.message);

        return res.status(500).json({
            message: "Failed to generate Hostel IDs"
        });

    }

};


// ==========================
// GET ALL HOSTEL IDS
// ==========================

const getAllHostelIds = async (req, res) => {

    try {

        const hostelIds = await HostelId.find()
            .populate("student", "name email universityRollNo")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            total: hostelIds.length,

            hostelIds

        });

    } catch (error) {

        console.error(error.message);

        return res.status(500).json({
            message: "Failed to retrieve Hostel IDs"
        });

    }

};


// ==========================
// GET AVAILABLE HOSTEL IDS
// ==========================

const getAvailableHostelIds = async (req, res) => {

    try {

        const hostelIds = await HostelId.find({
            isRegistered: false
        }).sort({ createdAt: -1 });

        return res.status(200).json({

            total: hostelIds.length,

            hostelIds

        });

    } catch (error) {

        return res.status(500).json({
            message: "Failed to retrieve available Hostel IDs"
        });

    }

};


module.exports = {
    generateHostelIds,
    getAllHostelIds,
    getAvailableHostelIds
};