import express from "express";
import * as LeadController from "./lead.controller.js";
import protect from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { authorize, authorizeRole } from "../../middlewares/rbac.middleware.js";
import { createLeadSchema } from "./lead.validation.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(
    authorize("lead:read"),        // super_admin/admin: all; employee: own (filtered in service)
    LeadController.handleGetLeads
  )
  .post(
    authorize("lead:create"),
    validate(createLeadSchema),
    LeadController.handleCreateLead
  );

router
  .route("/:id")
  .get(
    authorize("lead:read"),        // ownership check in service
    LeadController.handleGetLeadById
  )
  .put(
    authorize("lead:update"),      // ownership check in service
    LeadController.handleUpdateLead
  )
  .delete(
    authorizeRole("super_admin", "admin"),  // employees cannot delete leads
    LeadController.handleDeleteLead
  );

export default router;
