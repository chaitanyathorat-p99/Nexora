
import React, { useState } from "react";
import { Card, Slider, Button } from "antd";
import styled from "styled-components";

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

const RangeFilter = ({ nameKey, setFilterUltimate, filterUltimate }) => {

  const handleSliderChange = (value) => {
    setFilterUltimate((prevState) => ({
        ...prevState,
        [nameKey]: value,
      }));
  };



  const handleReset = () => {
    setFilterUltimate((prevState) => ({
      ...prevState,
      [nameKey]: [0, 1000],
    }));
  };

  return (
    <StyledCard title="Select Range">
      <Slider
        range
        min={0}
        max={1000}
        step={100}
        defaultValue={[0, 1000]}
        value={filterUltimate[nameKey]}
        onChange={handleSliderChange}
      />
      <CreatedFilterActions>
 
        <StyledButton className="reset-button" onClick={handleReset}>
          Reset
        </StyledButton>
      </CreatedFilterActions>
    </StyledCard>
  );
};

export default RangeFilter;
