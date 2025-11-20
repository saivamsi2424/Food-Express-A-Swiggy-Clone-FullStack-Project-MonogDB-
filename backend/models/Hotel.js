import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String },
  availability: { 
    type: String, 
    enum: ["Available", "Not Available"], 
    default: "Available" // ✅ NEW
  },
});

const hotelSchema = new mongoose.Schema(
  {
    hotelName: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    dishitems: [dishSchema],
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
