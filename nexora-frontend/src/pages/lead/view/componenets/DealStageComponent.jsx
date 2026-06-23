import React from "react";

const DealStageComponent = () => {
  // Static stages array
  const stages = [
    { _id: "new", name: "New" },
    { _id: "qualification", name: "Qualification" },
    { _id: "discovery", name: "Discovery" },
    { _id: "demo", name: "Demo" },
    { _id: "negotiation", name: "Negotiation" },
    { _id: "won", name: "Won" },
    { _id: "lost", name: "Lost" } // Static list, no need for 'reason' property
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "10px" }}>
        <strong>Status:</strong>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {stages.map((stage) => (
          <span
            key={stage._id}
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: "#f5f5f5",
            }}
          >
            {stage.name}
          </span>
        ))}
      </div>

      {/* Static reason display section */}
      <div style={{ marginTop: "20px" }}>
        <div>
          <b>Reason:</b> Sample reason text for the "Lost" stage.
        </div>
      </div>
    </div>
  );
};

export default DealStageComponent;
