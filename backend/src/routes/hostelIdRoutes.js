const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
    generateHostelIds,
    getAllHostelIds,
    getAvailableHostelIds
} = require("../controllers/hostelIdController");


// All routes require admin authentication
router.use(protect, authorizeRoles("admin"));

// Generate Hostel IDs
router.post("/generate", generateHostelIds);

// Get all Hostel IDs
router.get("/", getAllHostelIds);

// Get available Hostel IDs
router.get("/available", getAvailableHostelIds);


module.exports = router;