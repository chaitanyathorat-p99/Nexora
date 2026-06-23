import * as TaskRepo from "./task.repository.js";
import ApiError from "../../utils/ApiError.js";
import mongoose from "mongoose";

const toObjectId = (val) => {
  if (!val) return undefined;
  if (mongoose.Types.ObjectId.isValid(val)) return val;
  return undefined;
};

/**
 * Row-level ownership filter for employees.
 * Tasks use an array for assignedTo, so we use $elemMatch / $in.
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

const assertOwnership = (task, user) => {
  if (user.role === "employee") {
    const userId = user._id.toString();
    const isAssigned = Array.isArray(task.assignedTo)
      ? task.assignedTo.some((id) => id?.toString() === userId)
      : task.assignedTo?.toString() === userId;
    const isCreator = task.createdBy?.toString() === userId;

    if (!isAssigned && !isCreator) {
      throw new ApiError(403, "Access denied. You can only access tasks assigned to or created by you.");
    }
  }
};

export const createNewTask = async (taskData, user) => {
  let assignedTo = taskData.assignedTo;
  if (!Array.isArray(assignedTo)) {
    assignedTo = assignedTo ? [assignedTo] : [];
  }
  assignedTo = assignedTo.filter((id) => mongoose.Types.ObjectId.isValid(id));

  const data = {
    ...taskData,
    assignedTo,
    createdBy: user._id,
    assignedBy: toObjectId(taskData.assignedBy),
    lead: toObjectId(taskData.lead),
  };

  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

  return TaskRepo.save(data);
};

export const listAllTasks = async ({ page, limit, search, filters } = {}, user) => {
  const ownershipFilter = buildOwnershipFilter(user);

  // Merge ownership filter with any caller-supplied filters
  const mergedFilters = { ...filters };

  if (ownershipFilter.$or) {
    if (mergedFilters.$or) {
      // Both have $or — combine with $and
      mergedFilters.$and = [
        { $or: ownershipFilter.$or },
        { $or: mergedFilters.$or },
      ];
      delete mergedFilters.$or;
    } else {
      mergedFilters.$or = ownershipFilter.$or;
    }
  }

  return TaskRepo.findAll({ page, limit, search, filters: mergedFilters });
};

export const listTaskById = async (id, user) => {
  const task = await TaskRepo.findbyId(id);
  if (!task) throw new ApiError(404, "Task not found");
  assertOwnership(task, user);
  return task;
};

export const updateTaskInfo = async (taskId, updateData, user) => {
  const task = await TaskRepo.findbyId(taskId);
  if (!task) throw new ApiError(404, "Task not found");
  assertOwnership(task, user);

  if (updateData.assignedTo !== undefined) {
    let assignedTo = Array.isArray(updateData.assignedTo)
      ? updateData.assignedTo
      : updateData.assignedTo ? [updateData.assignedTo] : [];
    updateData.assignedTo = assignedTo.filter((id) => mongoose.Types.ObjectId.isValid(id));
  }

  if (updateData.assignedBy !== undefined) {
    updateData.assignedBy = toObjectId(updateData.assignedBy);
    if (updateData.assignedBy === undefined) delete updateData.assignedBy;
  }
  if (updateData.lead !== undefined) {
    updateData.lead = toObjectId(updateData.lead);
    if (updateData.lead === undefined) delete updateData.lead;
  }
  if (updateData.createdBy !== undefined) {
    updateData.createdBy = toObjectId(updateData.createdBy);
    if (updateData.createdBy === undefined) delete updateData.createdBy;
  }

  return await TaskRepo.updateById(taskId, updateData);
};

export const updateTaskStage = async (taskId, newStage, user) => {
  const task = await TaskRepo.findbyId(taskId);
  if (!task) throw new ApiError(404, "Task not found");
  assertOwnership(task, user);
  return await TaskRepo.updateById(taskId, { taskStages: newStage });
};

export const deleteTaskById = async (id) => {
  const task = await TaskRepo.deleteById(id);
  if (!task) throw new ApiError(404, "Task not found");
  return task;
};

export const toggleSubtaskStatus = async (taskId, subtaskId, user) => {
  const task = await TaskRepo.findbyId(taskId);
  if (!task) throw new ApiError(404, "Task not found");
  assertOwnership(task, user);

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) throw new ApiError(404, "Subtask not found");

  subtask.isCompleted = !subtask.isCompleted;
  await task.save();
  return task;
};
