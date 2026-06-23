import express from "express";
import * as callController from "./call.controller.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorize, authorizeRole } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(authorize("call:read"), callController.getAllCalls)
  .post(authorize("call:create"), callController.createCall);

router
  .route("/:id")
  .get(authorize("call:read"), callController.getCallById)
  .put(authorize("call:update"), callController.updateCall)
  .delete(authorizeRole("super_admin", "admin"), callController.deleteCall);

export default router;
