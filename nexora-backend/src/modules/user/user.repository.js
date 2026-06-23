import User from "../auth/user.model.js";

export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findById = async (id) => {
  return await User.findById(id).select("-password");
};

export const findAll = async (filter = {}, skip = 0, limit = 20) => {
  return await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countAll = async (filter = {}) => {
  return await User.countDocuments(filter);
};

export const updateById = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");
};

export const deleteById = async (id) => {
  return await User.findByIdAndDelete(id);
};
