import ApiResponse from "../../utils/ApiResponse.js";
import {
  createMeetingService,
  getAllMeetingsService,
  getMeetingByIdService,
  updateMeetingService,
  deleteMeetingService,
  getMeetingOptionsService,
} from "./meeting.service.js";
import ApiError from "../../utils/ApiError.js";

/**
 * Build row-level ownership filter for employees.
 */
const buildOwnershipFilter = (user) => {
  if (user.role === "employee") {
    return {
      $or: [
        { assignedTo: user._id },
        { createdBy: user._id },
      ],
    };
  }
  return {};
};

export const createMeeting = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo || req.user._id,
    };

    const meeting = await createMeetingService(payload);
    res.status(201).json(new ApiResponse(201, meeting, "Meeting created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getMeetings = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = parseInt(req.query.limit, 10) || 20;
    const sort = {
      [req.query.sort || "createdAt"]: req.query.order === "asc" ? 1 : -1,
    };

    // Start with ownership filter
    const filters = buildOwnershipFilter(req.user);

    if (req.query.lead) filters.lead = req.query.lead;
    // Admins can filter by assignedTo; employees are already scoped
    if (req.query.assignedTo && req.user.role !== "employee") {
      filters.assignedTo = req.query.assignedTo;
    }
    if (req.query.platForm) filters.platForm = req.query.platForm;
    if (req.query.meetingType) filters.meetingType = req.query.meetingType;
    if (req.query.meetingDone !== undefined && req.query.meetingDone !== "") {
      filters.meetingDone = req.query.meetingDone === "true";
    }
    if (req.query.from || req.query.to) {
      filters.createdAt = {};
      if (req.query.from) filters.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filters.createdAt.$lte = new Date(req.query.to);
    }
    if (req.query.search) {
      const searchConditions = [
        { title: { $regex: req.query.search, $options: "i" } },
        { desc: { $regex: req.query.search, $options: "i" } },
        { meetingLink: { $regex: req.query.search, $options: "i" } },
      ];
      if (filters.$or) {
        filters.$and = [{ $or: filters.$or }, { $or: searchConditions }];
        delete filters.$or;
      } else {
        filters.$or = searchConditions;
      }
    }

    const skip = (page - 1) * limit;
    const result = await getAllMeetingsService(filters, skip, limit, sort);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          content: result.meetings,
          totalElements: result.total,
          pages: result.pages,
          currentPage: result.currentPage,
        },
        "Meetings retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await getMeetingByIdService(req.params.id);
    if (!meeting) {
      return next(new ApiError(404, "Meeting not found"));
    }

    // Employees can only view their own/assigned meetings
    if (req.user.role === "employee") {
      const userId = req.user._id.toString();
      const isAssigned = meeting.assignedTo?._id?.toString() === userId;
      const isCreator = meeting.createdBy?._id?.toString() === userId;
      if (!isAssigned && !isCreator) {
        return next(new ApiError(403, "Access denied. You can only view meetings assigned to or created by you."));
      }
    }

    res.status(200).json(new ApiResponse(200, meeting, "Meeting retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateMeeting = async (req, res, next) => {
  try {
    const meeting = await getMeetingByIdService(req.params.id);
    if (!meeting) {
      return next(new ApiError(404, "Meeting not found"));
    }

    const isAdmin = ["super_admin", "admin"].includes(req.user.role);
    const userId = req.user._id.toString();
    const isAssigned = meeting.assignedTo?._id?.toString() === userId;
    const isCreator = meeting.createdBy?._id?.toString() === userId;

    if (!isAdmin && !isAssigned && !isCreator) {
      return next(new ApiError(403, "Access denied to update this meeting"));
    }

    const updatedMeeting = await updateMeetingService(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, updatedMeeting, "Meeting updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await getMeetingByIdService(req.params.id);
    if (!meeting) {
      return next(new ApiError(404, "Meeting not found"));
    }

    await deleteMeetingService(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Meeting deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getMeetingOptions = async (req, res, next) => {
  try {
    const options = getMeetingOptionsService();
    res.status(200).json(new ApiResponse(200, options, "Meeting options retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
