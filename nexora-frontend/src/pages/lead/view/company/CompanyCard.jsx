import React from 'react';
import { BiPencil } from 'react-icons/bi';

export const CompanyCard = ({company,handleEdit}) => {

  
  const {
    companyName,
    desc,
    lead_id,
    createdBy,
    assignedTo,
    website,
    linkedIn,
    facebook,
    twitter,
    instagram
  } = company;

  const styles = {
    card: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      width: '400px',
      height:"350px",

      margin: '20px auto',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      fontSize: '1.5em',
      marginBottom: '10px',
      display:"flex",
      alignItems:"center",
      gap:"5px",
      color: '#333',
    },
    description: {
      fontSize: '1em',
      color: '#666',
      marginBottom: '10px',
    },
    link: {
      display: 'block',
      marginBottom: '5px',
      color: 'var(--color-primary)',
      textDecoration: 'none',
    },
    socialMedia: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
    },
    socialIcon: {
      color: 'var(--color-primary)',
      textDecoration: 'none',
      fontSize: '1.2em',
    },
    details: {
      marginTop: '10px',
    },
    button: {
      display: 'block',
      width: '100%',
      padding: '10px',
      marginTop: '20px',
      backgroundColor: 'var(--color-primary)',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      textAlign: 'center',
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: '1em',
    },
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.header}>{companyName} <BiPencil style={{cursor:"pointer"}} onClick={()=>handleEdit(company?._id)}/></h2>
      <p style={styles.description}>{desc}</p>
      <p><strong>Website:</strong> <a href={website} style={styles.link} target="_blank" rel="noopener noreferrer">{website}</a></p>
      <div style={styles.socialMedia}>
        <a href={linkedIn} style={styles.socialIcon} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={facebook} style={styles.socialIcon} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={twitter} style={styles.socialIcon} target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href={instagram} style={styles.socialIcon} target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <div style={styles.details}>
        <p><strong>Lead ID:</strong> {lead_id?.firstName} {lead_id?.lastName}</p>
        <p><strong>Created By:</strong> {createdBy?.name}</p>
        <p><strong>Assigned To:</strong> {assignedTo?.name}</p>
      </div>
      {/* <button style={styles.button}>View Notes</button> */}
    </div>
  );
};

export default CompanyCard;
