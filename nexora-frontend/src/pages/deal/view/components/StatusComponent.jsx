import { Button, Input } from "antd";
import React, { useState } from "react";
import { useFetchLeadStatusQuery } from "../../../../features/allApi";
import EResponse from "../../../../atoms/response/EResponse";
import { dealStagesArrayReason } from "../../../../atoms/State";

const StatusComponent = ({
  styles,
  updateLead,
  data,
  GetUpdateLeadResponse,
}) => {
  const [showReason, setShowReason] = useState(false);
  const [structData, setStructData] = useState();
  const [reasonText, setReasonText] = useState();
  const performCancel = () => {
    setShowReason(false);
    setStructData();
    setReasonText();
  };
  const handleStatusChange = (status) => {
    if (status?.reason) {
      setStructData({
        _id: data?._id,
        dealStages: status?.name,
      });
      setShowReason(true);
    } else {
      const structure = {
        _id: data?._id,
        dealStages: status?.name,

        reason: "",
      };
      updateLead(structure);
    }
  };
  const handleSubmit = () => {
    const structure = {
      ...structData,
      reason: reasonText,
    };
    updateLead(structure);
  };

  return (
    <div style={styles.statusContainer}>
      <EResponse
        error={GetUpdateLeadResponse?.error?.data?.message}
        Response={GetUpdateLeadResponse}
        type={"update"}
        cancel={performCancel}
      />
      <span style={styles.statusLabel}>Status:</span>

      <div style={styles.statusBar}>
        {dealStagesArrayReason?.map((item) => (
          <span
            onClick={() => handleStatusChange(item)}
            style={
              data?.dealStages === item?.name
                ? styles.status
                : styles.statusConnector
            }
          >
            {item?.name} {item?.reason && <>*</>}
          </span>
        ))}
      </div>
      {showReason ? (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            gap: "5px",
            alignItems: "end",
          }}
        >
          <div>
            <label>Reason </label>
            <Input onChange={(e) => setReasonText(e.target.value)} />
          </div>
          <Button onClick={() => handleSubmit()}>Submit</Button>
        </div>
      ) : (
        <div>
          {data?.reason ? (
            <>
              <b>Reason :</b>
              {data?.reason}
            </>
          ) : null}
        </div>
      )}
      {/* <StepIndicator/> */}
    </div>
  );
};

export default StatusComponent;
