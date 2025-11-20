import express from "express";
import protect from "../middleware/authMiddleware.js";
import Review from "../models/Review.js";

const router = express.Router();

// GET reviews of a dish
router.get("/:dishId", async (req, res) => {
  try {
    const reviews = await Review.find({ dishId: req.params.dishId })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// POST a new review
router.post("/", protect, async (req, res) => {
  try {
    const { userName, reviewText, dishId } = req.body;

    if (!reviewText || !dishId)
      return res.status(400).json({ message: "Missing fields" });

    const newReview = await Review.create({
      userName,
      reviewText,
      dishId
    });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: "Error adding review" });
  }
});

export default router;
