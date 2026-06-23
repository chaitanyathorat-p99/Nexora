import * as UserRepo from "./user.repository.js";
import { createUserByAdmin } from "../auth/auth.service.js";
import ApiError from "../../utils/ApiError.js";
import { isHigherRole } from "../../config/permissions.js";
import bcrypt from "bcrypt";

/**
 * List users with role-based visibility:
 *   - super_admin: sees everyone
 *   - admin: sees employees only
 *   - employee: not allowed (enforced at route level)
 */
export const listUsers = async (actor, query = {}) => {
  const { page = 1, limit = 20, search, role, isActive, userType } = query;

  const filter = {};

  // Admins can only see employees
  if (actor.role === "admin") {
    filter.role = "employee";
  } else if (role) {
    filter.role = role;
  }

  if (isActive !== undefined && isActive !== "") {
    filter.isActive = isActive === "true" || isActive === true;
  }

  // Filter by userType (System / Client)
  if (userType) {
    filter.userType = userType;
  }

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageSize = Math.min(100, parseInt(limit) || 20);
  const skip = (pageNum - 1) * pageSize;

  const [users, totalCount] = await Promise.all([
    UserRepo.findAll(filter, skip, pageSize),
    UserRepo.countAll(filter),
  ]);

  return { users, totalCount, page: pageNum, pageSize };
};

/**
 * Get a single user by ID.
 * Admins cannot view super_admin profiles.
 */
export const getUserById = async (actor, targetId) => {
  const user = await UserRepo.findById(targetId);
  if (!user) throw new ApiError(404, "User not found");

  if (actor.role === "admin" && user.role === "super_admin") {
    throw new ApiError(403, "Access denied");
  }

  return user;
};

/**
 * Privileged user creation — delegates to auth service for hashing/validation.
 */
export const createUser = async (actor, userData) => {
  return await createUserByAdmin(userData, actor);
};

/**
 * Update a user's profile.
 * Rules:
 *   - super_admin: can update anyone
 *   - admin: can update employees only, cannot change role to non-employee
 *   - employee: can only update their own non-sensitive fields
 */
export const updateUser = async (actor, targetId, updateData) => {
  const target = await UserRepo.findById(targetId);
  if (!target) throw new ApiError(404, "User not found");

  // Prevent admin from touching super_admin accounts
  if (actor.role === "admin" && target.role === "super_admin") {
    throw new ApiError(403, "Admins cannot modify super_admin accounts");
  }

  // Prevent employees from modifying other users
  if (actor.role === "employee" && actor._id.toString() !== targetId) {
    throw new ApiError(403, "Employees can only update their own profile");
  }

  // Prevent role escalation
  if (updateData.role) {
    if (!isHigherRole(actor.role, updateData.role) && actor.role !== "super_admin") {
      throw new ApiError(
        403,
        `Your role (${actor.role}) cannot assign the role "${updateData.role}"`
      );
    }
    // Admin can only set employee role
    if (actor.role === "admin" && updateData.role !== "employee") {
      throw new ApiError(403, "Admins can only assign the 'employee' role");
    }
  }

  // Employees cannot change their own role, isActive, or department
  if (actor.role === "employee") {
    delete updateData.role;
    delete updateData.isActive;
    delete updateData.department;
  }

  // Hash password if being updated
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  return await UserRepo.updateById(targetId, updateData);
};

/**
 * Deactivate (soft-delete) a user account.
 * Only super_admin can deactivate admins.
 */
export const deactivateUser = async (actor, targetId) => {
  if (actor._id.toString() === targetId) {
    throw new ApiError(403, "You cannot deactivate your own account");
  }

  const target = await UserRepo.findById(targetId);
  if (!target) throw new ApiError(404, "User not found");

  if (actor.role === "admin" && target.role !== "employee") {
    throw new ApiError(403, "Admins can only deactivate employee accounts");
  }

  return await UserRepo.updateById(targetId, { isActive: false });
};

/**
 * Reactivate a user account (super_admin only — enforced at route level).
 */
export const reactivateUser = async (targetId) => {
  const target = await UserRepo.findById(targetId);
  if (!target) throw new ApiError(404, "User not found");
  return await UserRepo.updateById(targetId, { isActive: true });
};

/**
 * Hard-delete a user (super_admin only — enforced at route level).
 */
export const deleteUser = async (actor, targetId) => {
  if (actor._id.toString() === targetId) {
    throw new ApiError(403, "You cannot delete your own account");
  }

  const target = await UserRepo.findById(targetId);
  if (!target) throw new ApiError(404, "User not found");

  return await UserRepo.deleteById(targetId);
};

/**
 * Reset a user's password (admin/super_admin only).
 */
export const resetUserPassword = async (actor, targetId, newPassword) => {
  const target = await UserRepo.findById(targetId);
  if (!target) throw new ApiError(404, "User not found");

  if (actor.role === "admin" && target.role !== "employee") {
    throw new ApiError(403, "Admins can only reset employee passwords");
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  return await UserRepo.updateById(targetId, { password: hashed });
};
