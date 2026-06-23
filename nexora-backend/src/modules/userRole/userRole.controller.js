import ApiResponse from "../../utils/ApiResponse.js";
import * as UserRoleService from "./userRole.service.js";

/**
 * GET /api/user-roles
 */
export const getAllUserRoles = async (req, res, next) => {
  try {
    const result = await UserRoleService.listUserRoles(req.query);
    res.status(200).json(
      new ApiResponse(200, result.items, "User roles fetched successfully", result.totalCount)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/user-roles/:id
 */
export const getUserRoleById = async (req, res, next) => {
  try {
    const role = await UserRoleService.getUserRoleById(req.params.id);
    res.status(200).json(new ApiResponse(200, role, "User role fetched successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/user-roles
 */
export const createUserRole = async (req, res, next) => {
  try {
    const role = await UserRoleService.createUserRole(req.body);
    res.status(201).json(new ApiResponse(201, role, "User role created successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/user-roles/:id
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const role = await UserRoleService.updateUserRole(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, role, "User role updated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/user-roles/:id
 */
export const deleteUserRole = async (req, res, next) => {
  try {
    await UserRoleService.deleteUserRole(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "User role deleted successfully"));
  } catch (error) {
    next(error);
  }
};
