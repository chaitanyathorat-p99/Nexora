import Deal from "./deal.model.js";

export const save = async (data) => await Deal.create(data);

export const findAll = async () => {
  return await Deal.find()
    .sort("-createdAt")
    .populate("lead", "firstName lastName email")
    .populate("product.productId", "name price")
    .populate("createdBy", "fullName");
};



export const findById = async (id) => {
  return await Deal.findById(id)
    .populate("lead", "firstName lastName email")
    .populate("product.productId", "name price")
    .populate("createdBy", "fullName");
};

export const updateById = async (id, data) => {
  return await Deal.findByIdAndUpdate(id, data, { 
    new: true, 
    runValidators: true 
  });
};

export const deleteById = async (id) => {
  return await Deal.findByIdAndDelete(id);
};