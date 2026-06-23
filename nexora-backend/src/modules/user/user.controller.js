import ApiResponse from "../../utils/ApiResponse.js";
import * as UserService from "./user.service.js";
import cloudinary from "../../config/cloudinary.js";

// cloudinary is now a factory function — call getCloudinary() at use time
const getCloudinary = cloudinary;
import * as UserRepo from "./user.repository.js";

/**
 * GET /api/users
 * super_admin: all users | admin: employees only
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await UserService.listUsers(req.user, req.query);
    res.status(200).json(
      new ApiResponse(
        200,
        result.users,
        "Users fetched successfully",
        result.totalCount,
        result.page,
        result.pageSize
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user, req.params.id);
    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Privileged user creation (admin creates employee, super_admin creates any)
 */
export const createUser = async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.user, req.body);
    res.status(201).json(new ApiResponse(201, user, "User created successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.user, req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/deactivate
 */
export const deactivateUser = async (req, res, next) => {
  try {
    const user = await UserService.deactivateUser(req.user, req.params.id);
    res.status(200).json(new ApiResponse(200, user, "User deactivated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/reactivate
 * super_admin only
 */
export const reactivateUser = async (req, res, next) => {
  try {
    const user = await UserService.reactivateUser(req.params.id);
    res.status(200).json(new ApiResponse(200, user, "User reactivated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * super_admin only
 */
export const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.user, req.params.id);
    res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/reset-password
 * admin/super_admin only
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json(
        new ApiResponse(400, null, "New password must be at least 6 characters")
      );
    }
    await UserService.resetUserPassword(req.user, req.params.id, newPassword);
    res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/upload-avatar
 * Any authenticated user — uploads their own profile picture to Cloudinary.
 * Accepts multipart/form-data with field name "avatar".
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, null, "No image file provided"));
    }

    // Upload buffer to Cloudinary
    const cloudinary = getCloudinary();
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "nexora/avatars",
          public_id: `user_${req.user._id}`,
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Persist the Cloudinary URL on the user document
    const updatedUser = await UserRepo.updateById(req.user._id.toString(), {
      profilePic: result.secure_url,
    });

    res.status(200).json(
      new ApiResponse(200, updatedUser, "Profile picture updated successfully")
    );
  } catch (error) {
    next(error);
  }
};
