import React, { useState } from 'react';
import { Card, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import './filterCard.css';
import SelectDropdown from '../button/SelectDropdown';
// Styled-components for the CurrencyFilterCard
const StyledCard = styled(Card)`
  width: 350px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.315);
`;

const CurrencyOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
`;

const CurrencyFilterActions = styled.div`
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

const allCurrencies = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "JPY", label: "JPY" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
  { value: "CHF", label: "CHF" },
  { value: "CNY", label: "CNY" },
  { value: "INR", label: "INR" },
  { value: "BRL", label: "BRL" },
];

const CurrencyFilterCard = ({ setFilterUltimate,nameKey,filterUltimate}) => {
  const [dropdownSelection, setDropdownSelection] = useState('');



  const handleDropdownChange = (value) => {

    setFilterUltimate(prevState => ({
      ...prevState,
      [nameKey]:value
    }));
  };


  const handleReset = () => {
    setDropdownSelection('');
    setFilterUltimate(prevState => ({
      ...prevState,
      [nameKey]: ''
    }));
    


  };

  return (
    <StyledCard title="Select Currencies">
      <SelectDropdown
        options={allCurrencies}
        selected={filterUltimate[nameKey]}
        onChange={handleDropdownChange}
        label="Add a Currency"
        placeholder="Select a currency"
        disabledOptions={[]}
      />
      {/* <CurrencyOptions>
        {allCurrencies.map((currency) => (
          <Checkbox
            key={currency.value}
            checked={selectedCurrencies.includes(currency.value)}
            onChange={() => handleCheckboxChange(currency.value)}
          >
            {currency.label}
          </Checkbox>
        ))}
      </CurrencyOptions> */}
      <CurrencyFilterActions>

        <StyledButton className="reset-button" onClick={handleReset}>
          Reset
        </StyledButton>
      </CurrencyFilterActions>
    </StyledCard>
  );
};

export default CurrencyFilterCard;
