import React from 'react';
import { ErrorMessage, Field } from 'formik';

const CustomSelect = ({ 
  name, 
  label, 
  options, 
  value, 
  onChange, 
  required = false,
  labelDisable = false
}) => {
  return (
    <div>
      {labelDisable ? null : (
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label ? label : "Label"}
        </label>
      )}
      <Field
        required={required ? required : false}
        as="select"
        id={name}
        name={name}
        autoComplete="country"
        className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" label={`Select a ${label}`} />
        {options?.map((item) => (
          <option key={item.value || item} value={item.value || item}>
            {item.label || item}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
};

export default CustomSelect; 