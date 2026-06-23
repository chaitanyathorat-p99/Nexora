
import React, { useState } from "react";
import { Card, Checkbox, Button } from "antd";
import styled from "styled-components";
import "./filterCard.css";

// Styled-components for the CurrencySelectMultiValueFilter
const StyledCard = styled(Card)`
  width: 400px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.315);
`;

const CreatedOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
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

const SelectMultiValueFilter = ({ array, nameKey, setFilterUltimate, filterUltimate }) => {
  const [selectedTime, setSelectedTime] = useState([]);

  const handleCheckboxChange = (time) => {

    setFilterUltimate((prevState) => ({
      ...prevState,
      [nameKey]: filterUltimate[nameKey]?.includes(time)
        ? filterUltimate[nameKey]?.filter((item) => item !== time)
        : [...filterUltimate[nameKey], time],
    }));
  };

  const handleReset = () => {
    setFilterUltimate((prevState) => ({
      ...prevState,
      [nameKey]: [],
    }));
  };

  return (
    <StyledCard title="Select Timeline">
      <CreatedOptions>
        {array?.map((time) => (
          <Checkbox
            key={time}
            checked={filterUltimate[nameKey]?.includes(time)}
            onChange={() => handleCheckboxChange(time)}
          >
            {time}
          </Checkbox>
        ))}
      </CreatedOptions>
      <CreatedFilterActions>
      
        <StyledButton className="reset-button" onClick={handleReset}>
          Reset
        </StyledButton>
      </CreatedFilterActions>
    </StyledCard>
  );
};

export default SelectMultiValueFilter;
