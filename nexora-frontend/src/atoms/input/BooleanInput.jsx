import { ErrorMessage, Field } from "formik";
import React from "react";

const BooleanInput = ({ label, name, required }) => {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm">
        <Field
          required={required}
          name={name}
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
        />
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
};

export default BooleanInput;
