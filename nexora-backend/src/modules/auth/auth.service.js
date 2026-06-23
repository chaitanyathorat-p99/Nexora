import User from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isHigherRole } from "../../config/permissions.js";

// ─── Allowed role assignments per actor role ───────────────────────────────────
const CREATABLE_ROLES = {
  super_admin: ["super_admin", "admin", "employee"],
  admin: ["employee"],
  // employees cannot create users at all — enforced at route level
};

/**
 * REGISTER USER
 *
 * Public registration always defaults to "employee".
 * Privileged creation (admin/super_admin) must be done through
 * the protected /api/users route, not this public endpoint.
 */
export const registerUser = async (userData) => {
  const {
    username,
    fullName,
    email,
    password,
    department = "",
    phone = "",
    isActive = true,
  } = userData;

  if (!username) {
    throw new Error("Username is required");
  }

  const normalizedUsername = username.toLowerCase().trim();
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existingUser) {
    if (existingUser.email === normalizedEmail) {
      throw new Error("User already exists with this email");
    }
    throw new Error("Username is already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Public registration is ALWAYS employee — role from body is ignored
  const user = await User.create({
    username: normalizedUsername,
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "employee",
    department,
    phone,
    isActive,
  });

  return {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    department: user.department,
    phone: user.phone,
    isActive: user.isActive,
  };
};

/**
 * CREATE USER (privileged — called by admin/super_admin)
 *
 * @param {object} userData   User fields including desired role
 * @param {object} actor      The authenticated user performing the action
 */
export const createUserByAdmin = async (userData, actor) => {
  const {
    username,
    fullName,
    email,
    password,
    role,
    department = "",
    phone = "",
    isActive = true,
  } = userData;

  if (!username) throw new Error("Username is required");
  if (!role) throw new Error("Role is required");

  // Validate that the actor is allowed to assign this role
  const allowedRoles = CREATABLE_ROLES[actor.role] || [];
  if (!allowedRoles.includes(role)) {
    throw new Error(
      `Your role (${actor.role}) is not permitted to create a user with role "${role}"`
    );
  }

  const normalizedUsername = username.toLowerCase().trim();
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existingUser) {
    if (existingUser.email === normalizedEmail) {
      throw new Error("User already exists with this email");
    }
    throw new Error("Username is already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: normalizedUsername,
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    department,
    phone,
    isActive,
  });

  return {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    department: user.department,
    phone: user.phone,
    isActive: user.isActive,
  };
};

/**
 * LOGIN USER
 */
export const loginUser = async (loginIdentifier, password) => {
  const identifier = loginIdentifier.toLowerCase().trim();

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    throw new Error("Invalid username/email or password");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  };
};
