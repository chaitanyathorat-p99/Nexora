import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketOptions,
} from "./ticket.controller.js";
import { validateTicketData } from "./ticket.validation.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorize, authorizeRole } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.get("/options", protect, getTicketOptions);

router
  .route("/")
  .get(protect, authorize("ticket:read"), getTickets)
  .post(protect, authorize("ticket:create"), validateTicketData, createTicket);

router
  .route("/:id")
  .get(protect, authorize("ticket:read"), getTicketById)
  .put(protect, authorize("ticket:update"), validateTicketData, updateTicket)
  .delete(protect, authorizeRole("super_admin", "admin"), deleteTicket);

export default router;
