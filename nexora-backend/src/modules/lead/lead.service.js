import * as LeadRepo from "./lead.repository.js";
import ApiError from "../../utils/ApiError.js";

/**
 * Build the ownership filter.
 * Employees can only see leads assigned to them or created by them.
 * Admins and super_admins see all leads.
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

export const createLead = async (leadData, user) => {
  const existingLead = await LeadRepo.getAll({ email: leadData.email });

  if (existingLead.length > 0) {
    throw new ApiError(400, "A lead with this email already exists");
  }

  return await LeadRepo.saveLead({
    ...leadData,
    createdBy: user._id,
  });
};

export const listLeads = async (query = {}, user) => {
  const {
    search,
    status,
    from,
    to,
    page = 1,
    assignedTo,
  } = query;

  const cityValue = query["info.city"];
  const sourceValue = query["info.source"];

  // Start with ownership filter (empty for admin/super_admin)
  const filter = buildOwnershipFilter(user);

  if (search) {
    const searchConditions = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

    // Merge with existing $or from ownership filter
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
      delete filter.$or;
    } else {
      filter.$or = searchConditions;
    }
  }

  if (status) filter.status = status;
  if (cityValue) filter.city = { $regex: cityValue, $options: "i" };
  if (sourceValue) filter.source = sourceValue;

  // Admins can filter by assignedTo; employees are already scoped
  if (assignedTo && user.role !== "employee") {
    filter.assignedTo = assignedTo;
  }

  if (from || to) {
    filter.createdAt = {};
    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate.getTime())) filter.createdAt.$gte = fromDate;
    }
    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate.getTime())) filter.createdAt.$lte = toDate;
    }
    if (!filter.createdAt.$gte && !filter.createdAt.$lte) {
      delete filter.createdAt;
    }
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageSize = 10;
  const skip = (pageNum - 1) * pageSize;

  const [leads, totalCount] = await Promise.all([
    LeadRepo.getAll(filter, skip, pageSize),
    LeadRepo.countAll(filter),
  ]);

  return { leads, totalCount, page: pageNum, pageSize };
};

export const getLeadDetails = async (id, _user) => {
  const lead = await LeadRepo.getById(id);
  if (!lead) throw new ApiError(404, "Lead not found");
  return lead;
};

export const updateleadInfo = async (id, updateData, user) => {
  const lead = await LeadRepo.getById(id);
  if (!lead) throw new ApiError(404, "Lead not found");

  // Employees can only update leads assigned to them or created by them
  if (user.role === "employee") {
    const userId = user._id.toString();
    const isAssigned = lead.assignedTo?.toString() === userId;
    const isCreator = lead.createdBy?.toString() === userId;
    if (!isAssigned && !isCreator) {
      throw new ApiError(403, "Access denied. You can only update leads assigned to you.");
    }
  }

  return await LeadRepo.updateById(id, { ...updateData, updatedBy: user._id });
};

export const removeLead = async (id) => {
  const lead = await LeadRepo.deleteById(id);
  if (!lead) throw new ApiError(404, "Lead not found");
  return lead;
};
