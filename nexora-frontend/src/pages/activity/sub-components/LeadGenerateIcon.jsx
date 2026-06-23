import React from 'react';
import { RiAiGenerate } from 'react-icons/ri';

const LeadGenerateIcon = () => {
    return (
        <div>
            <div style={{
                backgroundColor: "#1e90ff", // Blue color background
                borderRadius: "50%", // Circular shape
                display: "flex", // Flexbox to center the icon
                justifyContent: "center", // Centers horizontally
                alignItems: "center", // Centers vertically
                width: "50px", // Define width for the circle
                height: "50px", // Define height for the circle
                margin: "10px",
                cursor: "pointer",
                position: "relative",
                animation: "2s infinite, pulse 1.5s infinite" // Combined animations
            }}>
                <RiAiGenerate
                    style={{
                        fontSize: "20px",
                        color: "#fff", // White icon color for contrast
                    }}
                />
            </div>
        </div>
    );
};

export default LeadGenerateIcon;

// Add CSS keyframes for bouncing and pulsing animations
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
