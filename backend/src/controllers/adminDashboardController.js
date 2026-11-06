const Student = require("../models/Student");
const Room = require("../models/Room");
const HostelId = require("../models/HostelId");

// =================================
// ADMIN DASHBOARD STATISTICS
// =================================

const getDashboardStats = async (req, res) => {

    try {

        // Execute database queries simultaneously
        const [
            totalStudents,
            totalRooms,
            totalHostelIds,
            availableHostelIds,
            roomStats
        ] = await Promise.all([

            Student.countDocuments(),

            Room.countDocuments(),

            HostelId.countDocuments(),

            HostelId.countDocuments({
                isRegistered: false
            }),

            Room.aggregate([

                {
                    $group: {

                        _id: null,

                        totalCapacity: {
                            $sum: "$capacity"
                        },

                        occupiedBeds: {
                            $sum: {
                                $size: "$occupants"
                            }
                        }

                    }

                }

            ])

        ]);

        const totalCapacity = roomStats[0]?.totalCapacity || 0;

        const occupiedBeds = roomStats[0]?.occupiedBeds || 0;

        const availableBeds = totalCapacity - occupiedBeds;

        const allocatedStudents = await Student.countDocuments({
            status: "allocated"
        });

        return res.status(200).json({

            message: "Dashboard statistics retrieved successfully",

            statistics: {

                totalStudents,

                totalRooms,

                totalCapacity,

                occupiedBeds,

                availableBeds,

                allocatedStudents,

                unallocatedStudents: totalStudents - allocatedStudents,

                totalHostelIds,

                availableHostelIds

            }

        });

    } catch (error) {

        console.error("Dashboard Error:", error.message);

        return res.status(500).json({

            message: "Failed to retrieve dashboard statistics"

        });

    }

};


// =================================
// FLOOR-WISE STATISTICS
// =================================

const getFloorStats = async (req, res) => {

    try {

        const floorStats = await Room.aggregate([

            {

                $group: {

                    _id: "$floor",

                    totalRooms: {
                        $sum: 1
                    },

                    totalCapacity: {
                        $sum: "$capacity"
                    },

                    occupiedBeds: {
                        $sum: {
                            $size: "$occupants"
                        }
                    }

                }

            },

            {

                $project: {

                    _id: 0,

                    floor: "$_id",

                    totalRooms: 1,

                    totalCapacity: 1,

                    occupiedBeds: 1,

                    availableBeds: {
                        $subtract: [
                            "$totalCapacity",
                            "$occupiedBeds"
                        ]
                    }

                }

            },

            {
                $sort: {
                    floor: 1
                }
            }

        ]);

        return res.status(200).json({

            message: "Floor statistics retrieved successfully",

            floors: floorStats

        });

    } catch (error) {

        console.error("Floor Stats Error:", error.message);

        return res.status(500).json({

            message: "Failed to retrieve floor statistics"

        });

    }

};


module.exports = {

    getDashboardStats,

    getFloorStats

};