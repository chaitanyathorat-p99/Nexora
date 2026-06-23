import React from 'react'

const FormHeader = ({ title }) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm" style={{ paddingBottom: "20px" }}>
      <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {title}
      </h2>
    </div>
  )
}

export default FormHeader;
