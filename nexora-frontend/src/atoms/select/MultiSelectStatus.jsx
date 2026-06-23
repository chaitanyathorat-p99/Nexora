

import React from 'react';
import { FieldArray, ErrorMessage } from 'formik';
import useLeadStatusOptions from '../../utils/useLeadStatusOptions';

const MultiSelectStatus = ({  name, label, required,mainLabel }) => {
    const { leadStatusOptions: array } = useLeadStatusOptions();
    return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {mainLabel ? mainLabel : "Label"}
      </label>
      {array?.length>0&&

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
                if (form?.values[name]?.includes(value)) {
                  remove(form?.values[name]?.indexOf(value));
                } else {
                  push(value);
                }
              }}
              value=""
            >
              <option value="" label={`Select a ${label}`} />
              {array?.map((item) => (
                <option key={item?._id} value={item?._id}>
                  {item?.name}
                  
                </option>
              ))}
            </select>
            <div  className="flex flex-wrap gap-2 mt-2">
              {form?.values[name]?.map((id, index) => (
                <div key={index} className="flex items-center bg-gray-200 rounded-md p-1">
                <span>{array?.find((item) => item._id === id)?.name}</span>
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
      }

    </div>
  );
};

export default MultiSelectStatus;
