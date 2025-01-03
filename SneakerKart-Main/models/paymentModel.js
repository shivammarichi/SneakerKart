import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // payment: {},
    paymentstatus: {
      type: String,
      ref: "Order",
    },
    orderId: {
      type: mongoose.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payments", paymentSchema);
