import React, { useEffect, useMemo, useRef, useState } from "react";
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useUpdateTaskMutation } from "../../../features/allApi";
import { checkAccess, hasFeature } from "../../../atoms/static";
import { TaskStage } from "../../../atoms/State";
import CustomModel from "../../../atoms/model/CustomModel";
import EResponse from "../../../atoms/response/EResponse";

const modelName = "Task";

const normalizeTaskStage = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (lower === "to do" || lower === "todo") return "New";
  if (lower === "in progress" || lower === "in_progress" || lower === "inprogress") return "In Process";
  if (lower === "done") return "Completed";
  return raw;
};

const isAdminRoleName = (roleName) => {
  const normalized = String(roleName || "")
    .toUpperCase()
    .replace(/[\s-]/g, "_");
  return normalized.includes("ADMIN");
};

const TaskViewModal = ({ open, onClose, selectedTask, setSelectedTask, taskRows, user }) => {
  const [viewTaskStage, setViewTaskStage] = useState("");
  const [stageSaveState, setStageSaveState] = useState("idle");
  const [stageDirty, setStageDirty] = useState(false);
  const [viewTaskDone, setViewTaskDone] = useState(false);
  const [viewOutcome, setViewOutcome] = useState("");
  const [taskDoneSaveState, setTaskDoneSaveState] = useState("idle");
  const [taskDoneDirty, setTaskDoneDirty] = useState(false);
  const [outcomeError, setOutcomeError] = useState("");
  const [taskDoneStageError, setTaskDoneStageError] = useState("");
  const lastOutcomeToastRef = useRef(0);
  const [viewSubtasks, setViewSubtasks] = useState([]);
  const [subtasksSaveState, setSubtasksSaveState] = useState("idle");
  const [subtasksDirty, setSubtasksDirty] = useState(false);
  const [updateTask, updateTaskResponse] = useUpdateTaskMutation();
  const roleName = user?.role?.name;
  const canManageSubtasks = isAdminRoleName(roleName);

  const canEditTaskStage =
    checkAccess(user, modelName, "update") || hasFeature(user, modelName);
  const canEditTaskDone = canEditTaskStage;

  useEffect(() => {
    if (!open) {
      return;
    }

    updateTaskResponse?.reset?.();
    setViewTaskStage(normalizeTaskStage(selectedTask?.taskStages || ""));
    setStageSaveState("idle");
    setStageDirty(false);
    setViewTaskDone(!!selectedTask?.taskStatus);
    setViewOutcome(selectedTask?.outcome || "");
    setTaskDoneSaveState("idle");
    setTaskDoneDirty(false);
    setOutcomeError("");
    setTaskDoneStageError("");
    setViewSubtasks(Array.isArray(selectedTask?.subtasks) ? selectedTask.subtasks : []);
    setSubtasksSaveState("idle");
    setSubtasksDirty(false);
  }, [selectedTask?._id, open]);

  useEffect(() => {
    if (viewTaskStage === "Completed") {
      setTaskDoneStageError("");
    }
  }, [viewTaskStage]);

  useEffect(() => {
    if (!open || !selectedTask?._id || !canEditTaskStage || !stageDirty) {
      return;
    }

    const currentStage = selectedTask?.taskStages || "";
    if (!viewTaskStage || viewTaskStage === currentStage) {
      setStageDirty(false);
      return;
    }

    setStageSaveState("saving");

    const timeoutId = setTimeout(async () => {
      try {
        await updateTask({ _id: selectedTask._id, taskStages: viewTaskStage }).unwrap();
        setSelectedTask((prev) => (prev ? { ...prev, taskStages: viewTaskStage } : prev));
        setStageSaveState("saved");
        setStageDirty(false);
      } catch (e) {
        setStageSaveState("error");
        setStageDirty(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [viewTaskStage, selectedTask?._id, canEditTaskStage, selectedTask?.taskStages, updateTask, setSelectedTask, open, stageDirty]);

  useEffect(() => {
    if (!open || !selectedTask?._id || !canEditTaskDone || !taskDoneDirty) {
      return;
    }

    const currentDone = !!selectedTask?.taskStatus;
    const currentOutcome = selectedTask?.outcome || "";
    const normalizedViewOutcome = String(viewOutcome || "").trim();
    const normalizedCurrentOutcome = String(currentOutcome || "").trim();

    const hasDoneChanged = viewTaskDone !== currentDone;
    const hasOutcomeChanged = normalizedViewOutcome !== normalizedCurrentOutcome;

    if (!hasDoneChanged && !hasOutcomeChanged) {
      setTaskDoneDirty(false);
      return;
    }

    if (viewTaskDone && viewTaskStage !== "Completed") {
      setTaskDoneStageError("Please change stage to Completed before marking task done");
      setTaskDoneDirty(false);
      return;
    }
    setTaskDoneStageError("");

    if (viewTaskDone && !normalizedViewOutcome) {
      setOutcomeError("Outcome is required when task is done");
      const now = Date.now();
      if (now - lastOutcomeToastRef.current > 1500) {
        message.error("Outcome is required when Task Done is checked");
        lastOutcomeToastRef.current = now;
      }
      setTaskDoneDirty(false);
      return;
    }

    setOutcomeError("");
    setTaskDoneSaveState("saving");

    const timeoutId = setTimeout(async () => {
      try {
        const payload = {
          _id: selectedTask._id,
          taskStatus: viewTaskDone,
          outcome: viewTaskDone ? normalizedViewOutcome : "",
        };
        const updated = await updateTask(payload).unwrap();
        if (updated) {
          setSelectedTask(updated);
          setViewTaskDone(!!updated?.taskStatus);
          setViewOutcome(updated?.outcome || "");
        } else {
          setSelectedTask((prev) =>
            prev
              ? {
                  ...prev,
                  taskStatus: payload.taskStatus,
                  outcome: payload.outcome,
                }
              : prev
          );
        }
        setTaskDoneSaveState("saved");
        setTaskDoneDirty(false);
      } catch (e) {
        setTaskDoneSaveState("error");
        setTaskDoneDirty(false);
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [
    canEditTaskDone,
    selectedTask?._id,
    selectedTask?.outcome,
    selectedTask?.taskStatus,
    setSelectedTask,
    updateTask,
    viewOutcome,
    viewTaskDone,
    open,
    taskDoneDirty,
  ]);

  const userId = user?._id || user?.sub || user?.id;
  const canToggleSubtask = (item) => {
    if (canManageSubtasks) {
      return true;
    }

    const assignedTo = item?.assignedTo?._id || item?.assignedTo;
    if (assignedTo && String(assignedTo) === String(userId)) {
      return true;
    }

    if (!assignedTo) {
      const taskAssignees = Array.isArray(selectedTask?.assignedTo) ? selectedTask.assignedTo : [];
      return taskAssignees.some((assignee) => String(assignee?._id || assignee) === String(userId));
    }

    return false;
  };

  useEffect(() => {
    if (!open || !selectedTask?._id || !subtasksDirty) {
      return;
    }

    const normalizeSubtasks = (items) =>
      (Array.isArray(items) ? items : []).map((item) => ({
        _id: item?._id,
        title: item?.title || "",
        isDone: !!item?.isDone,
      }));

    const localComparable = JSON.stringify(normalizeSubtasks(viewSubtasks));
    const sourceComparable = JSON.stringify(normalizeSubtasks(selectedTask?.subtasks || []));

    if (localComparable === sourceComparable) {
      setSubtasksDirty(false);
      return;
    }

    setSubtasksSaveState("saving");
    const timeoutId = setTimeout(async () => {
      try {
        const payload = {
          _id: selectedTask._id,
          subtasks: normalizeSubtasks(viewSubtasks),
        };

        const updated = await updateTask(payload).unwrap();
        if (updated) {
          setSelectedTask(updated);
        } else {
          setSelectedTask((prev) => (prev ? { ...prev, subtasks: payload.subtasks } : prev));
        }
        if ((updated?.taskStages || payload?.taskStages) === "Review") {
          setViewTaskStage("Review");
        }
        setSubtasksSaveState("saved");
        setSubtasksDirty(false);
      } catch (e) {
        setSubtasksSaveState("error");
        setSubtasksDirty(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [viewSubtasks, selectedTask?._id, selectedTask?.subtasks, setSelectedTask, updateTask, open, subtasksDirty]);

  const currentTaskIndex = useMemo(() => {
    if (!selectedTask?._id) {
      return -1;
    }
    return taskRows.findIndex((item) => item?._id === selectedTask?._id);
  }, [selectedTask?._id, taskRows]);

  const hasPrevTask = currentTaskIndex > 0;
  const hasNextTask = currentTaskIndex >= 0 && currentTaskIndex < taskRows.length - 1;
  const totalSubtasks = Array.isArray(viewSubtasks) ? viewSubtasks.length : 0;
  const completedSubtasks = Array.isArray(viewSubtasks)
    ? viewSubtasks.filter((item) => !!item?.isDone).length
    : 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const goToPrevTask = () => {
    if (hasPrevTask) {
      setSelectedTask(taskRows[currentTaskIndex - 1]);
    }
  };

  const goToNextTask = () => {
    if (hasNextTask) {
      setSelectedTask(taskRows[currentTaskIndex + 1]);
    }
  };

  if (!open) {
    return null;
  }

  const handleCloseTaskModal = () => {
    onClose();
  };

  return (
    <>
      <EResponse
        error={updateTaskResponse?.error?.data?.message}
        Response={updateTaskResponse}
        type={"update"}
      />
      <CustomModel
        performCancel={handleCloseTaskModal}
        width={"70vw"}
        height={"75vh"}
        variant="classicProfile"
        showCloseIcon={false}
      >
        <div
          style={{
            borderRadius: "14px",
            border: "1px solid #dbe3ef",
            overflow: "hidden",
            background: "#ffffff",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.14)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              padding: "16px 20px 14px",
              background: "linear-gradient(180deg, #0b73b8, #0a67a4)",
              borderBottom: "1px solid #0d5f95",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "29px", fontWeight: 700, color: "#f8fbff", lineHeight: 1.1 }}>
                Task Details
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                <HeaderChip label={`Stage: ${viewTaskStage || "-"}`} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  color: "#eff6ff",
                  fontSize: "12px",
                  background: "rgba(255,255,255,0.15)",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.28)",
                  fontWeight: 600,
                }}
              >
                {currentTaskIndex >= 0 ? `${currentTaskIndex + 1} / ${taskRows.length}` : "1 / 1"}
              </span>
              <button
                type="button"
                onClick={handleCloseTaskModal}
                aria-label="Close task details"
                title="Close"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-14px) scale(1.04)";
                  e.currentTarget.style.background = "#b91c1c";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(185, 28, 28, 0.42)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1)";
                  e.currentTarget.style.background = "#dc2626";
                  e.currentTarget.style.boxShadow = "0 6px 14px rgba(220, 38, 38, 0.35)";
                }}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.45)",
                  background: "#dc2626",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transform: "translateY(-12px)",
                  transition: "transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "0 6px 14px rgba(220, 38, 38, 0.35)",
                }}
              >
                <CloseOutlined />
              </button>
            </div>
          </div>

          <div
            className="view-modal-scroll"
            style={{
              padding: "16px",
              display: "grid",
              gap: "12px",
              background: "#f8fafc",
              flex: 1,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "12px",
              }}
            >
              <InfoRow label="Title" value={selectedTask?.title} />
              <div
                style={{
                  border: "1px solid #d4e1f7",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
                  boxShadow: "0 8px 20px rgba(18, 53, 109, 0.08)",
                }}
              >
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Stage</div>
                <select
                  value={viewTaskStage}
                  onChange={(e) => {
                    setViewTaskStage(e.target.value);
                    setStageDirty(true);
                  }}
                  disabled={!canEditTaskStage}
                  style={{
                    width: "100%",
                    border: "1px solid #d4e1f7",
                    borderRadius: "10px",
                    padding: "9px 11px",
                    outline: "none",
                    fontSize: "14px",
                    color: "#0f172a",
                    background: canEditTaskStage ? "#fff" : "#f1f5f9",
                    cursor: canEditTaskStage ? "pointer" : "not-allowed",
                  }}
                >
                  <option value="" disabled>
                    Select Stage
                  </option>
                  {TaskStage.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: "6px", fontSize: "12px", color: "#64748b" }}>
                  {!canEditTaskStage
                    ? "Read only"
                    : stageSaveState === "saving"
                    ? "Saving..."
                    : stageSaveState === "saved"
                    ? "Saved"
                    : stageSaveState === "error"
                    ? "Save failed"
                    : "Changes auto-save"}
                </div>
              </div>
              <InfoRow
                label="Created At"
                value={selectedTask?.createdAt ? new Date(selectedTask.createdAt).toLocaleString() : "-"}
              />
              <InfoRow
                label="Task Status"
                value={viewTaskDone ? "Completed" : "Pending"}
              />
              <InfoRow
                label="Assigned To"
                value={Array.isArray(selectedTask?.assignedTo) && selectedTask.assignedTo.length > 0
                  ? selectedTask.assignedTo.map((item) => item?.name).filter(Boolean).join(", ")
                  : "-"}
              />
              <InfoRow label="Created By" value={selectedTask?.createdBy?.name} />
              <InfoRow
                label="Due Date"
                value={selectedTask?.dueDate ? new Date(selectedTask.dueDate).toLocaleString() : "-"}
              />
            </div>

            <InfoBlock label="Description" value={selectedTask?.description} />

            <div
              style={{
                border: "1px solid #d4e1f7",
                borderRadius: "14px",
                padding: "14px 15px",
                background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
                boxShadow: "0 8px 20px rgba(18, 53, 109, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>Task Todo / Subtasks</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {canManageSubtasks && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [
                          ...(Array.isArray(viewSubtasks) ? viewSubtasks : []),
                          { title: "", isDone: false, assignedTo: "" },
                        ];
                        setViewSubtasks(next);
                        setSubtasksDirty(true);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.background = "#eff6ff";
                        e.currentTarget.style.borderColor = "#93c5fd";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(59, 130, 246, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.borderColor = "#c8dafc";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      style={{
                        border: "1px solid #c8dafc",
                        background: "#fff",
                        color: "#0b6bf4",
                        borderRadius: "8px",
                        padding: "5px 9px",
                        fontWeight: 600,
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "none",
                      }}
                    >
                      + Add
                    </button>
                  )}
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {subtasksSaveState === "saving"
                      ? "Saving..."
                      : subtasksSaveState === "saved"
                      ? "Saved"
                      : subtasksSaveState === "error"
                      ? "Save failed"
                      : "Changes auto-save"}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                  <span>Progress</span>
                  <span>{completedSubtasks} / {totalSubtasks}</span>
                </div>
                <div
                  style={{
                    marginTop: "6px",
                    height: "8px",
                    borderRadius: "999px",
                    background: "#e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${subtaskProgress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #0ea5e9, #22c55e)",
                      transition: "width 0.2s ease",
                    }}
                  />
                </div>
              </div>

              {(!Array.isArray(viewSubtasks) || viewSubtasks.length === 0) && (
                <div style={{ marginTop: "10px", fontSize: "13px", color: "#64748b" }}>
                  No subtasks added.
                </div>
              )}

              {(Array.isArray(viewSubtasks) ? viewSubtasks : []).map((item, index) => {
                const assignedName = "Task assignees";
                const canToggle = canToggleSubtask(item);
                return (
                  <div
                    key={item?._id || index}
                    style={{
                      marginTop: "10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "#ffffff",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!item?.isDone}
                      disabled={!canToggle}
                      onChange={(e) => {
                        if (!canToggle) {
                          return;
                        }
                        const list = [...viewSubtasks];
                        list[index] = { ...list[index], isDone: e.target.checked };
                        setViewSubtasks(list);
                        setSubtasksDirty(true);
                      }}
                      style={{ width: "16px", height: "16px", accentColor: "#0b6bf4" }}
                    />
                    <div style={{ flex: 1 }}>
                      {canManageSubtasks ? (
                        <div>
                          <input
                            type="text"
                            value={item?.title || ""}
                            placeholder="Subtask title"
                            onChange={(e) => {
                              const list = [...viewSubtasks];
                              list[index] = { ...list[index], title: e.target.value };
                              setViewSubtasks(list);
                              setSubtasksDirty(true);
                            }}
                            style={{
                              border: "1px solid #d4e1f7",
                              borderRadius: "8px",
                              padding: "8px 10px",
                              fontSize: "14px",
                            }}
                          />
                          <div style={{ marginTop: "5px", fontSize: "12px", color: "#64748b" }}>
                            Assigned: {assignedName}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: item?.isDone ? "#64748b" : "#0f172a",
                              textDecoration: item?.isDone ? "line-through" : "none",
                            }}
                          >
                            {item?.title || "-"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            Assigned: {assignedName}
                          </div>
                        </>
                      )}
                    </div>
                    {canManageSubtasks && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = viewSubtasks.filter((_, idx) => idx !== index);
                          setViewSubtasks(next);
                          setSubtasksDirty(true);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.background = "#ffe4e6";
                          e.currentTarget.style.borderColor = "#fda4af";
                          e.currentTarget.style.boxShadow = "0 6px 12px rgba(190, 24, 93, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.background = "#fff1f2";
                          e.currentTarget.style.borderColor = "#fecaca";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        style={{
                          border: "1px solid #fecaca",
                          background: "#fff1f2",
                          color: "#be123c",
                          borderRadius: "8px",
                          padding: "6px 8px",
                          fontWeight: 600,
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: "none",
                        }}
                      >
                        Remove
                      </button>
                    )}
                    {!canToggle && (
                      <span style={{ fontSize: "11px", color: "#64748b" }}>Read only</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                border: "1px solid #d4e1f7",
                borderRadius: "14px",
                padding: "14px 15px",
                background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
                boxShadow: "0 8px 20px rgba(18, 53, 109, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  checked={!!viewTaskDone}
                  disabled={!canEditTaskDone}
                  onChange={(e) => {
                    if (!canEditTaskDone) {
                      return;
                    }
                    const checked = e.target.checked;
                    if (checked && viewTaskStage !== "Completed") {
                      setTaskDoneStageError("Please change stage to Completed before marking task done");
                      return;
                    }
                    setTaskDoneStageError("");
                    setViewTaskDone(checked);
                    setTaskDoneDirty(true);
                    if (!checked) {
                      setViewOutcome("");
                      setOutcomeError("");
                    }
                  }}
                  style={{ width: "16px", height: "16px", accentColor: "#0b6bf4" }}
                />
                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>Task Done</span>
                <span style={{ marginLeft: "auto", fontSize: "12px", color: "#64748b" }}>
                  {canEditTaskDone
                    ? taskDoneSaveState === "saving"
                      ? "Saving..."
                      : taskDoneSaveState === "saved"
                      ? "Saved"
                      : taskDoneSaveState === "error"
                      ? "Save failed"
                      : "Changes auto-save"
                    : "Read only"}
                </span>
              </div>
              {taskDoneStageError && (
                <div style={{ marginTop: "6px", fontSize: "12px", color: "#b91c1c" }}>
                  {taskDoneStageError}
                </div>
              )}

              {viewTaskDone && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Outcome</div>
                  <div
                    style={{
                      display: "inline-block",
                      marginBottom: "8px",
                      padding: "3px 8px",
                      borderRadius: "999px",
                      background: "#fff1f2",
                      border: "1px solid #fecdd3",
                      color: "#9f1239",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    Required
                  </div>
                  <textarea
                    value={viewOutcome}
                    onChange={(e) => {
                      if (!canEditTaskDone) {
                        return;
                      }
                      setViewOutcome(e.target.value);
                      setTaskDoneDirty(true);
                      if (String(e.target.value || "").trim()) {
                        setOutcomeError("");
                      }
                    }}
                    rows={3}
                    placeholder="Enter task outcome"
                    disabled={!canEditTaskDone}
                    style={{
                      width: "100%",
                      border: outcomeError ? "1px solid #ef4444" : "1px solid #d4e1f7",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      outline: "none",
                      resize: "vertical",
                      fontSize: "14px",
                      color: "#0f172a",
                      background: "#fff",
                    }}
                  />
                  {outcomeError && (
                    <div style={{ marginTop: "5px", fontSize: "12px", color: "#b91c1c" }}>
                      {outcomeError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedTask?.dynamicFields && Object.keys(selectedTask.dynamicFields).length > 0 && (
              <div
                style={{
                  border: "1px solid #e6ecf5",
                  borderRadius: "12px",
                  padding: "14px",
                  background: "#fafcff",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "10px", color: "#0f172a" }}>
                  Additional Fields
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {Object.entries(selectedTask.dynamicFields).map(([key, value]) => (
                    <InfoRow key={key} label={key} value={Array.isArray(value) ? value.join(", ") : value} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid #dbe3ef",
              background: "#ffffff",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <NavButton
                onClick={goToPrevTask}
                disabled={!hasPrevTask}
                icon={<LeftOutlined />}
                label="Previous"
              />
              <NavButton
                onClick={goToNextTask}
                disabled={!hasNextTask}
                icon={<RightOutlined />}
                label="Next"
              />
            </div>
            <button
              type="button"
              onClick={handleCloseTaskModal}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "linear-gradient(180deg, #ffe4e6 0%, #fecdd3 100%)";
                e.currentTarget.style.borderColor = "#f87171";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(185, 28, 28, 0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "linear-gradient(180deg, #fff5f5 0%, #ffe4e6 100%)";
                e.currentTarget.style.borderColor = "#fca5a5";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(185, 28, 28, 0.14)";
              }}
              style={{
                height: "40px",
                padding: "0 18px",
                borderRadius: "8px",
                border: "1px solid #fca5a5",
                background: "linear-gradient(180deg, #fff5f5 0%, #ffe4e6 100%)",
                color: "#b91c1c",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(185, 28, 28, 0.14)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </CustomModel>
    </>
  );
};

const InfoRow = ({ label, value }) => (
  <div
    style={{
      border: "1px solid #dde5f1",
      borderRadius: "12px",
      padding: "12px 14px",
      background: "#ffffff",
      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
    }}
  >
    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>{label}</div>
    <div style={{ fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>{value || "-"}</div>
  </div>
);

const InfoBlock = ({ label, value }) => (
  <div
    style={{
      border: "1px solid #dde5f1",
      borderRadius: "12px",
      padding: "14px 15px",
      background: "#ffffff",
      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
    }}
  >
    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{label}</div>
    <div style={{ fontSize: "14px", color: "#0f172a", lineHeight: 1.6 }}>{value || "-"}</div>
  </div>
);

const HeaderChip = ({ label }) => (
  <span
    style={{
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      background: "rgba(255,255,255,0.2)",
      border: "1px solid rgba(255,255,255,0.34)",
      color: "#f8fbff",
    }}
  >
    {label}
  </span>
);

const NavButton = ({ onClick, disabled, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    onMouseEnter={(e) => {
      if (disabled) {
        return;
      }
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 8px 16px rgba(15, 23, 42, 0.14)";
      e.currentTarget.style.borderColor = "#94a3b8";
    }}
    onMouseLeave={(e) => {
      if (disabled) {
        return;
      }
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#cbd5e1";
    }}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      height: "40px",
      padding: "0 14px",
      borderRadius: "8px",
      border: disabled ? "1px solid #e2e8f0" : "1px solid #cbd5e1",
      background: disabled ? "#f8fafc" : "#ffffff",
      color: disabled ? "#94a3b8" : "#0f172a",
      fontWeight: 600,
      fontSize: "14px",
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: "none",
      transition: "all 0.2s ease",
    }}
  >
    {icon}
    {label}
  </button>
);

export default TaskViewModal;
