import mongoose from "mongoose";
import payments from "./paymentModel.js";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    paymentstatus: {
      type: String,
      default: "No",
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    totalcost: {
      type: String,
    },
    status: {
      type: String,
      default: "Not Process",
    },
    mplan: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
orderSchema.post("findOneAndUpdate", async function (doc) {
  // Access the updated document
  const updatedOrder = await this.model.findOne(this.getFilter()).exec();

  // Find the corresponding Payment document based on the orderId
  const payment = await payments.findOne({ orderId: updatedOrder._id });

  // If a payment document is found, update its paymentstatus field
  if (payment) {
    payment.paymentstatus = updatedOrder.paymentstatus;
    await payment.save();
  }
});

export default mongoose.model("Order", orderSchema);
