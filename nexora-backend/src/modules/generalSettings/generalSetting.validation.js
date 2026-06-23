export const validateGeneralSetting = (req, res, next) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({
      success: false,
      message: "name and category are required",
    });
  }

  const validCategories = ["lead_status", "product_type", "industry_type", "type_of_buyer"];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `category must be one of: ${validCategories.join(", ")}`,
    });
  }

  next();
};

export const attachCategory = (category) => (req, res, next) => {
  req.body.category = category;
  next();
};
