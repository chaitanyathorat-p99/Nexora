import React, { useState } from 'react';
import ScoreView from './score/ScoreView';
import { convertToStars } from '../../../atoms/State';

const HeaderComponent = ({lead}) => {
  const dummyData = {
    name: "Aditya Rathod",
    jobTitle: "Add job title...",
    score: 53,
    customerFit: 3.5,
  };
  const star = convertToStars(lead?.percentile)
const [showScore, setShowScore] = useState(false);
const performCancel=()=>{
  setShowScore(false)
}
  return (
    <div style={styles.container}>
      <div style={styles.profileSection}>
        <div style={styles.profileIcon}>A</div>
        <div>
          <h1 style={styles.name}>{lead?.firstName} {lead?.lastName}</h1>
          <p style={styles.jobTitle}>{lead?.email}</p>
        </div>
      </div>
      <div style={styles.detailsSection}>
        <div style={styles.score}>Score: {lead?.score?.score}</div>
        <div style={styles.customerFit}>
          Customer fit:
          <span style={styles.stars}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} style={index < star ? styles.starFilled : styles.starEmpty}>
                ★
              </span>
            ))}
          </span>
        </div>
        <div style={styles.keyScoring} onClick={()=>setShowScore(true)}>Show key scoring factors</div>
      </div>
      {showScore&&<ScoreView data={lead} performCancel={performCancel}/>

      }
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: '1px solid #ccc',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
  },
  profileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  name: {
    margin: 0,
    fontSize: '1.5em',
  },
  jobTitle: {
    margin: 0,
    color: '#777',
  },
  detailsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  score: {
    fontSize: '1em',
    fontWeight: 'bold',
  },
  customerFit: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1em',
  },
  stars: {
    marginLeft: '5px',
    color: '#f39c12',
  },
  starFilled: {
    color: '#f39c12',
  },
  starEmpty: {
    color: '#ccc',
  },
  keyScoring: {
    fontSize: '1em',
    color: '#007bff',
    cursor: 'pointer',
  },
};

export default HeaderComponent;
