import express from "express";
import {
  createGeneralSetting,
  getGeneralSettings,
  getGeneralSettingsByCategory,
  getGeneralSettingById,
  updateGeneralSetting,
  deleteGeneralSetting,
  getGeneralSettingCategories,
  createLeadStatus,
  createProductType,
  createIndustryType,
  createTypeOfBuyer,
  getLeadStatuses,
  getProductTypes,
  getIndustryTypes,
  getTypeOfBuyers,
  productTypeHandlers,
  industryTypeHandlers,
  typeOfBuyerHandlers,
} from "./generalSetting.controller.js";
import { validateGeneralSetting, attachCategory } from "./generalSetting.validation.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorize, authorizeRole } from "../../middlewares/rbac.middleware.js";

// ── Main general-settings router (/api/general-settings) ─────────────────────
const router = express.Router();

// Read endpoints — all authenticated users
router.get("/categories", protect, authorize("settings:read"), getGeneralSettingCategories);
router.get("/category/:category", protect, authorize("settings:read"), getGeneralSettingsByCategory);
router.get("/lead-status", protect, authorize("settings:read"), getLeadStatuses);
router.get("/product-type", protect, authorize("settings:read"), getProductTypes);
router.get("/product-types", protect, authorize("settings:read"), getProductTypes);
router.get("/industry-type", protect, authorize("settings:read"), getIndustryTypes);
router.get("/industry-types", protect, authorize("settings:read"), getIndustryTypes);
router.get("/type-of-buyer", protect, authorize("settings:read"), getTypeOfBuyers);
router.get("/type-of-buyers", protect, authorize("settings:read"), getTypeOfBuyers);
router.get("/", protect, authorize("settings:read"), getGeneralSettings);
router.get("/:id", protect, authorize("settings:read"), getGeneralSettingById);

// Write endpoints — admin and super_admin only
router.post(
  "/",
  protect,
  authorizeRole("super_admin", "admin"),
  validateGeneralSetting,
  createGeneralSetting
);
router.post(
  "/lead-status",
  protect,
  authorizeRole("super_admin", "admin"),
  attachCategory("lead_status"),
  validateGeneralSetting,
  createLeadStatus
);
router.post(
  "/product-type",
  protect,
  authorizeRole("super_admin", "admin"),
  attachCategory("product_type"),
  validateGeneralSetting,
  createProductType
);
router.post(
  "/product-types",
  protect,
  authorizeRole("super_admin", "admin"),
  attachCategory("product_type"),
  validateGeneralSetting,
  createProductType
);
router.post(
  "/industry-type",
  protect,
  authorizeRole("super_admin", "admin"),
  attachCategory("industry_type"),
  validateGeneralSetting,
  createIndustryType
);
router.post(
  "/industry-types",
  protect,
  authorizeRole("super_admin", "admin"),
  attachCategory("industry_type"),
  validateGeneralSetting,
  createIndustryType
);
router.post(
  "/type-of-buyer",
  protect,
  authorizeRole("super_admin", "admin"),
  attachCategory("type_of_buyer"),
  validateGeneralSetting,
  createTypeOfBuyer
);
router.post(
  "/type-of-buyers",
  protect,
  authorizeRole("super_admin", "admin"),
  attachCategory("type_of_buyer"),
  validateGeneralSetting,
  createTypeOfBuyer
);

router.put(
  "/:id",
  protect,
  authorizeRole("super_admin", "admin"),
  validateGeneralSetting,
  updateGeneralSetting
);
router.delete(
  "/:id",
  protect,
  authorizeRole("super_admin", "admin"),
  deleteGeneralSetting
);

// ── Product-type router (/api/product-type) ───────────────────────────────────
export const productTypeRouter = express.Router();

productTypeRouter.get("/", protect, authorize("settings:read"), productTypeHandlers.getAll);
productTypeRouter.post(
  "/",
  protect,
  authorizeRole("super_admin", "admin"),
  productTypeHandlers.create
);
productTypeRouter.get("/:id", protect, authorize("settings:read"), productTypeHandlers.getById);
productTypeRouter.put(
  "/:id",
  protect,
  authorizeRole("super_admin", "admin"),
  productTypeHandlers.update
);
productTypeRouter.delete(
  "/:id",
  protect,
  authorizeRole("super_admin", "admin"),
  productTypeHandlers.delete
);

// ── Industry-type router (/api/industry-type) ─────────────────────────────────
export const industryTypeRouter = express.Router();

industryTypeRouter.get("/", protect, authorize("settings:read"), industryTypeHandlers.getAll);
industryTypeRouter.post(
  "/",
  protect,
  authorizeRole("super_admin", "admin"),
  industryTypeHandlers.create
);
industryTypeRouter.get("/:id", protect, authorize("settings:read"), industryTypeHandlers.getById);
industryTypeRouter.put(
  "/:id",
  protect,
  authorizeRole("super_admin", "admin"),
  industryTypeHandlers.update
);
industryTypeRouter.delete(
  "/:id",
  protect,
  authorizeRole("super_admin", "admin"),
  industryTypeHandlers.delete
);

// ── Type-of-buyer router (/api/type-of-buyer) ─────────────────────────────────
export const typeOfBuyerRouter = express.Router();

typeOfBuyerRouter.get("/", protect, authorize("settings:read"), typeOfBuyerHandlers.getAll);
typeOfBuyerRouter.post(
  "/",
  protect,
  authorizeRole("super_admin", "admin"),
  typeOfBuyerHandlers.create
);
typeOfBuyerRouter.get("/:id", protect, authorize("settings:read"), typeOfBuyerHandlers.getById);
typeOfBuyerRouter.put(
  "/:id",
  protect,
  authorizeRole("super_admin", "admin"),
  typeOfBuyerHandlers.update
);
typeOfBuyerRouter.delete(
  "/:id",
  protect,
  authorizeRole("super_admin", "admin"),
  typeOfBuyerHandlers.delete
);

export default router;
