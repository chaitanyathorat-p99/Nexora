import * as TaskService from "./task.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const handleCreateTask = async (req, res, next) => {
  try {
    const task = await TaskService.createNewTask(req.body, req.user);
    res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
  } catch (error) {
    next(error);
  }
};

export const handleGetTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const filters = {};
    if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;
    if (req.query.createdBy) filters.createdBy = req.query.createdBy;
    if (req.query.taskStages) filters.taskStages = req.query.taskStages;
    if (req.query.taskStatus !== undefined) {
      filters.taskStatus = req.query.taskStatus === "true";
    }

    const result = await TaskService.listAllTasks({ page, limit, search, filters }, req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const handleGetTaskById = async (req, res, next) => {
  try {
    const task = await TaskService.listTaskById(req.params.id, req.user);
    res.status(200).json(new ApiResponse(200, task, "Task retrieved"));
  } catch (error) {
    next(error);
  }
};

export const handleUpdateTask = async (req, res, next) => {
  try {
    const task = await TaskService.updateTaskInfo(req.params.id, req.body, req.user);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteTask = async (req, res, next) => {
  try {
    await TaskService.deleteTaskById(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const handleUpdateTaskStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage, taskStages } = req.body;
    const newStage = taskStages || stage;
    const task = await TaskService.updateTaskStage(id, newStage, req.user);
    res.status(200).json(new ApiResponse(200, task, `Task moved to ${newStage}`));
  } catch (error) {
    next(error);
  }
};

export const handleToggleSubtask = async (req, res, next) => {
  try {
    const { taskId, subtaskId } = req.params;
    const task = await TaskService.toggleSubtaskStatus(taskId, subtaskId, req.user);
    res.status(200).json(new ApiResponse(200, task, "Subtask status updated"));
  } catch (error) {
    next(error);
  }
};
