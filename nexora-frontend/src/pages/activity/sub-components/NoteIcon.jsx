import React from 'react';
import { BiNotepad } from "react-icons/bi";
import { GoChecklist } from "react-icons/go";

const NoteIcon = () => {
    return (
        <div style={{
            backgroundColor: "#1e90ff", // Light grey background
            borderRadius: "50%", // Makes it circular
            display: "flex", // Flexbox to center the icon
            justifyContent: "center", // Centers horizontally
            alignItems: "center", // Centers vertically
            width: "40px", // Define width for the circle
            height: "40px", // Define height for the circle
            // position: "absolute",
            right: "0",
            top: "0",
            margin: "10px",
            cursor: "pointer",
            animation: "bounce 2s infinite, pulse 1.5s infinite"
        }}>
            <GoChecklist
                style={{
                    fontSize: "20px",
                    color: "#fff",
                }}
            />
        </div>
    );
};

export default NoteIcon;

const styles = document.createElement('style');
styles.innerHTML = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(2px); /* Bounce height */
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 10px rgba(30, 144, 255, 0.7), 0 0 20px rgba(30, 144, 255, 0.5), 0 0 30px rgba(30, 144, 255, 0.1);
    }
    50% {
      box-shadow: 0 0 20px rgba(30, 144, 255, 0.7), 0 0 40px rgba(30, 144, 255, 0.5), 0 0 60px rgba(30, 144, 255, 0.1);
    }
    100% {
      box-shadow: 0 0 10px rgba(30, 144, 255, 0.7), 0 0 20px rgba(30, 144, 255, 0.5), 0 0 30px rgba(30, 144, 255, 0.1);
    }
  }
`;
document.head.appendChild(styles);
