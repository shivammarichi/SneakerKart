import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    role: { type: Number, default: 0 }, // 0 for user, 1 for admin
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
