import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneralSetting",
      required: true,
    },
    priceType: {
      type: String,
      required: true,
      enum: ["One Time", "Subscription Cycle"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    subscriptionCycle: {
      type: Number,
      default: null,
    },
    billingCycle: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
