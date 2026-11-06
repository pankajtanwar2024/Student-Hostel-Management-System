const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const generateRooms = require("./utils/generateRooms");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hostelIdRoutes = require("./routes/hostelIdRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const roomRoutes = require("./routes/roomRoutes");
const adminRoomRoutes = require("./routes/adminRoomRoutes");

dotenv.config();

const app = express();

app.use(express.json());

// app.use(cors({
//     origin: process.env.CLIENT_URL
// }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.90.113:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hostel-ids", hostelIdRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoomRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Student Hostel Management System API is Running!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();

        await generateRooms();

        // app.listen(PORT, () => {
        //     console.log(`Server running on http://localhost:${PORT}`);
        // });

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error(error.message);

        process.exit(1);

    }

};

startServer();