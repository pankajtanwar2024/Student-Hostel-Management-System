const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getStudentProfile
} = require("../controllers/studentController");

// Protected student profile API
router.get(
    "/profile",
    protect,
    authorizeRoles("student"),
    getStudentProfile
);

module.exports = router;