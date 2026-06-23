import Meeting from "./meeting.model.js";

const populateFields = [
  { path: "lead", select: "firstName lastName email mobile" },
  { path: "assignedTo", select: "fullName email" },
  { path: "createdBy", select: "fullName email" },
];

export const createMeetingService = async (data) => {
  const meeting = await Meeting.create(data);
  return await Meeting.findById(meeting._id).populate(populateFields);
};

export const getAllMeetingsService = async (
  filters = {},
  skip = 0,
  limit = 20,
  sort = { createdAt: -1 }
) => {
  const total = await Meeting.countDocuments(filters);
  const meetings = await Meeting.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate(populateFields);

  return {
    meetings,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Math.floor(skip / limit) + 1,
  };
};

export const getMeetingByIdService = async (id) => {
  return await Meeting.findById(id).populate(populateFields);
};

export const updateMeetingService = async (id, data) => {
  return await Meeting.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(populateFields);
};

export const deleteMeetingService = async (id) => {
  return await Meeting.findByIdAndDelete(id);
};

export const getMeetingOptionsService = () => {
  return {
    meetingTypes: ["Online", "Offline"],
    platforms: [
      "Zoom Meet",
      "Google Meet",
      "Microsoft Meet",
      "Company Link",
      "Other",
      "In Person",
    ],
    meetingDoneStatuses: [true, false],
  };
};
