
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

const SelectDropDownForAdmin = ({
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
        {(Array.isArray(options) ? options : []).map((option, index) => (
          <Option
            key={index}
            value={option?._id}
            disabled={disabledOptions.includes(option)}
          >
            {option?.username}{" "}
            {option?.name}
          </Option>
        ))}
      </Select>
    </DropdownWrapper>
  );
};

export default SelectDropDownForAdmin;
