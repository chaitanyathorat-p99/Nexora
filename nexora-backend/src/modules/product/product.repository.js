import Product from "./product.model.js";

export const save = async (data) => {
  return await Product.create(data);
};

export const findAll = async () => {
  return await Product.find()
    .populate("productType", "name")
    .populate("createdBy", "name email")
    .sort("-createdAt");
};

export const findById = async (id) => {
  return await Product.findById(id)
    .populate("productType", "name")
    .populate("createdBy", "name email");
};

export const updateById = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("productType", "name")
    .populate("createdBy", "name email");
};

export const deleteById = async (id) => {
  return await Product.findByIdAndDelete(id);
};
