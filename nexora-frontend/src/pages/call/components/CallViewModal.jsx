import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useFetchUserQuery, useUpdateCallMutation } from "../../../features/allApi";
import { checkAccess, hasFeature } from "../../../atoms/static";
import CustomModel from "../../../atoms/model/CustomModel";
import EResponse from "../../../atoms/response/EResponse";

const modelName = "Call";

const CallViewModal = ({ open, onClose, selectedCall, setSelectedCall, callRows, user }) => {
  const [updateCall, updateCallResponse] = useUpdateCallMutation();
  const { data: systemUsers } = useFetchUserQuery({ type: "userType=System" });
  const [viewCallDone, setViewCallDone] = useState(false);
  const [viewOutcome, setViewOutcome] = useState("");
  const [viewCallNote, setViewCallNote] = useState("");
  const [outcomeError, setOutcomeError] = useState("");
  const saveTimeoutRef = useRef(null);
  const lastOutcomeToastRef = useRef(0);

  const canEditCallView =
    checkAccess(user, modelName, "update") ||
    checkAccess(user, modelName, "write") ||
    checkAccess(user, modelName, "special") ||
    hasFeature(user, modelName);

  useEffect(() => {
    setViewCallDone(!!selectedCall?.callDone);
    setViewOutcome(selectedCall?.outcome || "");
    setViewCallNote(selectedCall?.callNote || "");
    setOutcomeError("");
  }, [selectedCall?._id]);

  useEffect(() => {
    if (!open) {
      return;
    }

    updateCallResponse?.reset?.();
  }, [open, selectedCall?._id]);

  const persistCallChanges = useCallback(async () => {
    if (!canEditCallView || !selectedCall?._id) {
      return;
    }

    const originalCallDone = !!selectedCall?.callDone;
    const originalOutcome = selectedCall?.outcome || "";
    const originalCallNote = selectedCall?.callNote || "";
    const normalizedViewOutcome = String(viewOutcome || "").trim();
    const normalizedOriginalOutcome = String(originalOutcome || "").trim();
    const normalizedViewCallNote = String(viewCallNote || "").trim();
    const normalizedOriginalCallNote = String(originalCallNote || "").trim();

    const payload = {
      _id: selectedCall._id,
      callDone: viewCallDone,
      outcome: viewCallDone ? normalizedViewOutcome : "",
      callNote: normalizedViewCallNote,
    };

    const hasCallDoneChanged = payload.callDone !== originalCallDone;
    const hasOutcomeChanged = payload.outcome !== (originalCallDone ? normalizedOriginalOutcome : "");
    const hasCallNoteChanged = payload.callNote !== normalizedOriginalCallNote;

    if (!hasCallDoneChanged && !hasOutcomeChanged && !hasCallNoteChanged) {
      return;
    }

    try {
      await updateCall(payload).unwrap();
      setSelectedCall((prev) => {
        if (!prev || prev?._id !== payload._id) {
          return prev;
        }

        return {
          ...prev,
          callDone: payload.callDone,
          outcome: payload.outcome,
          callNote: payload.callNote,
        };
      });
    } catch (e) {
      // EResponse handles the error surface.
    }
  }, [
    canEditCallView,
    selectedCall?._id,
    selectedCall?.callDone,
    selectedCall?.callNote,
    selectedCall?.outcome,
    setSelectedCall,
    updateCall,
    viewCallDone,
    viewCallNote,
    viewOutcome,
  ]);

  const validateOutcomeBeforeNavigate = useCallback(() => {
    if (viewCallDone && !String(viewOutcome || "").trim()) {
      setOutcomeError("Outcome is required when call is marked done");
      const now = Date.now();
      if (now - lastOutcomeToastRef.current > 1500) {
        message.error("Outcome is required when Call Done is checked");
        lastOutcomeToastRef.current = now;
      }
      return false;
    }
    setOutcomeError("");
    return true;
  }, [viewCallDone, viewOutcome]);

  useEffect(() => {
    if (!canEditCallView || !selectedCall?._id) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      persistCallChanges();
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [canEditCallView, persistCallChanges, selectedCall?._id, viewCallDone, viewCallNote, viewOutcome]);

  const currentCallIndex = useMemo(() => {
    if (!selectedCall?._id) {
      return -1;
    }
    return callRows.findIndex((item) => item?._id === selectedCall?._id);
  }, [callRows, selectedCall?._id]);

  const hasPrevCall = currentCallIndex > 0;
  const hasNextCall = currentCallIndex >= 0 && currentCallIndex < callRows.length - 1;

  const goToPrevCall = async () => {
    if (hasPrevCall) {
      if (!validateOutcomeBeforeNavigate()) {
        return;
      }
      await persistCallChanges();
      setSelectedCall(callRows[currentCallIndex - 1]);
    }
  };

  const goToNextCall = async () => {
    if (hasNextCall) {
      if (!validateOutcomeBeforeNavigate()) {
        return;
      }
      await persistCallChanges();
      setSelectedCall(callRows[currentCallIndex + 1]);
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

  const handleCloseCallModal = async () => {
    if (!validateOutcomeBeforeNavigate()) {
      return;
    }
    await persistCallChanges();
    setViewCallDone(false);
    setViewOutcome("");
    setViewCallNote("");
    onClose();
  };

  return (
    <>
      <EResponse
        error={updateCallResponse?.error?.data?.message}
        Response={updateCallResponse}
        type={"update"}
      />
      <CustomModel
        performCancel={handleCloseCallModal}
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
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "29px", fontWeight: 700, color: "#f8fbff", lineHeight: 1.1 }}>
                Call Details
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                <HeaderChip
                  label={selectedCall?.callDone ? "Completed" : "Pending"}
                  tone={selectedCall?.callDone ? "success" : "warning"}
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
                {currentCallIndex >= 0 ? `${currentCallIndex + 1} / ${callRows.length}` : "1 / 1"}
              </span>
              <button
                type="button"
                onClick={handleCloseCallModal}
                aria-label="Close call details"
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
              gap: "16px",
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
              <InfoRow label="Title" value={selectedCall?.title} />
              <InfoRow label="Call Status" value={selectedCall?.callDone ? "Completed" : "Pending"} />
              <InfoRow
                label="Lead"
                value={selectedCall?.lead
                  ? `${selectedCall?.lead?.firstName || ""} ${selectedCall?.lead?.lastName || ""}`.trim()
                  : "-"}
              />
              <InfoRow label="Assigned To" value={formatAssignedTo(selectedCall?.assignedTo)} />
              <InfoRow
                label="Created By"
                value={selectedCall?.createdBy?.name || selectedCall?.createdBy?.username || "-"}
              />
              <InfoRow
                label="Due Date"
                value={selectedCall?.dueDate ? new Date(selectedCall.dueDate).toLocaleString() : "-"}
              />
              <InfoRow
                label="Created At"
                value={selectedCall?.createdAt ? new Date(selectedCall.createdAt).toLocaleString() : "-"}
              />
            </div>

            <InfoBlock label="Description" value={selectedCall?.desc} />

            <div
              style={{
                border: "1px solid #d4e1f7",
                borderRadius: "14px",
                padding: "14px 15px",
                background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
                boxShadow: "0 8px 20px rgba(18, 53, 109, 0.08)",
              }}
            >
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>Call Note</div>
              <textarea
                value={viewCallNote}
                onChange={(e) => {
                  if (!canEditCallView) {
                    return;
                  }
                  setViewCallNote(e.target.value);
                }}
                placeholder="Enter call notes"
                rows={3}
                disabled={!canEditCallView}
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
                {canEditCallView ? "Auto-saves after 3 seconds" : "Read only"}
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
                checked={!!viewCallDone}
                disabled={!canEditCallView}
                onChange={(e) => {
                  if (!canEditCallView) {
                    return;
                  }
                  const checked = e.target.checked;
                  setViewCallDone(checked);
                  if (!checked) {
                    setViewOutcome("");
                  }
                }}
                style={{ width: "16px", height: "16px", accentColor: "#0b6bf4" }}
              />
              <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>
                Call Done
              </span>
              <span style={{ marginLeft: "auto", fontSize: "12px", color: "#64748b" }}>
                {canEditCallView ? "Auto-saves after 3 seconds" : "Read only"}
              </span>
            </div>

            {viewCallDone && (
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
                <textarea
                  value={viewOutcome}
                  onChange={(e) => {
                    if (!canEditCallView) {
                      return;
                    }
                    setViewOutcome(e.target.value);
                    if (String(e.target.value || "").trim()) {
                      setOutcomeError("");
                    }
                  }}
                  placeholder="Enter call outcome"
                  rows={4}
                  disabled={!canEditCallView}
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

            {selectedCall?.dynamicFields && Object.keys(selectedCall.dynamicFields).length > 0 && (
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
                  {Object.entries(selectedCall.dynamicFields).map(([key, value]) => (
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
                onClick={goToPrevCall}
                disabled={!hasPrevCall}
                icon={<LeftOutlined />}
                label="Previous"
              />
              <NavButton
                onClick={goToNextCall}
                disabled={!hasNextCall}
                icon={<RightOutlined />}
                label="Next"
              />
            </div>
            <button
              type="button"
              onClick={handleCloseCallModal}
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

export default CallViewModal;
