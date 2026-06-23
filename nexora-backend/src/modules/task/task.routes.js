import express from "express";
import * as TaskController from "./task.controller.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorize, authorizeRole } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(
    authorizeRole("super_admin", "admin"),  // only admins create/assign tasks
    TaskController.handleCreateTask
  )
  .get(
    authorize("task:read"),                 // row-level filtering in service
    TaskController.handleGetTasks
  );

router
  .route("/:id")
  .get(
    authorize("task:read"),                 // ownership check in service
    TaskController.handleGetTaskById
  )
  .put(
    authorize("task:update"),               // ownership check in service
    TaskController.handleUpdateTask
  )
  .delete(
    authorizeRole("super_admin", "admin"),  // employees cannot delete tasks
    TaskController.handleDeleteTask
  );

// Stage update — employees can update stage of their own tasks
router.patch(
  "/:id/stage",
  authorize("task:update"),
  TaskController.handleUpdateTaskStage
);

// Subtask toggle — employees can toggle subtasks on their own tasks
// Both "task:update_own" (employee) and "task:update" (admin) cover this
router.patch(
  "/:taskId/subtask/:subtaskId/toggle",
  authorize("task:update"),
  TaskController.handleToggleSubtask
);

export default router;
