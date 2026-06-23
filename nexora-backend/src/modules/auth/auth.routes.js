import express from "express";
import { register, login, logout, getProfile } from "./auth.controller.js";
import { validateRegister, validateLogin } from "./auth.validation.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Public — always creates an employee account.
 * Role in body is stripped by the service layer.
 */
router.post("/register", validateRegister, register);

/**
 * POST /api/auth/login
 */
router.post("/login", validateLogin, login);

/**
 * POST /api/auth/logout
 */
router.post("/logout", protect, logout);

/**
 * GET /api/auth/profile
 */
router.get("/profile", protect, getProfile);

/**
 * GET /api/auth/admin-only  (kept for backward compat / testing)
 */
router.get(
  "/admin-only",
  protect,
  authorizeRole("admin", "super_admin"),
  (req, res) => {
    res.json({ success: true, message: "Welcome Admin", user: req.user });
  }
);

export default router;
