import express from "express";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// ✅ GET /api/search?query=keyword
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(query, "i"); // case-insensitive match

    // 🔍 Find hotels where hotelName matches OR any dish name matches
    const hotels = await Hotel.find({
      $or: [
        { hotelName: regex },
        { "dishitems.name": regex },
      ],
    });

    // 🧩 Separate matching dishes
    const dishes = [];
    hotels.forEach((hotel) => {
      hotel.dishitems.forEach((dish) => {
        if (regex.test(dish.name)) {
          dishes.push({
            ...dish.toObject(),
            hotel: {
              _id: hotel._id,
              hotelName: hotel.hotelName,
              imageUrl: hotel.imageUrl,
            },
          });
        }
      });
    });

    res.json({
      query,
      hotelsCount: hotels.length,
      dishesCount: dishes.length,
      hotels,
      dishes,
    });
  } catch (error) {
    console.error("❌ Search Error:", error);
    res.status(500).json({ message: "Server error during search" });
  }
});

export default router;
