import express from "express";
import protect from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// 🧑‍🍳 User places an order
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    console.log("🟢 Incoming Order Request:");
    console.log("items:", items);
    console.log("totalAmount:", totalAmount);
    console.log("user:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized - no valid user" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // check if all items have hotelId
    const invalidItem = items.find((it) => !it.hotelId);
    if (invalidItem) {
      return res.status(400).json({
        message: `Missing hotelId for dish: ${invalidItem.name}`,
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
    });

    console.log("✅ Order created successfully:", order._id);

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({
      message: "Server error while placing order",
      error: err.message,
      stack: err.stack,
    });
  }
});


// 👤 Get all orders for a user
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
});

// 🍳 Vendor — Get all orders for their dishes
router.get("/vendor-orders", protect, async (req, res) => {
  try {
    const vendorHotels = await Hotel.find({ vendorId: req.user._id }).select("_id");
    const vendorHotelIds = vendorHotels.map((h) => h._id);

    const orders = await Order.find({
      "items.hotelId": { $in: vendorHotelIds },
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching vendor orders:", err);
    res.status(500).json({ message: "Server error while fetching vendor orders" });
  }
});

// 🧾 Vendor — Update order status
router.put("/:orderId/status", protect, async (req, res) => {
  try {
    console.log("Incoming order request:", req.body);
    console.log("Authenticated user:", req.user);
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error while updating order" });
  }
});

export default router;
