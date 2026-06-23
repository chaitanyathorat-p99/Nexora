import Ticket from "./ticket.model.js";

const populateFields = [
  { path: "assignedTo", select: "fullName email role" },
  { path: "createdBy", select: "fullName email role" },
];

export const createTicketService = async (data) => {
  const ticket = await Ticket.create(data);
  return ticket.populate(populateFields);
};

export const getAllTicketsService = async (
  filters = {},
  skip = 0,
  limit = 20,
  sort = { createdAt: -1 }
) => {
  const total = await Ticket.countDocuments(filters);
  const tickets = await Ticket.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate(populateFields);

  return {
    tickets,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Math.floor(skip / limit) + 1,
  };
};

export const getTicketByIdService = async (id) => {
  return await Ticket.findById(id).populate(populateFields);
};

export const updateTicketService = async (id, data) => {
  return await Ticket.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(populateFields);
};

export const deleteTicketService = async (id) => {
  return await Ticket.findByIdAndDelete(id);
};

export const getTicketOptionsService = () => {
  return {
    statuses: ["Open", "In Progress", "Resolved", "Closed"],
    priorities: ["Low", "Medium", "High", "Critical"],
    categories: ["Problem", "Request", "Bug", "Incident"],
  };
};
