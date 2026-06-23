import React, { useState } from "react";
import { Card, Checkbox, Button } from "antd";
import styled from "styled-components";
import "./filterCard.css";
import SelectDropdown from "../button/SelectDropdown";
import SelectDropDownForAdmin from "../button/SelectDropDownForAdmin";
// Styled-components for the SelectOneValueFilter
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

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const CustomValueInput = styled.input`
  padding: 3px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SelectOneValueFilter = ({
  setFilterUltimate,
  nameKey,
  filterUltimate,
  array,
  label,
  admin,
  onClose,
  allowCustomValue = false,
}) => {
  const [dropdownSelection, setDropdownSelection] = useState("");
  const customOptionsId = `${nameKey}-filter-options`.replace(/[^a-zA-Z0-9_-]/g, "-");

  const handleDropdownChange = (value) => {
    setFilterUltimate((prevState) => ({
      ...prevState,
      [nameKey]: value,
    }));
    onClose?.();
  };

  const handleCustomValueChange = (value) => {
    setDropdownSelection(value);
    setFilterUltimate((prevState) => ({
      ...prevState,
      [nameKey]: value,
    }));
  };

  const handleReset = () => {
    setDropdownSelection("");
    setFilterUltimate((prevState) => ({
      ...prevState,
      [nameKey]: "",
    }));
    onClose?.();
  };
  SelectDropDownForAdmin;
  return (
    <StyledCard title={label ? `Select a ${label}` : `Select a ${nameKey}`}>
      {allowCustomValue ? (
        <DropdownWrapper>
          {label && <Label>{label ? `Add a ${label}` : `Add a ${nameKey}`}</Label>}
          <CustomValueInput
            list={customOptionsId}
            value={filterUltimate[nameKey] ?? dropdownSelection}
            onChange={(e) => handleCustomValueChange(e.target.value)}
            placeholder={label ? `Select a ${label}` : `Select a ${nameKey}`}
          />
          <datalist id={customOptionsId}>
            {(Array.isArray(array) ? array : []).map((option, index) => (
              <option
                key={index}
                value={typeof option === "object" && option !== null ? option.value : option}
              />
            ))}
          </datalist>
        </DropdownWrapper>
      ) : admin ? (
        <SelectDropDownForAdmin
          options={array}
          selected={filterUltimate[nameKey]}
          onChange={handleDropdownChange}
          label={label ? `Add a ${label}` : `Add a ${nameKey}`}
          placeholder={label ? `Select a ${label}` : `Select a ${nameKey}`}
          disabledOptions={[]}
        />
      ) : (
        <SelectDropdown
          options={array}
          selected={filterUltimate[nameKey]}
          onChange={handleDropdownChange}
          label={label ? `Add a ${label}` : `Add a ${nameKey}`}
          placeholder={label ? `Select a ${label}` : `Select a ${nameKey}`}
          disabledOptions={[]}
        />
      )}
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

export default SelectOneValueFilter;
