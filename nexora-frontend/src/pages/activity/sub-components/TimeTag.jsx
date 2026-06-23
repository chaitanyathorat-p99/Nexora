import React from 'react';
import { ITime } from '../../../atoms/State';

const TimeTag = ({ date }) => {
  return (
    <>
      {ITime(date)} 
    </>
  );
};

export default TimeTag;
