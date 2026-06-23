import React, { useEffect, useMemo, useRef, useState } from "react";
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useFetchUserQuery, useUpdateMeetingMutation } from "../../../features/allApi";
import { checkAccess } from "../../../atoms/static";
import CustomModel from "../../../atoms/model/CustomModel";
import EResponse from "../../../atoms/response/EResponse";

const modelName = "Meeting";

const MeetingViewModal = ({ open, onClose, selectedMeeting, setSelectedMeeting, meetingRows, user }) => {
  const [updateMeeting, updateMeetingResponse] = useUpdateMeetingMutation();
  const { data: systemUsers } = useFetchUserQuery({ type: `userType=System` });
  const [viewMeetingDone, setViewMeetingDone] = useState(false);
  const [viewOutcome, setViewOutcome] = useState("");
  const [viewMeetingNote, setViewMeetingNote] = useState("");
  const [outcomeError, setOutcomeError] = useState("");
  const lastOutcomeToastRef = useRef(0);

  const canEditMeetingView =
    checkAccess(user, modelName, "update") ||
    checkAccess(user, modelName, "write") ||
    checkAccess(user, modelName, "special");

  useEffect(() => {
    setViewMeetingDone(!!selectedMeeting?.meetingDone);
    setViewOutcome(selectedMeeting?.outcome || "");
    setViewMeetingNote(selectedMeeting?.meetingNote || "");
    setOutcomeError("");
  }, [selectedMeeting?._id]);

  useEffect(() => {
    if (!open) {
      return;
    }

    // Clear stale mutation state so opening the modal does not replay old success toasts.
    updateMeetingResponse?.reset?.();
  }, [open, selectedMeeting?._id]);

  useEffect(() => {
    if (!canEditMeetingView || !selectedMeeting?._id) {
      return;
    }

    const originalMeetingDone = !!selectedMeeting?.meetingDone;
    const originalOutcome = selectedMeeting?.outcome || "";
    const originalMeetingNote = selectedMeeting?.meetingNote || "";
    const normalizedViewOutcome = String(viewOutcome || "").trim();
    const normalizedOriginalOutcome = String(originalOutcome || "").trim();
    const normalizedViewMeetingNote = String(viewMeetingNote || "").trim();
    const normalizedOriginalMeetingNote = String(originalMeetingNote || "").trim();

    const hasMeetingDoneChanged = viewMeetingDone !== originalMeetingDone;
    const hasOutcomeChanged =
      (viewMeetingDone ? normalizedViewOutcome : "") !==
      (originalMeetingDone ? normalizedOriginalOutcome : "");
    const hasMeetingNoteChanged = normalizedViewMeetingNote !== normalizedOriginalMeetingNote;

    if (!hasMeetingDoneChanged && !hasOutcomeChanged && !hasMeetingNoteChanged) {
      return;
    }

    if (viewMeetingDone && !normalizedViewOutcome) {
      setOutcomeError("Outcome is required when meeting is marked done");
      const now = Date.now();
      if (now - lastOutcomeToastRef.current > 1500) {
        message.error("Outcome is required when Meeting Done is checked");
        lastOutcomeToastRef.current = now;
      }
      return;
    }
    setOutcomeError("");

    const timeoutId = setTimeout(async () => {
      const payload = {
        _id: selectedMeeting._id,
        meetingDone: viewMeetingDone,
        outcome: viewMeetingDone ? normalizedViewOutcome : "",
        meetingNote: normalizedViewMeetingNote,
      };

      try {
        await updateMeeting(payload).unwrap();
        setSelectedMeeting((prev) => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            meetingDone: payload.meetingDone,
            outcome: payload.outcome,
            meetingNote: payload.meetingNote,
          };
        });
      } catch (e) {
        // EResponse handles the error surface.
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [
    canEditMeetingView,
    selectedMeeting?._id,
    selectedMeeting?.meetingDone,
    selectedMeeting?.meetingNote,
    selectedMeeting?.outcome,
    setSelectedMeeting,
    updateMeeting,
    viewMeetingDone,
    viewMeetingNote,
    viewOutcome,
  ]);

  const currentMeetingIndex = useMemo(() => {
    if (!selectedMeeting?._id) {
      return -1;
    }
    return meetingRows.findIndex((item) => item?._id === selectedMeeting?._id);
  }, [meetingRows, selectedMeeting?._id]);

  const hasPrevMeeting = currentMeetingIndex > 0;
  const hasNextMeeting =
    currentMeetingIndex >= 0 && currentMeetingIndex < meetingRows.length - 1;

  const goToPrevMeeting = () => {
    if (hasPrevMeeting) {
      setSelectedMeeting(meetingRows[currentMeetingIndex - 1]);
    }
  };

  const goToNextMeeting = () => {
    if (hasNextMeeting) {
      setSelectedMeeting(meetingRows[currentMeetingIndex + 1]);
    }
  };

  const formatAssignedTo = (assignedTo) => {
    if (!assignedTo) {
      return "-";
    }

    if (Array.isArray(assignedTo)) {
      const names = assignedTo
        .map((item) => item?.name || item?.username || String(item || ""))
        .filter(Boolean);
      return names.length > 0 ? names.join(", ") : "-";
    }

    if (typeof assignedTo === "object") {
      return assignedTo?.name || assignedTo?.username || assignedTo?._id || "-";
    }

    if (typeof assignedTo === "string") {
      const matchedUser = systemUsers?.data?.find((item) => item?._id === assignedTo);
      return matchedUser?.name || matchedUser?.username || assignedTo;
    }

    return String(assignedTo);
  };

  if (!open) {
    return null;
  }

  const handleCloseMeetingModal = () => {
    setViewMeetingDone(false);
    setViewOutcome("");
    setViewMeetingNote("");
    onClose();
  };

  return (
    <>
      <EResponse
        error={updateMeetingResponse?.error?.data?.message}
        Response={updateMeetingResponse}
        type={"update"}
      />
      <CustomModel
        performCancel={handleCloseMeetingModal}
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
                Meeting Details
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                <HeaderChip label={`Type: ${selectedMeeting?.meetingType || "-"}`} />
                <HeaderChip
                  label={selectedMeeting?.meetingDone ? "Completed" : "Pending"}
                  tone={selectedMeeting?.meetingDone ? "success" : "warning"}
                />
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
                {currentMeetingIndex >= 0
                  ? `${currentMeetingIndex + 1} / ${meetingRows.length}`
                  : "1 / 1"}
              </span>
              <button
                type="button"
                onClick={handleCloseMeetingModal}
                aria-label="Close meeting details"
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
              <InfoRow label="Title" value={selectedMeeting?.title} />
              <InfoRow label="Meeting Type" value={selectedMeeting?.meetingType} />
              <InfoRow label="Platform" value={selectedMeeting?.platForm} />
              <InfoRow
                label="Meeting Status"
                value={selectedMeeting?.meetingDone ? "Completed" : "Pending"}
              />
              <InfoRow
                label="Lead"
                value={selectedMeeting?.lead
                  ? `${selectedMeeting?.lead?.firstName || ""} ${selectedMeeting?.lead?.lastName || ""}`.trim()
                  : "-"}
              />
              <InfoRow
                label="Assigned To"
                value={formatAssignedTo(selectedMeeting?.assignedTo)}
              />
              <InfoRow
                label="Created By"
                value={selectedMeeting?.createdBy?.name || selectedMeeting?.createdBy?.username || "-"}
              />
              <InfoRow
                label="Due Date"
                value={selectedMeeting?.dueDate ? new Date(selectedMeeting.dueDate).toLocaleString() : "-"}
              />
              <InfoRow
                label="Created At"
                value={selectedMeeting?.createdAt ? new Date(selectedMeeting.createdAt).toLocaleString() : "-"}
              />
            </div>

            <InfoBlock label="Description" value={selectedMeeting?.desc} />
            {selectedMeeting?.meetingType === "Online" && selectedMeeting?.meetingLink && (
              <div
                style={{
                  border: "1px solid #e6ecf5",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  background: "#f8fbff",
                }}
              >
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                  Meeting Link
                </div>
                <a
                  href={selectedMeeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-primary)", fontWeight: 600, wordBreak: "break-all" }}
                >
                  {selectedMeeting.meetingLink}
                </a>
              </div>
            )}

            {selectedMeeting?.meetingType === "Offline" && selectedMeeting?.meetingLink && (
              <InfoBlock label="Address" value={selectedMeeting?.meetingLink} />
            )}

            <div
              style={{
                border: "1px solid #d4e1f7",
                borderRadius: "14px",
                padding: "14px 15px",
                background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
                boxShadow: "0 8px 20px rgba(18, 53, 109, 0.08)",
              }}
            >
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>Meeting Note</div>
              <textarea
                value={viewMeetingNote}
                onChange={(e) => {
                  if (!canEditMeetingView) {
                    return;
                  }
                  setViewMeetingNote(e.target.value);
                }}
                placeholder="Enter meeting notes"
                rows={3}
                disabled={!canEditMeetingView}
                style={{
                  width: "100%",
                  border: "1px solid #d4e1f7",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  outline: "none",
                  resize: "vertical",
                  fontSize: "14px",
                  color: "#0f172a",
                  background: "#fff",
                }}
              />
              <div style={{ marginTop: "6px", fontSize: "12px", color: "#64748b" }}>
                {canEditMeetingView ? "Auto-saves after 3 seconds" : "Read only"}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #d4e1f7",
                borderRadius: "14px",
                padding: "14px 15px",
                background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
                boxShadow: "0 8px 20px rgba(18, 53, 109, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={!!viewMeetingDone}
                disabled={!canEditMeetingView}
                onChange={(e) => {
                  if (!canEditMeetingView) {
                    return;
                  }
                  const checked = e.target.checked;
                  setViewMeetingDone(checked);
                  if (!checked) {
                    setViewOutcome("");
                    setOutcomeError("");
                  }
                }}
                style={{ width: "16px", height: "16px", accentColor: "#0b6bf4" }}
              />
              <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>
                Meeting Done
              </span>
              <span style={{ marginLeft: "auto", fontSize: "12px", color: "#64748b" }}>
                {canEditMeetingView ? "Auto-saves after 3 seconds" : "Read only"}
              </span>
            </div>

            {viewMeetingDone && (
              <div
                style={{
                  border: "1px solid #d4e1f7",
                  borderRadius: "14px",
                  padding: "14px 15px",
                  background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
                  boxShadow: "0 8px 20px rgba(18, 53, 109, 0.08)",
                }}
              >
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>Outcome</div>
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
                    if (!canEditMeetingView) {
                      return;
                    }
                    setViewOutcome(e.target.value);
                    if (String(e.target.value || "").trim()) {
                      setOutcomeError("");
                    }
                  }}
                  placeholder="Enter meeting outcome"
                  rows={4}
                  disabled={!canEditMeetingView}
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
                  <div style={{ marginTop: "6px", fontSize: "12px", color: "#b91c1c" }}>
                    {outcomeError}
                  </div>
                )}
              </div>
            )}

            {selectedMeeting?.dynamicFields && Object.keys(selectedMeeting.dynamicFields).length > 0 && (
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
                  {Object.entries(selectedMeeting.dynamicFields).map(([key, value]) => (
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
                onClick={goToPrevMeeting}
                disabled={!hasPrevMeeting}
                icon={<LeftOutlined />}
                label="Previous"
              />
              <NavButton
                onClick={goToNextMeeting}
                disabled={!hasNextMeeting}
                icon={<RightOutlined />}
                label="Next"
              />
            </div>
            <button
              type="button"
              onClick={handleCloseMeetingModal}
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
      borderRadius: "14px",
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
      borderRadius: "14px",
      padding: "14px 15px",
      background: "#ffffff",
      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
    }}
  >
    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{label}</div>
    <div style={{ fontSize: "14px", color: "#0f172a", lineHeight: 1.6 }}>{value || "-"}</div>
  </div>
);

const HeaderChip = ({ label, tone = "info" }) => {
  const chipColors = {
    info: {
      bg: "rgba(255,255,255,0.2)",
      border: "rgba(255,255,255,0.34)",
      color: "#f8fbff",
    },
    success: {
      bg: "rgba(34, 197, 94, 0.3)",
      border: "rgba(134, 239, 172, 0.54)",
      color: "#f0fdf4",
    },
    warning: {
      bg: "rgba(234, 179, 8, 0.3)",
      border: "rgba(253, 224, 71, 0.55)",
      color: "#fefce8",
    },
  };

  const colors = chipColors[tone] || chipColors.info;

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.color,
      }}
    >
      {label}
    </span>
  );
};

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
      borderRadius: "12px",
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

export default MeetingViewModal;
