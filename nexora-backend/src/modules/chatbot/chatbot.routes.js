import express from "express";
import { chat, ingestPdf } from "./chatbot.controller.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

/**
 * POST /api/v1/chatbot/chat
 * All authenticated users with chatbot:access permission.
 * (super_admin, admin, employee all qualify per the access matrix)
 */
router.post("/chat", protect, authorize("chatbot:access"), chat);

/**
 * POST /api/v1/chatbot/ingest
 * Upload a PDF to ingest into the vector store.
 * All authenticated users (super_admin, admin, employee).
 */
router.post(
  "/ingest",
  protect,
  authorize("chatbot:access"),
  upload.single("file"),
  ingestPdf
);

export default router;
