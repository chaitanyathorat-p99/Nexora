import React from "react";
import "./aiAssistantAvatar.css";

const AnimatedAIAssistant = ({ state = "idle", size = 40, className = "" }) => {
  return (
    <div
      className={`ai-assistant-avatar ${className}`}
      data-state={state}
      style={{ "--ai-avatar-size": `${size}px` }}
      aria-label={`AI assistant ${state}`}
      role="img"
    >
      <div className="ai-assistant-avatar__shell">
        <span className="ai-assistant-avatar__ring" />
        <span className="ai-assistant-avatar__spark ai-assistant-avatar__spark--one" />
        <span className="ai-assistant-avatar__spark ai-assistant-avatar__spark--two" />
        <span className="ai-assistant-avatar__spark ai-assistant-avatar__spark--three" />

        <svg viewBox="0 0 100 100" className="ai-assistant-avatar__svg" aria-hidden="true">
          <defs>
            <radialGradient id="aiAvatarGlow" cx="50%" cy="38%" r="68%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.48" />
              <stop offset="58%" stopColor="#1e293b" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="aiAvatarBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="44" fill="url(#aiAvatarGlow)" />
          <circle cx="50" cy="50" r="34" fill="url(#aiAvatarBody)" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.4" />

          <path
            className="ai-assistant-avatar__brow ai-assistant-avatar__brow--left"
            d="M35 37 C39 33, 45 33, 48 36"
            fill="none"
            stroke="rgba(255,255,255,0.54)"
            strokeLinecap="round"
            strokeWidth="2.3"
          />
          <path
            className="ai-assistant-avatar__brow ai-assistant-avatar__brow--right"
            d="M52 36 C55 33, 61 33, 65 37"
            fill="none"
            stroke="rgba(255,255,255,0.54)"
            strokeLinecap="round"
            strokeWidth="2.3"
          />

          <g className="ai-assistant-avatar__eye ai-assistant-avatar__eye--left">
            <ellipse cx="39" cy="49" rx="8.2" ry="10.2" fill="rgba(255,255,255,0.95)" />
            <circle className="ai-assistant-avatar__pupil" cx="39" cy="49" r="3.7" fill="#0f172a" />
            <circle className="ai-assistant-avatar__shine" cx="37.6" cy="47.3" r="1.1" fill="rgba(255,255,255,0.9)" />
          </g>

          <g className="ai-assistant-avatar__eye ai-assistant-avatar__eye--right">
            <ellipse cx="61" cy="49" rx="8.2" ry="10.2" fill="rgba(255,255,255,0.95)" />
            <circle className="ai-assistant-avatar__pupil" cx="61" cy="49" r="3.7" fill="#0f172a" />
            <circle className="ai-assistant-avatar__shine" cx="59.6" cy="47.3" r="1.1" fill="rgba(255,255,255,0.9)" />
          </g>

          <path
            className="ai-assistant-avatar__mouth ai-assistant-avatar__mouth--idle"
            d="M42 63 C46 66, 54 66, 58 63"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeLinecap="round"
            strokeWidth="2.2"
          />
          <path
            className="ai-assistant-avatar__mouth ai-assistant-avatar__mouth--success"
            d="M43 62 C47 68, 53 68, 57 62"
            fill="none"
            stroke="#86efac"
            strokeLinecap="round"
            strokeWidth="2.4"
          />
          <path
            className="ai-assistant-avatar__mouth ai-assistant-avatar__mouth--error"
            d="M43 65 C47 61, 53 61, 57 65"
            fill="none"
            stroke="#fca5a5"
            strokeLinecap="round"
            strokeWidth="2.4"
          />

          <path
            className="ai-assistant-avatar__check"
            d="M40 54 L46 60 L60 45"
            fill="none"
            stroke="#bbf7d0"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.4"
          />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedAIAssistant;