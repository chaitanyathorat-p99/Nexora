import React, { useState } from 'react';
import { Card, Button } from 'antd';
import styled from 'styled-components';
import SelectDropdown from '../button/SelectDropdown';


const StyledCard = styled(Card)`
  width: 350px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.315);
`;

const CreatedAtFilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid #f0f0f0;
`;

const StyledButton = styled(Button)`
  width: 100px;
  font-weight: bold;
  &.apply-button {
    background-color: #1890ff;
    border-color: #1890ff;
    color: white;
  }
  &.reset-button {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
  }
`;

const dateOptions = [
  { label: "2024-01-01", value: "2024-01-01" },
  { label: "2024-02-01", value: "2024-02-01" },
  { label: "2024-03-01", value: "2024-03-01" },
  { label: "2024-04-01", value: "2024-04-01" },
  { label: "2024-05-01", value: "2024-05-01" },
  { label: "2024-06-01", value: "2024-06-01" },
];

const CreatedAtFilterCard = ({ onApply, onReset }) => {
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');

  const handleFromDateChange = (value) => {
    setSelectedFromDate(value);
  };


  const handleToDateChange = (value) => {
    setSelectedToDate(value);
  };


  const handleApply = () => {
    onApply(selectedFromDate, selectedToDate);
    console.log("From Date:", selectedFromDate);
    console.log("To Date:", selectedToDate);
  };


  const handleReset = () => {
    setSelectedFromDate('');
    setSelectedToDate('');
    onReset();
  };

  return (
    <StyledCard title="Select Date Range">
      <SelectDropdown
        options={dateOptions}
        selected={selectedFromDate}
        onChange={handleFromDateChange}
        label="From Date"
        placeholder="Select a From Date"
      />
      <SelectDropdown
        options={dateOptions}
        selected={selectedToDate}
        onChange={handleToDateChange}
        label="To Date"
        placeholder="Select a To Date"
      />
      <CreatedAtFilterActions>
        <StyledButton className="apply-button" type="primary" onClick={handleApply}>
          Apply
        </StyledButton>
        <StyledButton className="reset-button" onClick={handleReset}>
          Reset
        </StyledButton>
      </CreatedAtFilterActions>
    </StyledCard>
  );
};

export default CreatedAtFilterCard;
