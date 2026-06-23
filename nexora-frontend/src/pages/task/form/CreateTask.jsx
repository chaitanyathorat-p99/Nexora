import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  useCreateLeadMutation,
  useCreateTaskMutation,
  useFetchUserQuery,
  useUpdateLeadMutation,
  useUpdateTaskMutation,
  useFetchLeadQuery,
  useGetLeadQuery,
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
import { TaskStage } from "../../../atoms/State";
import SelectButton from "../../../atoms/select/SelectButton";
import { Popconfirm } from "antd";
import { message } from "antd";
import { checkAccess } from "../../../atoms/static";
import FormButtons from "../../../atoms/button/FormButtons";
import DynamicFieldRenderer from "../../../components/dynamic-fields/DynamicFieldRenderer";
import { useFetchDynamicFieldsByModuleQuery } from "../../../features/allApi";
import { CreateFormCard, CreateFormForm } from "../../../components/forms/CreateFormShell";



const isAdminRoleName = (roleName) => {
  const normalized = String(roleName || "")
    .toUpperCase()
    .replace(/[\s-]/g, "_");
  return normalized.includes("ADMIN");
};

const handleSubmit = (values, createTask, formValue, updateTask, user) => {
  if (formValue?._id) {
    updateTask(values);
    return;
  }

  const nextValues = { ...values };
  if (!checkAccess(user, "Task", "special")) {
    // Keep assignedTo consistently an array of user IDs.
    const fallbackId = user?._id;
    nextValues.assignedTo = Array.isArray(nextValues.assignedTo)
      ? nextValues.assignedTo
      : nextValues.assignedTo
        ? [nextValues.assignedTo]
        : [];
    if (nextValues.assignedTo.length === 0 && fallbackId) {
      nextValues.assignedTo = [fallbackId];
    }
  }

  if (!nextValues.taskStages) {
    nextValues.taskStages = "New";
  }

  createTask(nextValues);
};

const CreateTask = ({ formValue, performCancel, goTo, skipApi, onFormSubmit }) => {
  const {
    data: client_user,
    isLoading: client_isLoading,
    isFetching: client_fetch,
  } = useFetchUserQuery({ type: `userType=Client` });
  const {
    data: system_user,
    isLoading: system_isLoading,
    isFetching: system_fetch,
  } = useFetchUserQuery({ type: `userType=System` });
  const { data: leadsData } = useFetchLeadQuery({ filterString: '', filterObj: '', page: '' });
  const [leadIdToFetch, setLeadIdToFetch] = useState(null);
  const { data: fetchedLeadData } = useGetLeadQuery(leadIdToFetch ? { _id: leadIdToFetch } : { _id: '' }, { skip: !leadIdToFetch });
  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    lead: yup.string().nullable(),
    taskStatus: yup.boolean(),
    dueDate: yup.date().required("Due date is required"),
    outcome: yup.string(),
    assignedTo: yup.array().of(yup.string()),
    assignedBy: yup.string().nullable(),
    createdBy: yup.string().nullable(),
  });

  const initialValues = {
    title: "",
    description: "",
    lead: null,
    taskStatus: false,
    dueDate: "",
    outcome: "",
    assignedTo: [],
    taskStages: "New",
    assignedBy: "",
    createdBy: "",
    subtasks: [],
  };
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
  const roleName = user?.role?.name;
  const canManageSubtasks = isAdminRoleName(roleName);
  const [createLead, GetLeadResponse] = useCreateTaskMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateTaskMutation();

  // Fetch dynamic fields for task module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "task" });


  const handleCancel = () => {
    navigate('/tasks');
  }
  return (
    <div className="flex min-h-full flex-1 flex-col">
      {!skipApi && (
        <>
          <EResponse
            cancel={performCancel}
            error={GetLeadResponse?.error?.data?.message}
            Response={GetLeadResponse}
            type={"create"}
            navigateTo={"/tasks"}
          />
          <EResponse
            cancel={performCancel}
            error={GetUpdateLeadResponse?.error?.data?.message}
            Response={GetUpdateLeadResponse}
            type={"update"}
            navigateTo={"/tasks"}
          />
        </>
      )}
      <FormHeader title={formValue?._id ? "Update Task" : "Create Task"} />

      <div className=" sm:mx-auto w-full ">
        <Formik
          initialValues={formValue?._id ? {
            ...formValue,
            ...(formValue.dynamicFields || {})
          } : initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
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
              if (onFormSubmit) {
                onFormSubmit(valuesWithNames);
              }
              return;
            }
            
            // Add dynamic fields to the form data
            const formData = {
              ...values,
              dynamicFields: dynamicFieldValues
            };

            handleSubmit(formData, createLead, formValue, updateLead, user);
          }}
        >
          {({ isSubmitting, errors, values, setFieldValue }) => (
            <CreateFormCard>
              <CreateFormForm>
                {console.log(errors)}
                {console.log(values)}

                <InputField required={true} name={"title"} label={"Title"} />
                <DatePickerField require={true} label="Due Date" name="dueDate" />

                <InputField
                  isTextarea={true}
                  required={true}
                  name={"description"}
                  label={"Description"}
                />

                <SelectButtonWithArrayId
                  array={system_user?.data}
                  name={"assignedTo"}
                  label={"AssignedTo"}
                />
                <SelectButton
                  array={TaskStage}
                  name={"taskStages"}
                  label={"Task Stages"}
                />

                {canManageSubtasks && (
                  <div className="col-span-2 border rounded-lg bg-[#f8fbff] border-[#dbe7ff] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[15px] font-semibold text-slate-900">Task Todo / Subtasks</div>
                      <button
                        type="button"
                        onClick={() => {
                          const current = Array.isArray(values?.subtasks) ? values.subtasks : [];
                          setFieldValue("subtasks", [
                            ...current,
                            { title: "", isDone: false, assignedTo: "" },
                          ]);
                        }}
                        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        + Add Subtask
                      </button>
                    </div>

                    {(Array.isArray(values?.subtasks) ? values.subtasks : []).length === 0 && (
                      <div className="text-sm text-slate-500">No subtasks added yet.</div>
                    )}

                    {(Array.isArray(values?.subtasks) ? values.subtasks : []).map((subtask, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 mt-2">
                        <input
                          type="text"
                          value={subtask?.title || ""}
                          placeholder="Subtask title"
                          onChange={(e) => {
                            const list = [...(values?.subtasks || [])];
                            list[index] = { ...(list[index] || {}), title: e.target.value };
                            setFieldValue("subtasks", list);
                          }}
                          className="border border-[#d4e1f7] rounded-md px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const list = (values?.subtasks || []).filter((_, idx) => idx !== index);
                            setFieldValue("subtasks", list);
                          }}
                          className="border border-[#fecaca] bg-[#fff1f2] text-[#be123c] rounded-md px-3 py-2 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Dummy />

                {/* Dynamic Fields Section */}
                {dynamicFields && dynamicFields.length > 0 && (
                  <>
                    <DynamicFieldRenderer 
                      fields={dynamicFields}
                      initialValues={formValue?._id ? formValue : {}}
                      mode="edit"
                    />
                  </>
                )}
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

export default CreateTask;
