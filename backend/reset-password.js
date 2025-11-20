// reset-password.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import ValidUser from "./models/ValidUser.js";

// ✅ Get username and new password from command-line arguments
const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
  console.error("Usage: node reset-password.js <username> <newPassword>");
  process.exit(1);
}

async function main() {
  try {
    // ✅ Connect to the same DB used in your main app
    const MONGO = process.env.MONGO_URL || "mongodb://localhost:27017/FoodExpressDB";
    await mongoose.connect(MONGO);
    console.log("✅ Connected to MongoDB successfully!");

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update password for the given username
    const result = await ValidUser.updateOne(
      { username },
      { $set: { password: hashedPassword } }
    );

    console.log("🔍 Update result:", result);

    if (result.matchedCount === 0) {
      console.log(`⚠️ No user found with username '${username}'.`);
    } else if (result.modifiedCount === 1) {
      console.log(`✅ Password for '${username}' updated successfully!`);
    } else {
      console.log(`ℹ️ Password for '${username}' was already set to this value.`);
    }

    // ✅ Disconnect
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  } catch (error) {
    console.error("Error while resetting password:", error.message);
    process.exit(1);
  }
}

main();
