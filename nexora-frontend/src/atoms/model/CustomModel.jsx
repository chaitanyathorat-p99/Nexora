import React from 'react'
import './model.css'
import CrossButton from '../button/CrossButton'
import LoadingHV from '../loading/LoadingHV'

const variantStyleMap = {
  default: {
    overlay: {
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'none',
    },
    shell: {
      background: '#ffffff',
      borderRadius: '5px',
      border: 'none',
      boxShadow: 'none',
      overflow: 'visible',
      animation: 'none',
    },
    content: {
      padding: '20px',
    },
    close: {
      background: 'red',
      color: '#ffffff',
      border: 'none',
      boxShadow: 'none',
    },
    glow: null,
    ornament: null,
  },
  callPremium: {
    overlay: {
      background:
        'radial-gradient(circle at 6% 12%, rgba(59, 130, 246, 0.32), transparent 34%), radial-gradient(circle at 95% 85%, rgba(14, 165, 233, 0.26), transparent 36%), rgba(2, 9, 23, 0.82)',
      backdropFilter: 'blur(12px)',
    },
    shell: {
      background: 'linear-gradient(160deg, rgba(3, 12, 28, 0.94), rgba(8, 27, 52, 0.88))',
      borderRadius: '28px',
      border: '1px solid rgba(125, 211, 252, 0.42)',
      boxShadow: '0 38px 96px rgba(1, 10, 28, 0.66), inset 0 1px 0 rgba(186, 230, 253, 0.25)',
      overflow: 'hidden',
      animation: 'premiumModalIn 0.34s cubic-bezier(.2,.84,.26,1)',
    },
    content: {
      padding: '0',
    },
    close: {
      background: 'linear-gradient(135deg, rgba(8, 47, 73, 0.95), rgba(3, 105, 161, 0.85))',
      color: '#e0f2fe',
      border: '1px solid rgba(125, 211, 252, 0.48)',
      boxShadow: '0 12px 24px rgba(2, 24, 46, 0.55)',
    },
    glow: {
      top: '-140px',
      right: '-70px',
      width: '320px',
      height: '320px',
      background: 'radial-gradient(circle, rgba(56, 189, 248, 0.26), rgba(2, 132, 199, 0) 68%)',
    },
    ornament: {
      border: '1px solid rgba(186, 230, 253, 0.24)',
      borderRadius: '34px',
      inset: '-10px',
      background:
        'linear-gradient(135deg, rgba(125, 211, 252, 0.08), rgba(14, 116, 144, 0.04) 34%, rgba(3, 105, 161, 0) 78%)',
    },
  },
  taskPremium: {
    overlay: {
      background:
        'radial-gradient(circle at 10% 85%, rgba(217, 119, 6, 0.26), transparent 34%), radial-gradient(circle at 88% 12%, rgba(22, 163, 74, 0.24), transparent 36%), rgba(12, 12, 8, 0.8)',
      backdropFilter: 'blur(10px)',
    },
    shell: {
      background: 'linear-gradient(145deg, rgba(23, 24, 20, 0.95), rgba(31, 31, 24, 0.88))',
      borderRadius: '30px',
      border: '1px solid rgba(251, 191, 36, 0.34)',
      boxShadow: '0 40px 104px rgba(8, 10, 7, 0.68), inset 0 1px 0 rgba(253, 230, 138, 0.22)',
      overflow: 'hidden',
      animation: 'premiumModalIn 0.34s cubic-bezier(.2,.84,.26,1)',
    },
    content: {
      padding: '0',
    },
    close: {
      background: 'linear-gradient(135deg, rgba(113, 63, 18, 0.96), rgba(120, 53, 15, 0.88))',
      color: '#fef3c7',
      border: '1px solid rgba(251, 191, 36, 0.46)',
      boxShadow: '0 12px 24px rgba(30, 19, 5, 0.52)',
    },
    glow: {
      bottom: '-130px',
      left: '-90px',
      width: '340px',
      height: '340px',
      background: 'radial-gradient(circle, rgba(250, 204, 21, 0.23), rgba(161, 98, 7, 0) 70%)',
    },
    ornament: {
      border: '1px solid rgba(253, 230, 138, 0.22)',
      borderRadius: '36px',
      inset: '-12px',
      background:
        'linear-gradient(160deg, rgba(245, 158, 11, 0.08), rgba(74, 222, 128, 0.05) 40%, rgba(34, 197, 94, 0) 82%)',
    },
  },
  meetingPremium: {
    overlay: {
      background:
        'radial-gradient(circle at 95% 15%, rgba(34, 197, 94, 0.2), transparent 34%), radial-gradient(circle at 8% 88%, rgba(56, 189, 248, 0.23), transparent 36%), rgba(4, 10, 16, 0.82)',
      backdropFilter: 'blur(12px)',
    },
    shell: {
      background: 'linear-gradient(150deg, rgba(5, 18, 24, 0.95), rgba(10, 32, 39, 0.89))',
      borderRadius: '24px',
      border: '1px solid rgba(94, 234, 212, 0.38)',
      boxShadow: '0 36px 96px rgba(2, 12, 15, 0.68), inset 0 1px 0 rgba(153, 246, 228, 0.22)',
      overflow: 'hidden',
      animation: 'premiumModalIn 0.34s cubic-bezier(.2,.84,.26,1)',
    },
    content: {
      padding: '0',
    },
    close: {
      background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.96), rgba(13, 148, 136, 0.86))',
      color: '#ccfbf1',
      border: '1px solid rgba(94, 234, 212, 0.48)',
      boxShadow: '0 12px 24px rgba(6, 41, 38, 0.54)',
    },
    glow: {
      top: '-120px',
      left: '-70px',
      width: '300px',
      height: '300px',
      background: 'radial-gradient(circle, rgba(20, 184, 166, 0.24), rgba(5, 150, 105, 0) 68%)',
    },
    ornament: {
      border: '1px solid rgba(153, 246, 228, 0.22)',
      borderRadius: '30px',
      inset: '-10px',
      background:
        'linear-gradient(140deg, rgba(45, 212, 191, 0.08), rgba(34, 211, 238, 0.05) 38%, rgba(15, 118, 110, 0) 82%)',
    },
  },
  classicProfile: {
    overlay: {
      background: 'rgba(15, 23, 42, 0.56)',
      backdropFilter: 'blur(1px)',
    },
    shell: {
      background: '#ffffff',
      borderRadius: '14px',
      border: '1px solid rgba(148, 163, 184, 0.26)',
      boxShadow: '0 20px 48px rgba(15, 23, 42, 0.34)',
      overflow: 'hidden',
      animation: 'premiumModalIn 0.2s ease-out',
    },
    content: {
      padding: '0',
    },
    close: {
      background: 'rgba(255, 255, 255, 0.92)',
      color: '#334155',
      border: '1px solid rgba(148, 163, 184, 0.46)',
      boxShadow: '0 6px 18px rgba(15, 23, 42, 0.16)',
    },
    glow: null,
    ornament: null,
  },
}

const CustomModel = ({ children, performCancel, fetch, width, height, variant = 'default', showCloseIcon = true }) => {
  const activeVariant = variantStyleMap[variant] || variantStyleMap.default

  return (
    <div
    style={{
      width: '100%',
      height: '100vh',
      position: 'fixed',
      top: '0px',
      left: '0px',
      zIndex: '100',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      ...activeVariant.overlay,
    }}
  >
    <style>
      {`@keyframes premiumModalIn {\n 0% { opacity: 0; transform: translateY(22px) scale(0.98); }\n 100% { opacity: 1; transform: translateY(0) scale(1); }\n}`}
    </style>
    {activeVariant.glow && (
      <div
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          filter: 'blur(2px)',
          ...activeVariant.glow,
        }}
      />
    )}
    <div
      style={{
        width: width ? width : '400px',
        height: height ? height : '600px',
        maxHeight: 'calc(100vh - 48px)',
        position: 'relative',
        ...activeVariant.shell,
      }}
      className="model-con-ultimate"
    >
    {activeVariant.ornament && (
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          ...activeVariant.ornament,
        }}
      />
    )}
    {showCloseIcon && (
      <CrossButton
        performCancel={performCancel}
        label="✕"
        style={{
          background: activeVariant.close.background,
          color: activeVariant.close.color,
          border: activeVariant.close.border,
          boxShadow: activeVariant.close.boxShadow,
          fontWeight: 700,
          fontSize: '18px',
          top: '-18px',
          right: '-18px',
        }}
      />
    )}
    <div style={{ overflowY: 'auto', height: '100%', ...activeVariant.content }}>
    {fetch ? (
          <LoadingHV />
        ) : (
          <>
      {children}
          </>)}
    </div>
    </div>
    </div>
  )
}

export default CustomModel