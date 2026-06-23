import express from "express";
import * as DashboardController from "./dashboard.controller.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

/**
 * GET /api/dashboard/stats
 *
 * super_admin → global analytics  (dashboard:global via wildcard "*")
 * admin       → team analytics    (dashboard:team)
 * employee    → personal metrics  (dashboard:personal, ownership-filtered in repository)
 *
 * We check "dashboard:personal" here — hasPermission() resolves this via the
 * dashboard scope hierarchy, so all three roles pass the gate. The actual
 * data scope is determined inside the repository by getDashboardScope(role).
 */
router.get(
  "/stats",
  protect,
  authorize("dashboard:personal"),   // minimum required scope — all roles satisfy this
  DashboardController.handleGetStats
);

export default router;
