const express = require("express");

const router = express.Router();

const {
    registerStudent,
    loginStudent
} = require("../controllers/authController");

// Student registration
router.post("/register", registerStudent);

// Student login
router.post("/login", loginStudent);

module.exports = router;