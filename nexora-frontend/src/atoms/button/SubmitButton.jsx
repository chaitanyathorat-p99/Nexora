import React from 'react'

const SubmitButton = ({createRes,updateRes,formValue}) => {
  return (
          <div
                style={{
                  width: "200px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button
                  type="submit"
                  style={{cursor: updateRes?.isLoading||createRes?.isLoading?"not-allowed":"pointer"}}
                  disabled={updateRes?.isLoading||createRes?.isLoading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {updateRes?.isLoading||createRes?.isLoading
                    ? "Submitting..."
                    : formValue?._id
                    ? "Update"
                    : "Submit"}
                </button>
         
    </div>
  )
}

export default SubmitButton
