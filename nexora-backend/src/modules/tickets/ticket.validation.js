export const validateTicketData = (req, res, next) => {
  const {
    subject,
    category,
    status,
    priority,
    assignedTo,
    slaDueDate,
    tags,
  } = req.body;

  if (!subject || !category || !assignedTo) {
    return res.status(400).json({
      success: false,
      message: "subject, category, and assignedTo are required",
    });
  }

  const validStatuses = ["Open", "In Progress", "Resolved", "Closed"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
    });
  }

  const validPriorities = ["Low", "Medium", "High", "Critical"];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Allowed values: ${validPriorities.join(", ")}`,
    });
  }

  if (slaDueDate && isNaN(Date.parse(slaDueDate))) {
    return res.status(400).json({
      success: false,
      message: "slaDueDate must be a valid date",
    });
  }

  if (tags && !Array.isArray(tags) && typeof tags !== "string") {
    return res.status(400).json({
      success: false,
      message: "tags must be an array of strings or a comma-separated string",
    });
  }

  next();
};
