const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAllRooms,
    getRoomByNumber
} = require("../controllers/roomController");

const {
    allocateRoom,
    changeStudentRoom
} = require("../controllers/roomAllocationController");

// Authentication required
router.use(protect);

// Get all rooms or filter by floor
router.get(
    "/",
    authorizeRoles("student", "admin"),
    getAllRooms
);

// Get individual room
router.get(
    "/:roomNumber",
    authorizeRoles("student", "admin"),
    getRoomByNumber
);

// Allocate room to student
router.post(
    "/:roomNumber/allocate",
    authorizeRoles("student"),
    allocateRoom
);

// Student changes their allocated room
router.patch(
    "/change",
    authorizeRoles("student"),
    changeStudentRoom
);

module.exports = router;