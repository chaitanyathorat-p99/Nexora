import React, { useEffect } from 'react';
import { FieldArray, ErrorMessage } from 'formik';
import { RxCrossCircled } from "react-icons/rx";

const DynamicFieldMultiselect = ({ 
  name, 
  label, 
  options = [], 
  required = false 
}) => {
  // Ensure the field is initialized as an array
  useEffect(() => {
    // This will be handled by Formik's FieldArray
  }, []);
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <FieldArray name={name}>
        {({ push, remove, form }) => (
          <div>
            <select
              id={name}
              name={name}
              autoComplete={name}
              required={required}
              className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  // Ensure the field is an array before pushing
                  if (!Array.isArray(form.values[name])) {
                    form.setFieldValue(name, []);
                  }
                  // Only add if not already included
                  if (!form.values[name]?.includes(value)) {
                    push(value);
                  }
                }
              }}
              value=""
            >
              <option value="" label={`Select a ${label}`} />
              {options?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(form?.values[name]) && form.values[name].map((id, index) => (
                <div key={index} className="flex items-center rounded-md border border-slate-300 bg-slate-100 px-2 py-1 text-sm text-slate-700">
                  <span>{id}</span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-2 text-red-500"
                    aria-label="Remove tag"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <ErrorMessage
              name={name}
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default DynamicFieldMultiselect;
