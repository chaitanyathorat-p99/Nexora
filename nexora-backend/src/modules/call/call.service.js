import Call from "./call.model.js";

const populateFields = [
  { path: "lead", select: "firstName lastName email mobile" },
  { path: "assignedTo", select: "fullName email" },
  { path: "createdBy", select: "fullName email" },
  { path: "updatedBy", select: "fullName email" },
];

export const createCall = async (callData, user) => {
  const call = await Call.create({
    ...callData,
    createdBy: user._id,
  });
  return await Call.findById(call._id).populate(populateFields);
};

export const getAllCalls = async (page = 1, limit = 10, filter = {}) => {
  const skip = (page - 1) * limit;

  const calls = await Call.find(filter)
    .populate(populateFields)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Call.countDocuments(filter);

  return {
    content: calls,
    totalElements: total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const getCallsByLead = async (leadId, page = 1, limit = 10, filter = {}) => {
  const skip = (page - 1) * limit;
  const query = { lead: leadId, ...filter };

  const calls = await Call.find(query)
    .populate(populateFields)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Call.countDocuments(query);

  return { content: calls, total, page, limit };
};

export const getCallById = async (callId) => {
  const call = await Call.findById(callId).populate(populateFields);
  if (!call) throw new Error("Call not found");
  return call;
};

export const updateCall = async (callId, updateData, user) => {
  const call = await Call.findByIdAndUpdate(
    callId,
    { ...updateData, updatedBy: user._id },
    { new: true, runValidators: true }
  ).populate(populateFields);

  if (!call) throw new Error("Call not found");
  return call;
};

export const deleteCall = async (callId) => {
  const call = await Call.findByIdAndDelete(callId);
  if (!call) throw new Error("Call not found");
  return call;
};
