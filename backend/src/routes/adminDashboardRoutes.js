const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDashboardStats,
    getFloorStats
} = require("../controllers/adminDashboardController");

const {
    getAllStudents,
    getStudentById
} = require("../controllers/adminStudentController");


// All routes require admin authentication
router.use(protect, authorizeRoles("admin"));


// Dashboard statistics
router.get("/stats", getDashboardStats);


// Floor-wise statistics
router.get("/floors", getFloorStats);


// Student management
router.get("/students", getAllStudents);


// Individual student details
router.get("/students/:id", getStudentById);


module.exports = router;