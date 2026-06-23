import express from "express";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getMeetingOptions,
} from "./meeting.controller.js";
import { validateMeetingData } from "./meeting.validation.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorize, authorizeRole } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/options", getMeetingOptions);

router
  .route("/")
  .get(authorize("meeting:read"), getMeetings)
  .post(authorize("meeting:create"), validateMeetingData, createMeeting);

router
  .route("/:id")
  .get(authorize("meeting:read"), getMeetingById)
  .put(authorize("meeting:update"), validateMeetingData, updateMeeting)
  .delete(authorizeRole("super_admin", "admin"), deleteMeeting);

export default router;
