import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["super_admin", "admin", "employee"],
      default: "employee"
    },

    department: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },

    userType: {
      type: String,
      enum: ["System", "Client"],
      default: "System"
    },

    mobileNo: {
      type: String,
      default: ""
    },

    profilePic: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Virtual "name" field so populated references expose .name consistently
userSchema.virtual("name").get(function () {
  return this.fullName || this.username || "";
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;