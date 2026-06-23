import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/rbac.middleware.js";
import {
  getAllUserRoles,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
} from "./userRole.controller.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAllUserRoles)
  .post(authorizeRole("super_admin", "admin"), createUserRole);

router.route("/:id")
  .get(getUserRoleById)
  .patch(authorizeRole("super_admin", "admin"), updateUserRole)
  .delete(authorizeRole("super_admin"), deleteUserRole);

export default router;
