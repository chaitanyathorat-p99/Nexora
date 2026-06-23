import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Frontend sends "dueDate" — stored as dueDate
    dueDate: {
      type: Date,
      default: null,
    },
    // Frontend sends "desc" — stored as desc
    desc: {
      type: String,
      default: "",
      trim: true,
    },
    meetingType: {
      type: String,
      default: "",
      trim: true,
    },
    // Frontend sends "platForm" (capital F)
    platForm: {
      type: String,
      default: "",
      trim: true,
    },
    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },
    outcome: {
      type: String,
      default: "",
      trim: true,
    },
    meetingNote: {
      type: String,
      default: "",
      trim: true,
    },
    meetingDone: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    dynamicFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
