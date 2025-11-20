import express from "express";
import protect from "../middleware/authMiddleware.js";
import ValidUser from "../models/ValidUser.js";

const router = express.Router();

/* ===========================================
   ADD TO FAVOURITES
=========================================== */
router.post("/add", protect, async (req, res) => {
  try {
    const { dish } = req.body;
    const user = await ValidUser.findById(req.user._id);

    const exists = user.favourites.find(
      (f) => f.dishId.toString() === dish._id
    );

    if (exists) {
      return res.status(400).json({ message: "Already in favourites" });
    }

    user.favourites.push({
      dishId: dish._id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      hotelId: dish.hotelId
    });

    await user.save();

    res.json({ message: "Added to favourites ❤️" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================================
    REMOVE FAVOURITE
=========================================== */
router.delete("/remove/:dishId", protect, async (req, res) => {
  try {
    const user = await ValidUser.findById(req.user._id);

    user.favourites = user.favourites.filter(
      (f) => f.dishId.toString() !== req.params.dishId
    );

    await user.save();

    res.json({ message: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================================
   GET ALL FAVOURITES
=========================================== */
router.get("/", protect, async (req, res) => {
  try {
    const user = await ValidUser.findById(req.user._id);
    res.json(user.favourites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
