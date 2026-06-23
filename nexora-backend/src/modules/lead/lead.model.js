import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    leadValue: {
      type: Number,
      default: 0,
    },

    leadWeight: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Cold",
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    typeOfBuyer: {
      type: String,
      trim: true,
    },

    industryType: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Ownership tracking
    createdBy: {
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

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
