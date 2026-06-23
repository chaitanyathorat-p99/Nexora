import Task from "./task.model.js";

const POPULATE_ASSIGNED = { path: "assignedTo", select: "name fullName username email" };
const POPULATE_CREATED  = { path: "createdBy",  select: "name fullName username email" };
const POPULATE_ASSIGNED_BY = { path: "assignedBy", select: "name fullName username email" };

export const save = async (data) => {
    const task = await Task.create(data);
    return task.populate([POPULATE_ASSIGNED, POPULATE_CREATED, POPULATE_ASSIGNED_BY]);
};

/**
 * Returns paginated tasks with optional search and filters.
 * Response shape: { content, totalElements, pages, currentPage }
 */
export const findAll = async ({ page = 1, limit = 10, search = "", filters = {} } = {}) => {
    const query = { ...filters };

    if (search) {
        query.$or = [
            { title:       { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate(POPULATE_ASSIGNED)
            .populate(POPULATE_CREATED)
            .populate(POPULATE_ASSIGNED_BY),
        Task.countDocuments(query),
    ]);

    return {
        content: items,
        totalElements: total,
        pages: Math.ceil(total / limit),
        currentPage: page,
    };
};

export const findbyId = async (id) => {
    return Task.findById(id)
        .populate(POPULATE_ASSIGNED)
        .populate(POPULATE_CREATED)
        .populate(POPULATE_ASSIGNED_BY);
};

export const updateById = async (id, data) => {
    return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate(POPULATE_ASSIGNED)
        .populate(POPULATE_CREATED)
        .populate(POPULATE_ASSIGNED_BY);
};

export const deleteById = async (id) => {
    return Task.findByIdAndDelete(id);
};
