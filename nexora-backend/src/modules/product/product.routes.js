import express from "express";
import * as ProductController from "./product.controller.js";
import { createProductSchema } from "./product.validation.js";
import validate from "../../middlewares/validate.middleware.js";
import protect from "../../middlewares/auth.middleware.js";
import { authorize, authorizeRole } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(authorize("product:read"), ProductController.handleGetProducts)
  .post(
    authorizeRole("super_admin", "admin"),
    validate(createProductSchema),
    ProductController.handleCreateProduct
  );

router
  .route("/:id")
  .get(authorize("product:read"), ProductController.handleGetProductByid)
  .put(authorizeRole("super_admin", "admin"), ProductController.handleUpdateProduct)
  .delete(authorizeRole("super_admin", "admin"), ProductController.handleDeleteProduct);

export default router;
