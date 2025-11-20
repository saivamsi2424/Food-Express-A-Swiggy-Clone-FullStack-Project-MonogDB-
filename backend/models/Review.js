import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  dishId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  reviewText: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Review", reviewSchema);
