import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import validUserRoutes from "./routes/validUserRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import searchRoutes from "./routes/searchRoutes.js"; 
import orderRoutes from "./routes/orderRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ---------- CORS FIX ----------
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS Not Allowed: " + origin), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// ---------- END CORS FIX ----------

app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/validusers", validUserRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favourites", favouriteRoutes);

app.get("/", (req, res) => {
  res.send("✅ API is running successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
