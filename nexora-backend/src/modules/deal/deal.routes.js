import express from "express";
import * as DealController from "./deal.controller.js";
import protect from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { authorize, authorizeRole } from "../../middlewares/rbac.middleware.js";
import { createDealSchema } from "./deal.validation.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(
    authorize("deal:create"),
    validate(createDealSchema),
    DealController.handleCreateDeal
  )
  .get(
    authorize("deal:read"),        // row-level filtering in service
    DealController.handleGetDeals
  );

router
  .route("/:id")
  .get(
    authorize("deal:read"),        // ownership check in service
    DealController.handleGetDealByid
  )
  .put(
    authorize("deal:update"),      // ownership check in service
    DealController.handleUpdateDeal
  )
  .delete(
    authorizeRole("super_admin", "admin"),  // employees cannot delete deals
    DealController.handleDeleteDeal
  );

router.route("/detail/:id").get(
  authorize("deal:read"),
  DealController.handleGetDealByid
);

// Employees can update stage of their own deals; admins can update any
router.patch(
  "/:id/stage",
  authorize("deal:update_stage"),
  DealController.handleUpdateDealStage
);

export default router;
