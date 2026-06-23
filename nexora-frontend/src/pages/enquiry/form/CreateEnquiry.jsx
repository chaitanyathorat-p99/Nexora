import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { message, Popconfirm, Switch } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import Dummy from "../../../atoms/input/Dummy";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import FormButtons from "../../../atoms/button/FormButtons";
import { useCreateEnquiryMutation, useUpdateEnquiryMutation } from "../../../features/allApi";

const CreateEnquiry = ({ formValue }) => {
  const initialValues = {
    fullName: "",
    instituteName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    websiteUrl: "",
    message: "",
    subscribed: true,
  };

  const validationSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    instituteName: yup.string().required("Institute name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    jobTitle: yup.string().required("Job title is required"),
    websiteUrl: yup.string().required("Website URL is required"),
    message: yup.string(),
    subscribed: yup.boolean(),
  });
  
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  const [createEnquiry, createEnquiryResponse] = useCreateEnquiryMutation();
  const [updateEnquiry, updateEnquiryResponse] = useUpdateEnquiryMutation();

  const handleCancel = () => {
    navigate('/enquiry');
  };

  const handleSubmit = async (values) => {
    try {
      if (formValue?._id) {
        const result = await updateEnquiry({ _id: formValue._id, ...values }).unwrap();
        message.success("Enquiry updated successfully");
        navigate('/enquiry');
      } else {
        values.createdBy = user?._id;
        await createEnquiry(values).unwrap();
        message.success("Enquiry created successfully");
        navigate('/enquiry');
      }
    } catch (error) {
      message.error(error?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <FormHeader title={formValue?._id ? `Update Enquiry` : `Create Enquiry`} />
      <EResponse
        error={createEnquiryResponse?.error?.data?.message}
        Response={createEnquiryResponse}
        type={"create"}
        navigateTo={'/enquiry'}
      />
      <EResponse
        error={updateEnquiryResponse?.error?.data?.message}
        Response={updateEnquiryResponse}
        type={"update"}
        navigateTo={'/enquiry'}
      />
      <div className="sm:mx-auto w-full">
        <Formik
          initialValues={formValue?._id ? formValue : initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, values, setFieldValue }) => (
            <Form
              className="grid grid-cols-1 gap-y-6 sm:grid-cols-2"
              style={{ gap: "1rem" }}
            >
              <InputField name="fullName" label="Full Name" />
              <InputField name="instituteName" label="Institute Name" />
              <InputField name="email" label="Email" type="email" />
              <InputField name="phoneNumber" label="Phone Number" />
              <InputField name="jobTitle" label="Job Title" />
              <InputField name="websiteUrl" label="Website URL" />
              
              <div className="sm:col-span-2">
                <InputField name="message" label="Message" isTextarea={true} />
              </div>
              
              <div className="sm:col-span-1">
                <label 
                  htmlFor="subscribed" 
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Subscribed
                </label>
                <div className="mt-2">
                  <Switch 
                    checked={values.subscribed} 
                    onChange={(checked) => setFieldValue('subscribed', checked)}
                  />
                </div>
                <ErrorMessage
                  name="subscribed"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              
              <div className="sm:col-span-2 flex justify-end mt-4">
                <FormButtons
                  isLoading={createEnquiryResponse?.isLoading || updateEnquiryResponse?.isLoading}
                  onCancel={handleCancel}
                  isUpdate={!!formValue?._id}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateEnquiry; 