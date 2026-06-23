import React from 'react';
import { IDateOnly } from '../../../atoms/State';
const DateTag = ({ date }) => {
  return (
    <div style={{ 
      padding: '6px 20px', 
      backgroundColor: '#ffffffaf',
      borderRadius: '5px', 
      fontSize: '12px', 
      // fontWeight: 'bold', 
      color: '#212427', 
      display: 'inline-block',
      border: '1px solid #E0E0E0',
      width: 'fit-content',
    }}>
      {IDateOnly(date)} {/* Using IDateOnly function */}
    </div>
  );
};

export default DateTag;
