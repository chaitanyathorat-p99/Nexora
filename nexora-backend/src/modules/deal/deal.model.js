import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    dealType: {
      type: String,
      required: true,
      enum: ["New", "Expansion", "Profession Services"],
    },

    dealStages: {
      type: String,
      required: true,
      enum: ["New", "Qualification", "Discovery", "Demo", "Negotiation", "Won", "Lost"],
    },

    currencyType: {
      type: String,
      required: true,
      enum: [
        "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY",
        "INR", "SGD", "NZD", "HKD", "SEK", "KRW", "NOK", "MXN",
        "PHP", "IDR", "BRL",
      ],
    },

    dealValue: {
      type: Number,
      required: true,
      default: 0,
    },

    product: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String },
        productType: { type: String },
        priceType: { type: String },
        price: { type: Number },
        discount: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
        total: { type: Number },
      },
    ],

    totalWithDiscount: {
      type: Number,
      default: 0,
    },

    dynamicFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Ownership tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;
