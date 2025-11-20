import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// 🧩 REGISTER a new vendor
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if vendor already exists
    const existingVendor = await User.findOne({ name });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new User({
      name,
      email,
      password: hashedPassword,
      role: "vendor",
    });

    await newVendor.save();

    const token = generateToken(newVendor._id, newVendor.role, newVendor.name);

    res.status(201).json({
      message: "Vendor registered successfully",
      token,
      user: {
        id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        role: newVendor.role,
      },
    });
  } catch (err) {
    console.error("Error registering vendor:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// 🧩 LOGIN an existing vendor
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const vendor = await User.findOne({ name, role: "vendor" });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(vendor._id, vendor.role, vendor.name);

    res.status(200).json({
      message: "Vendor login successful",
      token,
      user: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
      },
    });
  } catch (err) {
    console.error("Error logging in vendor:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
