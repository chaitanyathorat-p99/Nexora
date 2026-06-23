import * as UserRoleRepo from "./userRole.repository.js";
import ApiError from "../../utils/ApiError.js";

export const listUserRoles = async (query = {}) => {
  const { page = 1, limit = 100, search } = query;

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageSize = Math.min(200, parseInt(limit) || 100);
  const skip = (pageNum - 1) * pageSize;

  const [items, totalCount] = await Promise.all([
    UserRoleRepo.findAll(filter, skip, pageSize),
    UserRoleRepo.countAll(filter),
  ]);

  return { items, totalCount, page: pageNum, pageSize };
};

export const getUserRoleById = async (id) => {
  const role = await UserRoleRepo.findById(id);
  if (!role) throw new ApiError(404, "User role not found");
  return role;
};

export const createUserRole = async (data) => {
  return await UserRoleRepo.create(data);
};

export const updateUserRole = async (id, data) => {
  const role = await UserRoleRepo.findById(id);
  if (!role) throw new ApiError(404, "User role not found");
  return await UserRoleRepo.updateById(id, data);
};

export const deleteUserRole = async (id) => {
  const role = await UserRoleRepo.findById(id);
  if (!role) throw new ApiError(404, "User role not found");
  return await UserRoleRepo.deleteById(id);
};
