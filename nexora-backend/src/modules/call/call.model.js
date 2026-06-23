import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: "",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    callType: {
      type: String,
      enum: ["incoming", "outgoing", "missed"],
      default: "outgoing",
    },
    callDone: {
      type: Boolean,
      default: false,
    },
    outcome: {
      type: String,
      default: "",
    },
    callNote: {
      type: String,
      default: "",
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dynamicFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Call = mongoose.model("Call", callSchema);

export default Call;
