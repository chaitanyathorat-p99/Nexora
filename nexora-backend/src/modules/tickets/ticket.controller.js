import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import {
  createTicketService,
  getAllTicketsService,
  getTicketByIdService,
  updateTicketService,
  deleteTicketService,
  getTicketOptionsService,
} from "./ticket.service.js";

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

export const createTicket = async (req, res, next) => {
  try {
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : typeof req.body.tags === "string"
      ? req.body.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...req.body,
      tags,
      createdBy: req.user._id,
    };

    const ticket = await createTicketService(payload);
    res.status(201).json(new ApiResponse(201, ticket, "Ticket created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    // Start with ownership filter
    const filters = buildOwnershipFilter(req.user);

    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.assignedTo && req.user.role !== "employee") {
      filters.assignedTo = req.query.assignedTo;
    }
    if (req.query.search) {
      const searchConditions = [
        { subject: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
      if (filters.$or) {
        filters.$and = [{ $or: filters.$or }, { $or: searchConditions }];
        delete filters.$or;
      } else {
        filters.$or = searchConditions;
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder };
    const result = await getAllTicketsService(filters, skip, limit, sort);

    res.status(200).json(new ApiResponse(200, result, "Tickets retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await getTicketByIdService(req.params.id);
    if (!ticket) {
      return next(new ApiError(404, "Ticket not found"));
    }

    // Employees can only view their own/assigned tickets
    if (req.user.role === "employee") {
      const userId = req.user._id.toString();
      const isAssigned = ticket.assignedTo?._id?.toString() === userId;
      const isCreator = ticket.createdBy?._id?.toString() === userId;
      if (!isAssigned && !isCreator) {
        return next(new ApiError(403, "Access denied. You can only view tickets assigned to or created by you."));
      }
    }

    res.status(200).json(new ApiResponse(200, ticket, "Ticket retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await getTicketByIdService(req.params.id);
    if (!ticket) {
      return next(new ApiError(404, "Ticket not found"));
    }

    const isAdmin = ["super_admin", "admin"].includes(req.user.role);
    const userId = req.user._id.toString();
    const isAssigned = ticket.assignedTo?._id?.toString() === userId;
    const isCreator = ticket.createdBy?._id?.toString() === userId;

    if (!isAdmin && !isAssigned && !isCreator) {
      return next(new ApiError(403, "Access denied to update this ticket"));
    }

    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : typeof req.body.tags === "string"
      ? req.body.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const updatedTicket = await updateTicketService(req.params.id, {
      ...req.body,
      tags,
    });
    res.status(200).json(new ApiResponse(200, updatedTicket, "Ticket updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await getTicketByIdService(req.params.id);
    if (!ticket) {
      return next(new ApiError(404, "Ticket not found"));
    }

    await deleteTicketService(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Ticket deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getTicketOptions = async (req, res, next) => {
  try {
    const options = getTicketOptionsService();
    res.status(200).json(new ApiResponse(200, options, "Ticket options retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
