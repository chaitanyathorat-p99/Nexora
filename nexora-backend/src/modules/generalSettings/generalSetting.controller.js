import ApiResponse from "../../utils/ApiResponse.js";
import {
  createGeneralSettingService,
  getGeneralSettingsService,
  getGeneralSettingByIdService,
  updateGeneralSettingService,
  deleteGeneralSettingService,
  getGeneralSettingCategoriesService,
  getAllByCategoryService,
  getByCategoryAndIdService,
  updateByCategoryAndIdService,
  deleteByCategoryAndIdService,
} from "./generalSetting.service.js";

const normalizeGeneralSettingPayload = (payload) => {
  const normalized = { ...payload };
  if (!normalized.description && normalized.desc) {
    normalized.description = normalized.desc;
    delete normalized.desc;
  }
  return normalized;
};

export const createGeneralSetting = async (req, res) => {
  try {
    const settingData = normalizeGeneralSettingPayload({
      ...req.body,
      createdBy: req.user._id,
    });

    const setting = await createGeneralSettingService(settingData);

    res.status(201).json(
      new ApiResponse(201, setting, "General setting created successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to create general setting")
    );
  }
};

export const getGeneralSettings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const category = req.query.category;
    const search = req.query.search;
    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const filters = {};
    if (category) filters.category = category;
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder };

    const result = await getGeneralSettingsService(filters, skip, limit, sort);

    res.status(200).json(
      new ApiResponse(200, result, "General settings retrieved successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to retrieve general settings")
    );
  }
};

export const getGeneralSettingsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search;
    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const validCategories = ["lead_status", "product_type", "industry_type", "type_of_buyer"];
    if (!validCategories.includes(category)) {
      return res.status(400).json(
        new ApiResponse(400, null, `Invalid category: ${category}`)
      );
    }

    const filters = { category };
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder };

    const result = await getGeneralSettingsService(filters, skip, limit, sort);

    res.status(200).json(
      new ApiResponse(200, result, "General settings retrieved successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to retrieve general settings")
    );
  }
};

export const getGeneralSettingById = async (req, res) => {
  try {
    const setting = await getGeneralSettingByIdService(req.params.id);

    if (!setting) {
      return res.status(404).json(
        new ApiResponse(404, null, "General setting not found")
      );
    }

    res.status(200).json(
      new ApiResponse(200, setting, "General setting retrieved successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to retrieve general setting")
    );
  }
};

export const updateGeneralSetting = async (req, res) => {
  try {
    const payload = normalizeGeneralSettingPayload(req.body);
    const setting = await updateGeneralSettingService(req.params.id, payload);

    if (!setting) {
      return res.status(404).json(
        new ApiResponse(404, null, "General setting not found")
      );
    }

    res.status(200).json(
      new ApiResponse(200, setting, "General setting updated successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to update general setting")
    );
  }
};

export const deleteGeneralSetting = async (req, res) => {
  try {
    const setting = await deleteGeneralSettingService(req.params.id);

    if (!setting) {
      return res.status(404).json(
        new ApiResponse(404, null, "General setting not found")
      );
    }

    res.status(200).json(
      new ApiResponse(200, null, "General setting deleted successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to delete general setting")
    );
  }
};

const createCategoryHandler = (category) => async (req, res) => {
  req.body.category = category;
  return createGeneralSetting(req, res);
};

const getCategoryHandler = (category) => async (req, res) => {
  req.params.category = category;
  return getGeneralSettingsByCategory(req, res);
};

export const createLeadStatus = createCategoryHandler("lead_status");
export const createProductType = createCategoryHandler("product_type");
export const createIndustryType = createCategoryHandler("industry_type");
export const createTypeOfBuyer = createCategoryHandler("type_of_buyer");

export const getLeadStatuses = getCategoryHandler("lead_status");
export const getProductTypes = getCategoryHandler("product_type");
export const getIndustryTypes = getCategoryHandler("industry_type");
export const getTypeOfBuyers = getCategoryHandler("type_of_buyer");

export const getGeneralSettingCategories = async (req, res) => {
  try {
    const categories = await getGeneralSettingCategoriesService();
    res.status(200).json(
      new ApiResponse(200, categories, "General setting categories retrieved successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to retrieve categories")
    );
  }
};

/**
 * Flat-array handlers used by /api/product-type standalone routes.
 * The frontend's fetchProductType expects response.data to be a plain array,
 * not the paginated object returned by getGeneralSettingsByCategory.
 */
const makeFlatHandlers = (category) => ({
  getAll: async (req, res) => {
    try {
      const items = await getAllByCategoryService(category);
      res.status(200).json(new ApiResponse(200, items, `${category} list retrieved`));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
    }
  },

  create: async (req, res) => {
    try {
      const item = await createGeneralSettingService(
        normalizeGeneralSettingPayload({ ...req.body, category, createdBy: req.user._id })
      );
      res.status(201).json(new ApiResponse(201, item, `${category} created successfully`));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
    }
  },

  getById: async (req, res) => {
    try {
      const item = await getByCategoryAndIdService(category, req.params.id);
      if (!item) return res.status(404).json(new ApiResponse(404, null, `${category} not found`));
      res.status(200).json(new ApiResponse(200, item, `${category} retrieved`));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
    }
  },

  update: async (req, res) => {
    try {
      const item = await updateByCategoryAndIdService(
        category,
        req.params.id,
        normalizeGeneralSettingPayload(req.body)
      );
      if (!item) return res.status(404).json(new ApiResponse(404, null, `${category} not found`));
      res.status(200).json(new ApiResponse(200, item, `${category} updated`));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
    }
  },

  delete: async (req, res) => {
    try {
      const item = await deleteByCategoryAndIdService(category, req.params.id);
      if (!item) return res.status(404).json(new ApiResponse(404, null, `${category} not found`));
      res.status(200).json(new ApiResponse(200, null, `${category} deleted`));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, null, error.message));
    }
  },
});

export const productTypeHandlers = makeFlatHandlers("product_type");
export const industryTypeHandlers = makeFlatHandlers("industry_type");
export const typeOfBuyerHandlers = makeFlatHandlers("type_of_buyer");
