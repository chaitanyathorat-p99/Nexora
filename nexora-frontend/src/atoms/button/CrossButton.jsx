import React from "react";

const CrossButton = ({ performCancel, style, label = "X" }) => {
  const defaultStyle = {
    background: "red",
    color: "white",
    width: "40px",
    height: "40px",
    borderRadius: "360px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "-20px",
    right: "-20px",
    cursor: "pointer",
  };

  return (
    <div
      onClick={performCancel}
      style={{
        ...defaultStyle,
        ...(style || {}),
      }}
    >
      {label}
    </div>
  );
};

export default CrossButton;
