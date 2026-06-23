import React, { useState } from "react";
import { Card, DatePicker, Button } from "antd";
import styled from "styled-components";
import moment from "moment";

const { RangePicker } = DatePicker;

// Styled-components for the CurrencyFilterCard
const StyledCard = styled(Card)`
  width: 400px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.315);
`;

const CreatedFilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid #f0f0f0;
`;

const StyledButton = styled(Button)`
  width: 120px;
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

const DateRangeFilter = ({ nameKey, setFilterUltimate, filterUltimate }) => {
  const handleDateChange = (dates) => {
    const serializableDates = Array.isArray(dates)
      ? dates.map((date) => (date ? date.toISOString() : null))
      : [];

    setFilterUltimate((prevState) => ({
      ...prevState,
      [nameKey]: serializableDates,
    }));
  };

  const handleReset = () => {
    setFilterUltimate((prevState) => ({
      ...prevState,
      [nameKey]: [],
    }));
  };

  return (
    <StyledCard title="Select Date Range">
      <RangePicker
        value={Array.isArray(filterUltimate[nameKey]) ? filterUltimate[nameKey].map((date) => (date ? moment(date) : null)) : []}
        onChange={handleDateChange}
        format="YYYY-MM-DD"
        getPopupContainer={(triggerNode) => triggerNode?.parentElement || document.body}
      />
      <CreatedFilterActions>
 
        <StyledButton className="reset-button" onClick={handleReset}>
          Reset
        </StyledButton>
      </CreatedFilterActions>
    </StyledCard>
  );
};

export default DateRangeFilter;