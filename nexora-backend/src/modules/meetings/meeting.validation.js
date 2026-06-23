export const validateMeetingData = (req, res, next) => {
  const {
    title,
    dueDate,
    desc,
    meetingType,
    platForm,
    meetingLink,
    lead,
    assignedTo,
    meetingDone,
  } = req.body;

  // Only title is required — all other fields are optional
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "title is required",
    });
  }

  // If dueDate is provided, validate it's a valid date
  if (dueDate && !Date.parse(dueDate)) {
    return res.status(400).json({
      success: false,
      message: "dueDate must be a valid date",
    });
  }

  // If meetingDone is provided, validate it's a boolean
  if (meetingDone !== undefined && typeof meetingDone !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "meetingDone must be a boolean",
    });
  }

  next();
};
