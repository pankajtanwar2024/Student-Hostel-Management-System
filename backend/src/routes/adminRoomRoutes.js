const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
    assignRoomToStudent,
    cancelStudentAllocation
} = require("../controllers/roomManagementController");


// Protect all routes
router.use(protect, authorizeRoles("admin"));


// Allocate or change student room
router.patch(
    "/students/:studentId/room",
    assignRoomToStudent
);


// Cancel student room allocation
router.delete(
    "/students/:studentId/room",
    cancelStudentAllocation
);


module.exports = router;