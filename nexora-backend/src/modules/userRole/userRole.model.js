import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    modelName: { type: String, required: true },
    read:    { type: Boolean, default: false },
    write:   { type: Boolean, default: false },
    create:  { type: Boolean, default: false },
    update:  { type: Boolean, default: false },
    delete:  { type: Boolean, default: false },
    special: { type: Boolean, default: false },
  },
  { _id: false }
);

const userRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [permissionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const UserRole = mongoose.model("UserRole", userRoleSchema);

export default UserRole;
