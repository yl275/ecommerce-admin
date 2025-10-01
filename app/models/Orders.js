import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    name: String,
    email: String,
    city: String,
    postalCode: String,
    country: String,
    address: String,
    address2: String,
    paid: Boolean,
    line_items: [Object],
  },
  { timestamps: true },
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;
