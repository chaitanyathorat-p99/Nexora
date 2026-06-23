import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  useCreateCompanyMutation,
  useCreateLeadMutation,
  useFetchLeadStatusQuery,
  useFetchUserQuery,
  useUpdateCompanyMutation,
  useUpdateLeadMutation,
  useUpdateLeadStatusMutation,
} from "../../../../../features/allApi";
import { message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SelectButton from "../../../../../atoms/select/SelectButton";
import InputField from "../../../../../atoms/input/InputField";
import SelectButtonWithId from "../../../../../atoms/select/SelectButtonWithId";
import Dummy from "../../../../../atoms/input/Dummy";
import FormHeader from "../../../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../../../atoms/response/EResponse";
import { countryArray } from "../../../../../atoms/State";
import FormButtons from '../../../../../atoms/button/FormButtons';
const handleSubmit = (values, createLead, formValue, updateLead, user) => {
  if (formValue?._id) {
    updateLead(values);
  } else {
    values.createdBy = user?._id;
    createLead(values);
  }
  // console.log(values)
};
const CreateCompany = ({ formValue ,performCancel,lead}) => {

  const initialValues = {
    companyName: "",
    desc: "",
    lead_id: lead?._id,
    createdBy: null,
    assignedTo: null,
    website: "",
    linkedIn: "",
    facebook: "",
    twitter: "",
    instagram: "",
  };



  const validationSchema = yup.object().shape({
    companyName: yup.string().required("Company name is required"),
    desc: yup.string(),
    lead_id: yup.string().nullable(),
    createdBy: yup.string().nullable(),
    assignedTo: yup.string().nullable(),
    website: yup
      .string()
      .test("is-url", "Invalid URL", (value) => {
        if (!value) return true; // allow empty string if not required
        return /^(https?:\/\/|www\.)/.test(value); // allows http://, https://, or www.
      }),
    linkedIn: yup
      .string()
      .test("is-url", "Invalid URL", (value) => {
        if (!value) return true;
        return /^(https?:\/\/|www\.)/.test(value);
      }),
    facebook: yup
      .string()
      .test("is-url", "Invalid URL", (value) => {
        if (!value) return true;
        return /^(https?:\/\/|www\.)/.test(value);
      }),
    twitter: yup
      .string()
      .test("is-url", "Invalid URL", (value) => {
        if (!value) return true;
        return /^(https?:\/\/|www\.)/.test(value);
      }),
    instagram: yup
      .string()
      .test("is-url", "Invalid URL", (value) => {
        if (!value) return true;
        return /^(https?:\/\/|www\.)/.test(value);
      }),

   
  });
  
  
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  const [createLead, GetLeadResponse] = useCreateCompanyMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateCompanyMutation();

  return (
    <div className="flex min-h-full flex-1 flex-col   ">
      <FormHeader title={formValue?._id?`Update Company`:`Create Company`} />
      <EResponse
        error={GetLeadResponse?.error?.data?.message}
        Response={GetLeadResponse}
        type={"create"}
        cancel={performCancel}
      />
      <EResponse
        error={GetUpdateLeadResponse?.error?.data?.message}
        Response={GetUpdateLeadResponse}
        type={"update"}
        cancel={performCancel}

      />
      <div className=" sm:mx-auto w-full ">
        <Formik
          initialValues={formValue?._id ? formValue : initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) =>
            handleSubmit(values, createLead, formValue, updateLead, user)
          }
        >
          {({ isSubmitting,errors }) => (
            // <Form className="space-y-6">
            <Form
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2"
            style={{ gap: "1rem" }}
            >
              <InputField name={"companyName"} label={"Company Name"} />
              <InputField name={"desc"} label={"Description"}  />
              <InputField name={"website"} label={"Website"} />
              <InputField name={"infolinkedIn"} label={"LinkedIn"} />
              <InputField name={"facebook"} label={"FaceBook"} />
              <InputField name={"twitter"} label={"Twitter"} />
              <InputField name={"instagram"} label={"Instagram"} />
            
              <Dummy />
              <div className="col-span-2 flex justify-end mt-6">
                <FormButtons
                  isLoading={GetLeadResponse?.isLoading || GetUpdateLeadResponse?.isLoading}
                  onCancel={performCancel}
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

export default CreateCompany;
