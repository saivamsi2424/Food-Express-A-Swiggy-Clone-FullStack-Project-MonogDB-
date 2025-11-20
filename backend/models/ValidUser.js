import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const validUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ⭐ FAVOURITES ADDED HERE
  favourites: [
    {
      dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
      name: String,
      price: Number,
      image: String,
      hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }
    }
  ]
});

// hash password before saving
validUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const ValidUser = mongoose.model("ValidUser", validUserSchema);
export default ValidUser;
