import UserRole from "./userRole.model.js";

export const findAll = async (filter = {}, skip = 0, limit = 100) => {
  return await UserRole.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const countAll = async (filter = {}) => {
  return await UserRole.countDocuments(filter);
};

export const findById = async (id) => {
  return await UserRole.findById(id);
};

export const create = async (data) => {
  return await UserRole.create(data);
};

export const updateById = async (id, data) => {
  return await UserRole.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteById = async (id) => {
  return await UserRole.findByIdAndDelete(id);
};
