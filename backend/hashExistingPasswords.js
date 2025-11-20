import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import ValidUser from "./models/ValidUser.js";

dotenv.config();

const convertPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const users = await ValidUser.find();

    for (const user of users) {
      // skip if already hashed
      if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
        console.log(`Skipping ${user.username} — already hashed`);
        continue;
      }

      const hashed = await bcrypt.hash(user.password, 10);
      user.password = hashed;
      await user.save();
      console.log(`Hashed password for ${user.username}`);
    }

    console.log("✅ Conversion complete");
    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

convertPasswords();
