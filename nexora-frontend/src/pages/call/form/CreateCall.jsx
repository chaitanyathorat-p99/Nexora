import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  useCreateCallMutation,
  useFetchUserQuery,
  useUpdateCallMutation,
  useUpdateMeetingMutation,
  useFetchLeadQuery,
  useGetLeadQuery,
  useGetLeadDetailsQuery,
} from "../../../features/allApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import InputField from "../../../atoms/input/InputField";
import SelectButtonWithId from "../../../atoms/select/SelectButtonWithId";
import EResponse from "../../../atoms/response/EResponse";
import DatePickerField from "../../../atoms/input/DatePickerField";
import Dummy from "../../../atoms/input/Dummy";
import SelectButtonWithArrayId from "../../../atoms/select/SelectButtonWithArrayId";
import {
  meetingTypeArray,
  platFormArray,
  TaskStage,
} from "../../../atoms/State";
import SelectButton from "../../../atoms/select/SelectButton";
import { meetingValidationSchema } from "../../../atoms/StaticSchema";
import LeadPopUp from "../../lead/LeadPopUp";
import { checkAccess } from "../../../atoms/static";
import { message, Popconfirm } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import FormButtons from "../../../atoms/button/FormButtons";
import DynamicFieldRenderer from "../../../components/dynamic-fields/DynamicFieldRenderer";
import { useFetchDynamicFieldsByModuleQuery } from "../../../features/allApi";
import { CreateFormCard, CreateFormForm } from "../../../components/forms/CreateFormShell";

const handleSubmit = (values, createLead, formValue, updateLead, user, skipApi, onFormSubmit, dynamicFields) => {
  if (values?.lead) {
    // Extract dynamic field values
    const dynamicFieldValues = {};
    if (dynamicFields) {
      dynamicFields.forEach(field => {
        if (values[field.fieldName] !== undefined) {
          dynamicFieldValues[field.fieldName] = values[field.fieldName];
        }
      });
    }
    
    // Add dynamic fields to the form data
    const formData = {
      ...values,
      dynamicFields: dynamicFieldValues
    };
    
    if (formValue?._id) {
      updateLead(formData);
    } else {
      if (!checkAccess(user, "Call", "special")) {
        formData.assignedTo = user?._id;
      }
      createLead(formData);
    }
  } else {
    message.error("Please Select The Lead")
  }
};

const CreateCall = ({ formValue, performCancel, lead_id, skipApi, onFormSubmit }) => {
  const validationSchema = meetingValidationSchema;
  const initialValues = {
    title: "",
    dueDate: "",
    desc: "",
    outcome: "",
    callNote: "",
    callDone: false,
    lead: lead_id ? lead_id : null,
    createdBy: null,
    assignedTo: null,
    companyMaster: null,
  };
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
  const [createLead, GetLeadResponse] = useCreateCallMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateCallMutation();
  const [leadShow, setLeadShow] = useState(false);
  const [selectedLead, setSelectedLead] = useState(formValue?._id ? formValue.lead : initialValues.lead);
  const {
    data: system_user,
    isLoading: system_isLoading,
    isFetching: system_fetch,
  } = useFetchUserQuery({ type: `userType=System` });
  const { data: leadsData } = useFetchLeadQuery({ filterString: '', filterObj: '', page: '' });
  const [leadIdToFetch, setLeadIdToFetch] = useState(null);
  const { data: fetchedLeadData } = useGetLeadQuery(leadIdToFetch ? { _id: leadIdToFetch } : { _id: '' }, { skip: !leadIdToFetch });
  const {
    data: leadData,
    isLoading: isLoadingLeadData,
    isFetching: fetchingLeadData,
    error: leadDataError,
  } = useGetLeadDetailsQuery(selectedLead ? { _id: selectedLead } : skipToken, {
    skip: !selectedLead,
  });

  // Fetch dynamic fields for call module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "call" });


  const handleCancel = () => {
    performCancel();
  };

  return (
    <div>
      {!skipApi && (
        <>
          <EResponse
            cancel={performCancel}
            error={GetLeadResponse?.error?.data?.message}
            Response={GetLeadResponse}
            type={"create"}
            navigateTo={lead_id ? "" : "/calls"}
          />
          <EResponse
            cancel={performCancel}
            error={GetUpdateLeadResponse?.error?.data?.message}
            Response={GetUpdateLeadResponse}
            type={"update"}
            navigateTo={lead_id ? "" : "/calls"}
          />
        </>
      )}

      <FormHeader title={formValue?._id ? "Update Call" : "Create Call"} />

      <div className="sm:mx-auto w-full">
        <Formik
          initialValues={formValue?._id ? {
            ...formValue,
            ...(formValue.dynamicFields || {})
          } : initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            console.log('Formik onSubmit called', values);
            values.companyMaster = user?.companyMaster?._id || null;
            values.createdBy = user?._id;
            
            // Extract dynamic field values
            const dynamicFieldValues = {};
            if (dynamicFields) {
              dynamicFields.forEach(field => {
                if (values[field.fieldName] !== undefined) {
                  dynamicFieldValues[field.fieldName] = values[field.fieldName];
                }
              });
            }
            if (skipApi) {
              // Find the assigned user name from the system_user data
              const assignedUser = system_user?.data?.find(u => u._id === values.assignedTo);
              const assignedToName = assignedUser ? (assignedUser.name || assignedUser.username) : '';
              // Find the lead name from the leads list
              let leadName = '';
              if (leadsData?.content && values.lead) {
                const leadObj = leadsData.content.find(l => l._id === values.lead);
                if (leadObj) {
                  leadName = leadObj.firstName || '';
                }
              }
              // If not found, fetch by ID
              if (!leadName && values.lead) {
                setLeadIdToFetch(values.lead);
                // Wait for the fetched lead data
                let tries = 0;
                while (!fetchedLeadData && tries < 10) {
                  await new Promise(res => setTimeout(res, 100));
                  tries++;
                }
                if (fetchedLeadData) {
                  leadName = fetchedLeadData.firstName || '';
                }
              }
              // Add names to the values object
              const valuesWithNames = {
                ...values,
                assignedToName,
                leadName,
                dynamicFields: dynamicFieldValues
              };
              console.log('Call form submit:', { leadName, values, valuesWithNames, leadsData, fetchedLeadData });
              if (onFormSubmit) {
                onFormSubmit(valuesWithNames);
              }
              setLeadIdToFetch(null);
              return;
            }
            
            // Add dynamic fields to the form data
            const formData = {
              ...values,
              dynamicFields: dynamicFieldValues
            };
            
            handleSubmit(formData, createLead, formValue, updateLead, user, skipApi, onFormSubmit, dynamicFields);
            setLeadIdToFetch(null);
          }}
        >
          {({ isSubmitting, errors, values }) => (
            <CreateFormCard>
              <CreateFormForm>
              {lead_id ? null : (
                <React.Fragment>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={() => setLeadShow(true)}
                      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      type="button"
                      style={{ width: "200px" }}
                    >
                      {values?.lead?.length > 1 ? "Change Lead" : "Select Lead"}
                    </button>
                    {/* Show selected lead's name next to the button */}
                    {(!isLoadingLeadData && leadData) ? (
                      <span style={{ fontWeight: 500 }}>
                        Selected Lead: {leadData?.firstName} {leadData?.lastName}
                      </span>
                    ) : null}
                  </div>
                  <Dummy />
                </React.Fragment>
              )}

              {leadShow && (
                <LeadPopUp
                  setSelectedLead={setSelectedLead}
                  performCancel={() => setLeadShow(false)}
                />
              )}

              <InputField required={false} name={"title"} label={"Title"} />
              <DatePickerField require={false} label="Date" name="dueDate" />

              <InputField
                span={2}
                isTextarea={true}
                required={false}
                name={"desc"}
                label={"Description"}
              />
              {checkAccess(user, "Call", "special") && (
                <SelectButtonWithId
                  required={true}
                  array={system_user?.data}
                  name={"assignedTo"}
                  label={"Assigned To"}
                />
              )}

              {dynamicFields && dynamicFields.length > 0 && (
                <>
                  <DynamicFieldRenderer 
                    fields={dynamicFields}
                    initialValues={formValue?._id ? formValue : {}}
                    mode="edit"
                  />
                </>
              )}

              {values?.callDone && (
                <InputField
                  span={2}
                  isTextarea={true}
                  name={"outcome"}
                  label={"Outcome"}
                />
              )}

              {/* Dynamic Fields Section */}
              

              <div className="col-span-2 flex justify-end mt-8 gap-3">
                <FormButtons
                  isLoading={GetLeadResponse?.isLoading || GetUpdateLeadResponse?.isLoading}
                  onCancel={handleCancel}
                  isUpdate={!!formValue?._id}
                />
              </div>
              </CreateFormForm>
            </CreateFormCard>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateCall;
