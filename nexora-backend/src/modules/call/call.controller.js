import * as callService from "./call.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
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

export const createCall = async (req, res, next) => {
  try {
    const call = await callService.createCall(req.body, req.user);
    res.status(201).json(new ApiResponse(201, call, "Call created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllCalls = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = parseInt(req.query.limit, 10) || 10;

    // Start with ownership filter
    const filter = buildOwnershipFilter(req.user);

    if (req.query.lead) filter.lead = req.query.lead;
    if (req.query.assignedTo && req.user.role !== "employee") {
      filter.assignedTo = req.query.assignedTo;
    }
    if (req.query.createdBy && req.user.role !== "employee") {
      filter.createdBy = req.query.createdBy;
    }
    if (req.query.callDone !== undefined && req.query.callDone !== "") {
      filter.callDone = req.query.callDone === "true";
    }
    if (req.query.search) {
      const searchConditions = [
        { title: { $regex: req.query.search, $options: "i" } },
        { desc: { $regex: req.query.search, $options: "i" } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const result = await callService.getAllCalls(page, limit, filter);
    res.status(200).json(new ApiResponse(200, result, "Calls retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCallById = async (req, res, next) => {
  try {
    const call = await callService.getCallById(req.params.id);

    // Employees can only view their own/assigned calls
    if (req.user.role === "employee") {
      const userId = req.user._id.toString();
      const isAssigned = call.assignedTo?._id?.toString() === userId;
      const isCreator = call.createdBy?._id?.toString() === userId;
      if (!isAssigned && !isCreator) {
        return next(new ApiError(403, "Access denied. You can only view calls assigned to or created by you."));
      }
    }

    res.status(200).json(new ApiResponse(200, call, "Call retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateCall = async (req, res, next) => {
  try {
    const existing = await callService.getCallById(req.params.id);

    // Employees can only update their own/assigned calls
    if (req.user.role === "employee") {
      const userId = req.user._id.toString();
      const isAssigned = existing.assignedTo?._id?.toString() === userId;
      const isCreator = existing.createdBy?._id?.toString() === userId;
      if (!isAssigned && !isCreator) {
        return next(new ApiError(403, "Access denied. You can only update calls assigned to or created by you."));
      }
    }

    const call = await callService.updateCall(req.params.id, req.body, req.user);
    res.status(200).json(new ApiResponse(200, call, "Call updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteCall = async (req, res, next) => {
  try {
    const call = await callService.deleteCall(req.params.id);
    res.status(200).json(new ApiResponse(200, call, "Call deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCallsByLead = async (req, res, next) => {
  try {
    const { lead, page = 1, limit = 10, search } = req.query;
    if (!lead) return next(new ApiError(400, "Lead ID is required"));

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
      ];
    }

    const result = await callService.getCallsByLead(
      lead,
      parseInt(page),
      parseInt(limit),
      filter
    );
    res.status(200).json(new ApiResponse(200, result, "Calls retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
