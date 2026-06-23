import React from 'react';
import { Field, ErrorMessage, FieldArray } from 'formik';

const TagsInput = ({ name, placeholder }) => {
  return (<div>
      <label
      htmlFor={name}
      className="block text-sm font-medium leading-6 text-gray-900"
      >
        {name}
      </label>
    <FieldArray name={name}>
  
      {({ push, remove, form }) => (
        <div >
        
          <input
          style={{width:"100%"}}
            type="text"
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                e.preventDefault();
                push(e.target.value);
                e.target.value = '';
              }
            }}
            className="flex-1 border rounded-md p-1"
          />
        <div className="flex flex-wrap gap-2 mt-2">

          {form.values[name].map((tag, index) => (
            <div key={index} className="flex items-center bg-gray-200 rounded-md p-1">
              <span>{tag}</span>
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
          <ErrorMessage
            name={name}
            component="div"
            className="text-red-600 text-sm mt-1"
          />
        </div>
        </div>
      )}
    </FieldArray>
  </div>

  );
};

export default TagsInput;
