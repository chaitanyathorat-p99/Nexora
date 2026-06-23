import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import {
  authorize,
  authorizeRole,
  preventSelfAction,
} from "../../middlewares/rbac.middleware.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  deleteUser,
  resetPassword,
  uploadAvatar,
} from "./user.controller.js";
import { validateCreateUser } from "../auth/auth.validation.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../../middlewares/upload.middleware.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

/**
 * GET  /api/users/me     — any authenticated user can read their own profile
 * PUT  /api/users/me     — any authenticated user can update their own profile
 *
 * Must be defined BEFORE /:id to avoid "me" being treated as an ObjectId.
 */
router
  .route("/me")
  .get((req, res, next) => {
    req.params.id = req.user._id.toString();
    next();
  }, getUserById)
  .put((req, res, next) => {
    req.params.id = req.user._id.toString();
    next();
  }, updateUser);

/**
 * POST /api/users/upload-avatar
 * Any authenticated user can upload their own profile picture.
 * Must be defined BEFORE /:id to avoid "upload-avatar" being treated as an ObjectId.
 */
router.post(
  "/upload-avatar",
  uploadAvatarMiddleware,
  uploadAvatar
);

/**
 * GET  /api/users       — super_admin sees all, admin sees employees only
 * POST /api/users       — admin creates employee, super_admin creates any role
 */
router
  .route("/")
  .get(getAllUsers)
  .post(
    authorizeRole("super_admin", "admin"),
    validateCreateUser,
    createUser
  );

/**
 * GET /api/users/:id    — any authenticated user can view a user profile
 * PUT /api/users/:id    — admin updates employees; super_admin updates anyone
 */
router
  .route("/:id")
  .get(getUserById)
  .put(authorizeRole("super_admin", "admin"), updateUser);

/**
 * DELETE /api/users/:id — super_admin only; cannot delete self
 */
router.delete(
  "/:id",
  authorizeRole("super_admin"),
  preventSelfAction,
  deleteUser
);

/**
 * PATCH /api/users/:id/deactivate — admin/super_admin; cannot deactivate self
 */
router.patch(
  "/:id/deactivate",
  authorizeRole("super_admin", "admin"),
  preventSelfAction,
  deactivateUser
);

/**
 * PATCH /api/users/:id/reactivate — super_admin only
 */
router.patch(
  "/:id/reactivate",
  authorizeRole("super_admin"),
  reactivateUser
);

/**
 * PATCH /api/users/:id/reset-password — admin/super_admin only
 */
router.patch(
  "/:id/reset-password",
  authorizeRole("super_admin", "admin"),
  resetPassword
);

export default router;
