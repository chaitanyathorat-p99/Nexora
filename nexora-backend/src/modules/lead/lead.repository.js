import Lead from "./lead.model.js";

export const saveLead = async(data) =>{
    return await Lead.create(data);
};


export const getAll = async (filters = {}, skip = 0, limit = 10) => {
    return await Lead.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("assignedTo", "fullName email");
};

export const countAll = async (filters = {}) => {
    return await Lead.countDocuments(filters);
};

export const getById = async (id) => {
    return await Lead.findById(id).populate("assignedTo", "fullName email");
}

export const updateById = async (id, updateData) => {
    return await Lead.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate("assignedTo", "fullName email");
}

export const deleteById = async(id) =>{
    return await Lead.findByIdAndDelete(id);
}

