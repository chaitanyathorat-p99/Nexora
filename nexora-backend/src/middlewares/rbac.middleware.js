/**
 * RBAC Middleware Suite
 *
 * Provides composable middleware factories:
 *   - authorize(permission)            — checks centralized permission registry
 *   - authorizeRole(...roles)          — checks role membership
 *   - authorizeOwnership(Model, field) — validates record ownership before mutation
 *   - preventRoleEscalation            — blocks assigning roles ≥ own role
 *   - preventSelfAction                — blocks acting on own account
 *   - authorizeSuperAdminOnly          — restricts to super_admin (audit logs, RBAC config, security logs)
 */

import ApiError from "../utils/ApiError.js";
import { hasPermission } from "../config/permissions.js";

// ─── 1. Permission-based authorization ────────────────────────────────────────
/**
 * Middleware that checks whether the authenticated user's role
 * has the given permission in the centralized registry.
 *
 * Usage: router.delete("/:id", protect, authorize("lead:delete"), handler)
 *
 * @param {string} permission  e.g. "lead:delete"
 */
export const authorize = (permission) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication required"));
  }

  const { role } = req.user;

  if (!hasPermission(role, permission)) {
    return next(
      new ApiError(
        403,
        `Access denied. Required permission: "${permission}"`
      )
    );
  }

  next();
};

// ─── 2. Role-based authorization ──────────────────────────────────────────────
/**
 * Middleware that checks whether the authenticated user has one of the
 * specified roles.
 *
 * Usage: router.get("/", protect, authorizeRole("super_admin", "admin"), handler)
 *
 * @param {...string} roles  Allowed roles
 */
export const authorizeRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication required"));
  }

  if (!roles.includes(req.user.role)) {
    return next(
      new ApiError(
        403,
        `Access denied. Required role(s): ${roles.join(", ")}`
      )
    );
  }

  next();
};

// ─── 3. Ownership-based authorization ─────────────────────────────────────────
/**
 * Middleware factory that fetches a record by req.params.id and verifies
 * that the authenticated user is either:
 *   a) an admin/super_admin (bypass), OR
 *   b) the owner of the record (field matches req.user._id)
 *
 * The fetched document is attached to req.resource so the controller
 * doesn't need to re-query.
 *
 * Usage:
 *   router.put("/:id", protect, authorizeOwnership(Lead, "createdBy"), handler)
 *   router.put("/:id", protect, authorizeOwnership(Task, ["assignedTo", "createdBy"]), handler)
 *
 * @param {import("mongoose").Model} Model  Mongoose model to query
 * @param {string|string[]} ownerFields     Field(s) on the document to check
 */
export const authorizeOwnership = (Model, ownerFields) => async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    // Admins and super admins bypass ownership checks
    if (["super_admin", "admin"].includes(req.user.role)) {
      return next();
    }

    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new ApiError(404, "Resource not found"));
    }

    // Attach to request so downstream handlers can reuse it
    req.resource = doc;

    const userId = req.user._id.toString();
    const fields = Array.isArray(ownerFields) ? ownerFields : [ownerFields];

    const isOwner = fields.some((field) => {
      const value = doc[field];
      if (!value) return false;

      // Handle arrays (e.g. task.assignedTo is an array of ObjectIds)
      if (Array.isArray(value)) {
        return value.some((v) => v?.toString() === userId);
      }

      return value.toString() === userId;
    });

    if (!isOwner) {
      return next(
        new ApiError(403, "Access denied. You do not own this resource.")
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ─── 4. Role escalation guard ─────────────────────────────────────────────────
/**
 * Prevents a user from assigning a role equal to or higher than their own.
 * Reads the target role from req.body.role.
 *
 * Usage: router.post("/", protect, preventRoleEscalation, handler)
 */
export const preventRoleEscalation = (req, res, next) => {
  const { role: targetRole } = req.body;

  if (!targetRole) return next(); // No role change requested

  const actorRole = req.user?.role;

  // Super admin can assign any role
  if (actorRole === "super_admin") return next();

  // Admin can only create employees
  if (actorRole === "admin") {
    if (targetRole !== "employee") {
      return next(
        new ApiError(403, "Admins can only create users with the 'employee' role")
      );
    }
    return next();
  }

  // Employees cannot assign any role
  return next(new ApiError(403, "You are not authorized to assign roles"));
};

// ─── 5. Self-protection guard ─────────────────────────────────────────────────
/**
 * Prevents a user from deleting or demoting their own account.
 * Compares req.params.id against req.user._id.
 *
 * Usage: router.delete("/:id", protect, preventSelfAction, handler)
 */
export const preventSelfAction = (req, res, next) => {
  const targetId = req.params.id;
  const selfId = req.user?._id?.toString();

  if (targetId === selfId) {
    return next(
      new ApiError(403, "You cannot perform this action on your own account")
    );
  }

  next();
};

// ─── 6. Super-admin-only guard ────────────────────────────────────────────────
/**
 * Restricts access to super_admin role only.
 * Used for: Audit Logs, Security Logs, RBAC Config.
 *
 * Usage: router.get("/audit-logs", protect, authorizeSuperAdminOnly, handler)
 */
export const authorizeSuperAdminOnly = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication required"));
  }

  if (req.user.role !== "super_admin") {
    return next(
      new ApiError(403, "Access denied. This resource is restricted to super admins.")
    );
  }

  next();
};
