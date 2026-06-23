import * as DealRepo from "./deal.repository.js";
import ApiError from "../../utils/ApiError.js";

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

export const createDeal = async (dealData, user) => {
  return await DealRepo.save({ ...dealData, createdBy: user._id });
};

export const listDeals = async (user, query = {}) => {
  const filter = buildOwnershipFilter(user);
  return await DealRepo.findAll(filter);
};

export const getDealDetails = async (id, user) => {
  const deal = await DealRepo.findById(id);
  if (!deal) throw new ApiError(404, "Deal not found");

  if (user.role === "employee") {
    const userId = user._id.toString();
    const isAssigned = deal.assignedTo?.toString() === userId;
    const isCreator = deal.createdBy?.toString() === userId;

    if (!isAssigned && !isCreator) {
      throw new ApiError(403, "Access denied. You can only view deals assigned to or created by you.");
    }
  }

  return deal;
};

export const updateDealInfo = async (id, updateData, user) => {
  const deal = await DealRepo.findById(id);
  if (!deal) throw new ApiError(404, "Deal not found");

  if (user.role === "employee") {
    const userId = user._id.toString();
    const isAssigned = deal.assignedTo?.toString() === userId;
    const isCreator = deal.createdBy?.toString() === userId;

    if (!isAssigned && !isCreator) {
      throw new ApiError(403, "Access denied. You can only update deals assigned to or created by you.");
    }
  }

  return await DealRepo.updateById(id, { ...updateData, updatedBy: user._id });
};

export const removeDeal = async (id) => {
  const deal = await DealRepo.deleteById(id);
  if (!deal) throw new ApiError(404, "Deal not found");
  return deal;
};

export const updateDealStage = async (id, newStage, user) => {
  const validStages = ["New", "Qualification", "Discovery", "Demo", "Negotiation", "Won", "Lost"];

  if (!validStages.includes(newStage)) {
    throw new ApiError(400, "Invalid deal stage provided");
  }

  const deal = await DealRepo.findById(id);
  if (!deal) throw new ApiError(404, "Deal not found");

  if (user.role === "employee") {
    const userId = user._id.toString();
    const isAssigned = deal.assignedTo?.toString() === userId;
    const isCreator = deal.createdBy?.toString() === userId;

    if (!isAssigned && !isCreator) {
      throw new ApiError(403, "Access denied. You can only update stages of deals assigned to you.");
    }
  }

  return await DealRepo.updateById(id, { dealStages: newStage, updatedBy: user._id });
};
