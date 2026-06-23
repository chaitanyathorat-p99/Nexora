import React from 'react';

const steps = [
  { label: 'New', dropdown: false },
  { label: 'Contacted', dropdown: false },
  { label: 'Interested', dropdown: true },
  { label: 'Qualified', dropdown: true },
  { label: 'Won', dropdown: true },
];

const StepIndicator = () => {
  return (
    <div style={styles.container}>
      {steps.map((step, index) => (
        <div key={index} style={styles.stepWrapper}>
          <div style={styles.step}>
            <span style={styles.stepLabel}>{step.label}</span>
            {step.dropdown && <span style={styles.dropdown}>▼</span>}
          </div>
          {index !== steps.length - 1 && <div style={styles.arrow}></div>}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#AEE7E1',
    borderRadius: '25px',
    overflow: 'hidden',
  },
  stepWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap:"20px",
    marginLeft:"20px",

    position: 'relative',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#AEE7E1',
    position: 'relative',
    zIndex: 1,
    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)',
  },
  stepLabel: {
    fontSize: '16px',
    color: '#000',
  },
  dropdown: {
    marginLeft: '8px',
    fontSize: '12px',
    color: '#000',
  },
  arrow: {
    width: '20px',
    height: '100%',
    backgroundColor: '#fff',
    marginLeft:"20px",
    clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
    position: 'absolute',
    right: '-10px',
    zIndex: 0,
  },
};

export default StepIndicator;
