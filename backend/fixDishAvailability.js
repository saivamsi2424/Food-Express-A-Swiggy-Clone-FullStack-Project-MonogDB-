import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./models/Hotel.js";

dotenv.config();

const fixDishAvailability = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    const hotels = await Hotel.find();
    let updatedCount = 0;

    for (const hotel of hotels) {
      let updated = false;

      hotel.dishitems.forEach((dish) => {
        if (!dish.availability) {
          dish.availability = "Available";
          updated = true;
          updatedCount++;
        }
      });

      if (updated) {
        await hotel.save();
      }
    }

    console.log(`✅ Fixed ${updatedCount} dishes missing availability status.`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error fixing availability:", err);
  }
};

fixDishAvailability();
