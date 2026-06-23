/**
 * @file task.test.js
 * @description Tests for Task module — controller
 *
 * Structure
 * ├── handleCreateTask
 * ├── handleGetTasks
 * ├── handleGetTaskById
 * ├── handleUpdateTask
 * ├── handleDeleteTask
 * ├── handleUpdateTaskStage
 * └── handleToggleSubtask
 */

import { jest } from "@jest/globals";

// ── Mock task service ─────────────────────────────────────────────────────────
const mockCreateTask       = jest.fn();
const mockListAllTasks     = jest.fn();
const mockListTaskById     = jest.fn();
const mockUpdateTaskInfo   = jest.fn();
const mockDeleteTaskById   = jest.fn();
const mockUpdateTaskStage  = jest.fn();
const mockToggleSubtask    = jest.fn();

jest.unstable_mockModule("../src/modules/task/task.service.js", () => ({
  createNewTask:       mockCreateTask,
  listAllTasks:        mockListAllTasks,
  listTaskById:        mockListTaskById,
  updateTaskInfo:      mockUpdateTaskInfo,
  deleteTaskById:      mockDeleteTaskById,
  updateTaskStage:     mockUpdateTaskStage,
  toggleSubtaskStatus: mockToggleSubtask,
}));

const {
  handleCreateTask, handleGetTasks, handleGetTaskById,
  handleUpdateTask, handleDeleteTask, handleUpdateTaskStage, handleToggleSubtask,
} = await import("../src/modules/task/task.controller.js");

// ── Helpers ───────────────────────────────────────────────────────────────────
const res = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json   = jest.fn().mockReturnValue(r);
  return r;
};

const USER = { id: "user_001", _id: "user_001", role: "employee" };

const SAMPLE_TASK = {
  _id: "task_001", title: "Fix bug", stage: "To Do",
  assignedTo: "user_001", createdBy: "user_001",
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// handleCreateTask
// =============================================================================
describe("handleCreateTask", () => {
  describe("positive", () => {
    test("201 — creates task with user id from req.user", async () => {
      mockCreateTask.mockResolvedValue(SAMPLE_TASK);
      const r = res();
      await handleCreateTask({ body: { title: "Fix bug", assignedTo: "user_001" }, user: USER }, r, jest.fn());
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Fix bug" }), USER.id
      );
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Task created sucessfully" })
      );
    });

    test("passes full body to service", async () => {
      mockCreateTask.mockResolvedValue(SAMPLE_TASK);
      const body = { title: "Task", assignedTo: "user_001", stage: "In Progress", description: "desc" };
      await handleCreateTask({ body, user: USER }, res(), jest.fn());
      expect(mockCreateTask).toHaveBeenCalledWith(body, USER.id);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockCreateTask.mockRejectedValue(new Error("Validation error"));
      const next = jest.fn();
      await handleCreateTask({ body: {}, user: USER }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("user id is always taken from req.user.id", async () => {
      mockCreateTask.mockResolvedValue(SAMPLE_TASK);
      await handleCreateTask({ body: { title: "T", createdBy: "spoofed" }, user: USER }, res(), jest.fn());
      expect(mockCreateTask).toHaveBeenCalledWith(expect.anything(), USER.id);
    });
  });
});

// =============================================================================
// handleGetTasks
// =============================================================================
describe("handleGetTasks", () => {
  describe("positive", () => {
    test("200 — returns all tasks", async () => {
      mockListAllTasks.mockResolvedValue([SAMPLE_TASK]);
      const r = res();
      await handleGetTasks({}, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Tasks retrived", data: [SAMPLE_TASK] })
      );
    });

    test("200 — returns empty array when no tasks", async () => {
      mockListAllTasks.mockResolvedValue([]);
      const r = res();
      await handleGetTasks({}, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockListAllTasks.mockRejectedValue(new Error("DB error"));
      const next = jest.fn();
      await handleGetTasks({}, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleGetTaskById
// =============================================================================
describe("handleGetTaskById", () => {
  describe("positive", () => {
    test("200 — returns task when found", async () => {
      mockListTaskById.mockResolvedValue(SAMPLE_TASK);
      const r = res();
      await handleGetTaskById({ params: { id: "task_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: SAMPLE_TASK })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when task not found", async () => {
      mockListTaskById.mockRejectedValue(new Error("Task not found"));
      const next = jest.fn();
      await handleGetTaskById({ params: { id: "bad" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes exact id to service", async () => {
      mockListTaskById.mockResolvedValue(SAMPLE_TASK);
      await handleGetTaskById({ params: { id: "task_001" } }, res(), jest.fn());
      expect(mockListTaskById).toHaveBeenCalledWith("task_001");
    });
  });
});

// =============================================================================
// handleUpdateTask
// =============================================================================
describe("handleUpdateTask", () => {
  describe("positive", () => {
    test("200 — returns updated task", async () => {
      const updated = { ...SAMPLE_TASK, title: "Fixed bug" };
      mockUpdateTaskInfo.mockResolvedValue(updated);
      const r = res();
      await handleUpdateTask({ params: { id: "task_001" }, body: { title: "Fixed bug" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Task updated successfully" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockUpdateTaskInfo.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await handleUpdateTask({ params: { id: "bad" }, body: {} }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes empty body without error", async () => {
      mockUpdateTaskInfo.mockResolvedValue(SAMPLE_TASK);
      const r = res();
      await handleUpdateTask({ params: { id: "task_001" }, body: {} }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });
});

// =============================================================================
// handleDeleteTask
// =============================================================================
describe("handleDeleteTask", () => {
  describe("positive", () => {
    test("200 — deletes task successfully", async () => {
      mockDeleteTaskById.mockResolvedValue(true);
      const r = res();
      await handleDeleteTask({ params: { id: "task_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Task deleted successfully" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockDeleteTaskById.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await handleDeleteTask({ params: { id: "bad" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleUpdateTaskStage
// =============================================================================
describe("handleUpdateTaskStage", () => {
  describe("positive", () => {
    test("200 — moves task to new stage", async () => {
      const updated = { ...SAMPLE_TASK, stage: "Done" };
      mockUpdateTaskStage.mockResolvedValue(updated);
      const r = res();
      await handleUpdateTaskStage({ params: { id: "task_001" }, body: { stage: "Done" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Task moved to Done" })
      );
    });

    test("passes id and stage to service", async () => {
      mockUpdateTaskStage.mockResolvedValue(SAMPLE_TASK);
      await handleUpdateTaskStage({ params: { id: "task_001" }, body: { stage: "In Progress" } }, res(), jest.fn());
      expect(mockUpdateTaskStage).toHaveBeenCalledWith("task_001", "In Progress");
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockUpdateTaskStage.mockRejectedValue(new Error("Invalid stage"));
      const next = jest.fn();
      await handleUpdateTaskStage({ params: { id: "task_001" }, body: { stage: "Invalid" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("message includes the stage name", async () => {
      mockUpdateTaskStage.mockResolvedValue({ ...SAMPLE_TASK, stage: "Won" });
      const r = res();
      await handleUpdateTaskStage({ params: { id: "task_001" }, body: { stage: "Won" } }, r, jest.fn());
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Task moved to Won" })
      );
    });
  });
});

// =============================================================================
// handleToggleSubtask
// =============================================================================
describe("handleToggleSubtask", () => {
  describe("positive", () => {
    test("200 — toggles subtask status", async () => {
      const updated = { ...SAMPLE_TASK, subTasks: [{ _id: "sub_001", title: "Sub", isCompleted: true }] };
      mockToggleSubtask.mockResolvedValue(updated);
      const r = res();
      await handleToggleSubtask({ params: { taskId: "task_001", subtaskId: "sub_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Subtask status updated" })
      );
    });

    test("passes taskId and subtaskId to service", async () => {
      mockToggleSubtask.mockResolvedValue(SAMPLE_TASK);
      await handleToggleSubtask({ params: { taskId: "task_001", subtaskId: "sub_001" } }, res(), jest.fn());
      expect(mockToggleSubtask).toHaveBeenCalledWith("task_001", "sub_001");
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockToggleSubtask.mockRejectedValue(new Error("Subtask not found"));
      const next = jest.fn();
      await handleToggleSubtask({ params: { taskId: "t", subtaskId: "s" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});
