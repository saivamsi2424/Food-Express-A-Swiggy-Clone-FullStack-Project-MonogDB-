import express from "express";
import Hotel from "../models/Hotel.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:hotelId/dishitems/:dishId", protect, async (req, res) => {
  try {
    const { hotelId, dishId } = req.params;
    const { name, price, image } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const dish = hotel.dishitems.id(dishId);
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    if (name) dish.name = name;
    if (price) dish.price = price;
    if (image) dish.image = image;

    await hotel.save();

    res.status(200).json({
      message: "Dish updated successfully",
      dish,
    });
  } catch (error) {
    console.error("Error updating dish:", error);
    res.status(500).json({ message: "Failed to update dish", error: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { hotelName, imageUrl } = req.body;
    const vendorId = req.user._id;

    const exists = await Hotel.findOne({ hotelName });
    if (exists) {
      return res.status(400).json({ message: "Hotel already exists" });
    }

    const newHotel = new Hotel({
      hotelName,
      imageUrl: imageUrl || "",
      vendorId,
      dishitems: [],
    });

    const savedHotel = await newHotel.save();
    res.status(201).json({ hotel: savedHotel });
  } catch (err) {
    console.error("Error creating hotel:", err);
    res.status(500).json({ message: "Error creating hotel" });
  }
});

/* ----------------------------------------------------------
   GET ALL HOTELS  (User side)
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("vendorId", "name email");
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

/* ----------------------------------------------------------
   GET VENDOR’S HOTELS
----------------------------------------------------------- */
router.get("/my-hotels", protect, async (req, res) => {
  try {
    const vendorHotels = await Hotel.find({ vendorId: req.user._id });
    res.json(vendorHotels);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vendor hotels" });
  }
});

/* ----------------------------------------------------------
   ADD NEW DISH TO A HOTEL
----------------------------------------------------------- */
router.post("/:hotelName/dishitems", protect, async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const hotel = await Hotel.findOne({ hotelName: req.params.hotelName });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // only vendor who owns the hotel can add dish
    if (hotel.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newDish = {
      name,
      price,
      image: image || "",
      availability: "Available",
    };

    hotel.dishitems.push(newDish);
    await hotel.save();

    res.status(201).json({ hotel });
  } catch (err) {
    console.error("Error adding dish:", err);
    res.status(500).json({ message: "Error adding dish" });
  }
});

router.put("/:hotelId/dishitems/:dishId/availability", protect, async (req, res) => {
  try {
    const { availability } = req.body;
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const dish = hotel.dishitems.id(req.params.dishId);
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    dish.availability = availability;
    await hotel.save();

    res.json({ message: "Availability updated", hotel });
  } catch (err) {
    res.status(500).json({ message: "Error updating availability" });
  }
});

export default router;
