import GeneralSetting from "./generalSetting.model.js";

export const createGeneralSettingService = async (data) => {
  const setting = await GeneralSetting.create(data);
  return setting;
};

export const getGeneralSettingsService = async (filters = {}, skip = 0, limit = 20, sort = { createdAt: -1 }) => {
  const query = GeneralSetting.find(filters).sort(sort).skip(skip).limit(limit);
  const total = await GeneralSetting.countDocuments(filters);
  const items = await query;

  return {
    items,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Math.floor(skip / limit) + 1,
  };
};

export const getGeneralSettingByIdService = async (id) => {
  return await GeneralSetting.findById(id);
};

export const updateGeneralSettingService = async (id, data) => {
  return await GeneralSetting.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteGeneralSettingService = async (id) => {
  return await GeneralSetting.findByIdAndDelete(id);
};

export const getGeneralSettingCategoriesService = async () => {
  return [
    { key: "lead_status", label: "Lead Status" },
    { key: "product_type", label: "Product Types" },
    { key: "industry_type", label: "Industry Types" },
    { key: "type_of_buyer", label: "Type Of Buyers" },
  ];
};

/**
 * Returns all items for a given category as a flat array (no pagination).
 * Used by the /api/product-type standalone endpoints where the frontend
 * expects response.data to be a plain array.
 */
export const getAllByCategoryService = async (category) => {
  return await GeneralSetting.find({ category }).sort("name");
};

export const getByCategoryAndIdService = async (category, id) => {
  return await GeneralSetting.findOne({ _id: id, category });
};

export const updateByCategoryAndIdService = async (category, id, data) => {
  const { category: _stripped, ...safeData } = data;
  return await GeneralSetting.findOneAndUpdate(
    { _id: id, category },
    safeData,
    { new: true, runValidators: true }
  );
};

export const deleteByCategoryAndIdService = async (category, id) => {
  return await GeneralSetting.findOneAndDelete({ _id: id, category });
};
