import React from 'react';
import styled from 'styled-components';

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Select = styled.select`
  padding: 3px;
  border: 1px solid ${props => props.$error ? 'red' : '#ccc'};
  border-radius: 4px;
  /* font-size: 16px; */
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Option = styled.option``;

const SelectDropdown = ({
  options = [],
  selected,
  onChange,
  label,
  placeholder = 'Select an option',
  disabledOptions = [],
  error = false,
  disabled = false
}) => {
  return (
    <DropdownWrapper>
      {label && <Label>{label}</Label>}
      <Select
        value={selected}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        $error={error}
      >
        <Option value={''} >{placeholder}</Option>
        {(Array.isArray(options) ? options : []).map((option, index) => {
          if (typeof option === 'object' && option !== null) {
            return (
              <Option
                key={index}
                value={option.value}
                disabled={disabledOptions.includes(option.value)}
              >
                {option.label}
              </Option>
            );
          } else {
            // fallback for string options
            return (
              <Option
                key={index}
                value={option}
                disabled={disabledOptions.includes(option)}
              >
                {option}
              </Option>
            );
          }
        })}
      </Select>
    </DropdownWrapper>
  );
};

export default SelectDropdown;
