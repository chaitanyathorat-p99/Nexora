import { ErrorMessage, Field } from 'formik'
import React from 'react'
import { countryArray } from '../State'

const SelectButtonWithId = ({array,name,label,required, hideLabel}) => {
  return (
    <div>
    {!hideLabel && (
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label?label:"Label"}
      </label>
    )}
    <Field
      as="select"
      id={name}
      name={name}
      autoComplete={name}
      required={required}
      className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    >
      <option value={null} label={`Select a ${label}`} />
      {array?.map((item) => (
        <option key={item._id} value={item._id}>
          {item?.name} {item?.username}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-600 text-sm mt-1"
    />
  </div>
  )
}

export default SelectButtonWithId
