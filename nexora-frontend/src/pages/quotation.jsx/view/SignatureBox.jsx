
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useUpdateQuotationMutation } from '../../../features/allApi';
import EResponse from '../../../atoms/response/EResponse';
import SignatureCanvas from '../../../atoms/cards/SignatureCanvas';
const handleSubmit = (
  values,
  formValue,
  updateLead
) => {
  if (formValue?._id) {
    updateLead(values);
  }
  // console.log(values)
};
const SignatureBox = ({formValue}) => {
  const [updateLead, GetUpdateLeadResponse] = useUpdateQuotationMutation();

  return (
    <>
      <EResponse
        error={GetUpdateLeadResponse?.error?.data?.message}
        Response={GetUpdateLeadResponse}
        type={"update"}
      />
    <Formik
      initialValues={{ _id: formValue?._id,termsAndConditionCheck:formValue?.termsAndConditionCheck }} // initial value for agree checkbox
      onSubmit={(values) => {
        handleSubmit(values,formValue,updateLead);
      }}
      >
      {({ handleSubmit ,values}) => (
        <Form onSubmit={handleSubmit}>
          <div className="my-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Agree to Terms
            </label>
            <div className="flex items-center">
              <Field
                name="termsAndConditionCheck"
                type="checkbox"
                className="mr-2 leading-tight"
              />
              <span className="text-sm text-gray-600">I agree to the terms and conditions</span>
            </div>
            <ErrorMessage name="termsAndConditionCheck" component="div" className="text-red-500 text-sm" />
          </div> 
          {values?.termsAndConditionCheck&&
<><SignatureCanvas/></>
          }
          <button
          style={{width:"200px"}}
                  type="submit"
                  disabled={GetUpdateLeadResponse?.isLoading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {
                  GetUpdateLeadResponse?.isLoading
                    ? "Submitting..."
                    : "Submit"}
                </button>
        </Form>
      )}
    </Formik>
      </>
  );
};

export default SignatureBox;
