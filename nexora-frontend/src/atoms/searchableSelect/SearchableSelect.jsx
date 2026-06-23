import React from 'react';
import { Select } from 'antd';

/**
 * A searchable select component that wraps Ant Design's Select
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Placeholder text
 * @param {Array} props.options - Array of options with label and value properties
 * @param {Function} props.onChange - Function called when value changes
 * @param {string|number} props.value - Selected value
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {Object} props.style - Additional style properties
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props to pass to Select
 */
const SearchableSelect = ({
  placeholder = 'Select an option',
  options = [],
  onChange,
  value,
  disabled = false,
  style = {},
  className = '',
  ...rest
}) => {
  return (
    <Select
      showSearch
      placeholder={placeholder}
      optionFilterProp="label"
      onChange={onChange}
      value={value}
      disabled={disabled}
      style={{ width: '100%', ...style }}
      className={className}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={options}
      {...rest}
    />
  );
};

export default SearchableSelect; 