import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ValidUser from "../models/ValidUser.js"; // ✅ correct model

const router = express.Router();

// ============================
// 🔹 REGISTER simple user
// ============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check by username (not email)
    const existingUser = await ValidUser.findOne({ username: name });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new ValidUser({
      username: name,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.username,
        role: "user",
      },
    });
  } catch (err) {
    console.error("Error in user registration:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ============================
// 🔹 LOGIN simple user
// ============================
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required" });

    const user = await ValidUser.findOne({ username: name });
    if (!user) return res.status(400).json({ message: "Invalid username" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.username,
        role: "user",
      },
    });
  } catch (err) {
    console.error("Error in user login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
