import React, { useEffect } from "react";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as yup from "yup";
import {
  useCreateLeadMutation,
  useFetchCommonApiQuery,
  useFetchUserQuery,
  useUpdateLeadMutation,
  useUpdateLeadStatusMutation,
  useFetchDynamicFieldsByModuleQuery,
} from "../../../features/allApi";
import { message, Popconfirm, Modal } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import SelectButton from "../../../atoms/select/SelectButton";
import {
  countryArray,
  leadWeightArray,
  sourceArray,
  statesInIndia,
} from "../../../atoms/State";
import InputField from "../../../atoms/input/InputField";
import Dummy from "../../../atoms/input/Dummy";
import SelectButtonWithId from "../../../atoms/select/SelectButtonWithId";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import { checkAccess } from "../../../atoms/static";
import FormButtons from "../../../atoms/button/FormButtons";
import MainTypeOfBuyer from "../../typeOfBuyer/form/MainTypeOfBuyer";
import MainIndustryType from "../../industry-type/form/MainIndustryType";
import DynamicFieldRenderer from "../../../components/dynamic-fields/DynamicFieldRenderer";
import { CreateInlineActionButton } from "../../../components/forms/CreateFormShell";

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 6px 18px rgba(12, 20, 40, 0.06);
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  position: relative;
  min-height: calc(100vh - 220px);

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Target form controls inside this form to give consistent production-level styling */
  label {
    display: block;
    font-size: 0.9rem;
    color: #2b2b2b;
    margin-bottom: 0.35rem;
    font-weight: 600;
  }

  input[type="text"],
  input[type="email"],
  input[type="number"],
  textarea,
  select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    font-size: 0.95rem;
    color: #111827;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
    box-sizing: border-box;
  }

  textarea {
    min-height: 88px;
    resize: vertical;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #0b6bf4;
    box-shadow: 0 0 0 3px rgba(11,107,244,0.08);
  }

  /* Make selects and custom components align nicely */
  div > .react-select__control, /* react-select control fallback */
  .select-control {
    width: 100%;
  }

  /* Full width actions row */
  & > div.col-span-2 {
    grid-column: 1 / -1;
  }

  /* Small helper / error text */
  .field-error {
    color: #e11d48;
    font-size: 0.85rem;
    margin-top: 0.35rem;
  }
`;

const PRIVILEGED_CREATE_LEAD_ROLES = new Set([
  "SUPER_ADMIN",
  "ADMIN",
  "SUPER_POWER",
]);

const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]*$/;
const CITY_REGEX = /^[A-Za-z][A-Za-z\s.'-]*$/;
const MOBILE_REGEX = /^\d{10,15}$/;

const LEAD_STATUS_OPTIONS = [
  { _id: "Active", name: "Active" },
  { _id: "Inactive", name: "Inactive" },
  { _id: "Pending", name: "Pending" },
];

const normalizeRoleName = (roleName) => {
  if (!roleName) {
    return "";
  }

  return String(roleName).toUpperCase().replace(/\s+/g, "_");
};

const AutoSelectDefaultLeadStatus = ({ isEditMode }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (isEditMode || values?.status) {
      return;
    }

    setFieldValue("status", "Pending", false);
  }, [isEditMode, values?.status, setFieldValue]);

  return null;
};

const AutoSelectLeadDefaults = ({ isEditMode, user }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    if (!values?.info?.country) {
      setFieldValue("info.country", "India", false);
    }

    const normalizedRole = normalizeRoleName(user?.role?.name);
    const isPrivilegedRole = PRIVILEGED_CREATE_LEAD_ROLES.has(normalizedRole);

    if (!isPrivilegedRole && !values?.assignedTo && user?._id) {
      setFieldValue("assignedTo", user._id, false);
    }
  }, [isEditMode, user, values?.assignedTo, values?.info?.country, setFieldValue]);

  return null;
};

const handleSubmit = (
  values,
  createLead,
  formValue,
  updateLead,
  user,
  skipApi,
  onFormSubmit
) => {
  const payload = {
    ...values,
    leadValue: values?.leadValue === "" ? 0 : values?.leadValue,
    leadWeight: values?.leadWeight || "Cold",

    mobile: values?.info?.mobile || "",
    address: values?.info?.address || "",
    city: values?.info?.city || "",
    state: values?.info?.state || "",
    country: values?.info?.country || "India",
    source: values?.info?.source || "",
    industryType: values?.info?.industryType || "",
    typeOfBuyer: values?.typeOfBuyer || "",
  };

  delete payload.info;

  if (skipApi) {
    onFormSubmit?.(payload);
    return;
  }

  if (formValue?._id) {
    updateLead({ ...payload, _id: formValue._id });
  } else {
    if (!checkAccess(user, "Lead", "special") && !payload.assignedTo) {
      payload.assignedTo = user?._id;
    }
    createLead(payload);
  }
};

const CreateLead = ({ formValue, performCancel, skipApi, onFormSubmit }) => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    leadValue: "",
    leadWeight: "",
    status: "",
    assignedTo: "",
    typeOfBuyer: "",
    info: {
      mobile: "",
      address: "",
      city: "",
      country: "India",
      source: "",
      industryType: "",
    },
  };
  const {
    data: commonApiData,
    isLoading: commonApiLoading,
    isFetching: commonApiFetch,
    error: commonApiError,
    refetch: refetchCommonApiData,
  } = useFetchCommonApiQuery();
  const {
    data: usersData,
    isLoading: usersIsLoading,
    isFetching: usersFetch,
  } = useFetchUserQuery({});

  const assignToUsers = usersData?.data?.map((item) => ({
    ...item,
    name: item?.fullName || item?.name || item?.username || item?.email || "User",
  }));

  const moduleType = "lead"; // Make this dynamic if needed in the future
  // Fetch dynamic fields for lead module
  const {
    data: dynamicFields,
    isLoading: dynamicFieldsLoading,
  } = useFetchDynamicFieldsByModuleQuery({ moduleType });

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .trim()
      .min(2, "First Name must be at least 2 characters")
      .max(50, "First Name cannot exceed 50 characters")
      .matches(NAME_REGEX, "First Name can contain letters, spaces, . ' and - only")
      .required("First Name is required"),
    lastName: yup
      .string()
      .trim()
      .min(2, "Last Name must be at least 2 characters")
      .max(50, "Last Name cannot exceed 50 characters")
      .matches(NAME_REGEX, "Last Name can contain letters, spaces, . ' and - only")
      .required("Last Name is required"),
    email: yup
      .string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    leadValue: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? undefined : value
      )
      .typeError("Lead Value must be a number")
      .min(0, "Lead Value cannot be negative")
      .nullable(),
    status: yup.string().required("Status is required"),
    assignedTo: yup.string(),
    user: yup.string(),
    typeOfBuyer: yup.string().required("Type of Buyer is required"),
    info: yup.object().shape({
      mobile: yup
        .string()
        .trim()
        .matches(MOBILE_REGEX, "Mobile number must contain only digits (10 to 15 digits)")
        .required("Mobile number is required"),
      address: yup
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(250, "Address cannot exceed 250 characters")
        .required("Address is required"),
      city: yup
        .string()
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(80, "City cannot exceed 80 characters")
        .matches(CITY_REGEX, "City can contain letters, spaces, . ' and - only")
        .required("City is required"),
      country: yup.string().trim().required("Country is required"),
      industryType: yup.string().required("Industry Type is required"),
    }),
    // Add dynamic validation for dynamic fields
    ...(dynamicFields?.reduce((acc, field) => {
      if (field.isRequired) {
        acc[field.fieldName] = yup.string().required(`${field.displayName} is required`);
      }
      return acc;
    }, {}) || {}),
  });
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  const toFormValues = (lead = {}) => ({
    firstName: lead.firstName || "",
    lastName: lead.lastName || "",
    email: lead.email || "",
    leadValue: lead.leadValue ?? "",
    leadWeight: lead.leadWeight || "",
    status: lead.status || "",
    assignedTo: lead.assignedTo?._id || lead.assignedTo || "",
    typeOfBuyer: lead.typeOfBuyer || "",
    info: {
      mobile: lead.mobile || "",
      address: lead.address || "",
      city: lead.city || "",
      state: lead.state || "",
      country: lead.country || "India",
      source: lead.source || "",
      industryType: lead.industryType || "",
    },
  });

  const [showTypeOfBuyerModal, setShowTypeOfBuyerModal] = React.useState(false);
  const [showIndustryTypeModal, setShowIndustryTypeModal] =
    React.useState(false);

  const [createLead, GetLeadResponse] = useCreateLeadMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateLeadMutation();

  const handleCancel = () => {
    navigate("/leads");
  };

  const handleTypeOfBuyerModalClose = () => {
    setShowTypeOfBuyerModal(false);
    // Optionally refetch commonApiData here to update the select options
    refetchCommonApiData(); // Call the refetch function
  };

  const handleIndustryTypeModalClose = () => {
    setShowIndustryTypeModal(false);
    // Optionally refetch commonApiData here to update the select options
    refetchCommonApiData(); // Call the refetch function
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center  ">
      {!skipApi && (
        <>
          <EResponse
            cancel={performCancel}
            error={GetLeadResponse?.error?.data?.message}
            Response={GetLeadResponse}
            type={"create"}
            navigateTo={"/leads"}
          />
          <EResponse
            cancel={performCancel}
            error={GetUpdateLeadResponse?.error?.data?.message}
            Response={GetUpdateLeadResponse}
            type={"update"}
            navigateTo={"/leads"}
          />
        </>
      )}
      
      <FormHeader title={formValue?._id ? "Update Lead" : "Create Lead"} />

      <div className=" sm:mx-auto w-full ">
        <Formik
          initialValues={formValue?._id ? {
            ...toFormValues(formValue),
            ...(formValue.dynamicFields || {}),
            // Ensure multiselect fields are arrays
            ...(formValue.dynamicFields && Object.keys(formValue.dynamicFields).reduce((acc, key) => {
              const field = dynamicFields?.find(f => f.fieldName === key);
              if (field?.fieldType === "multiselect") {
                acc[key] = Array.isArray(formValue.dynamicFields[key]) ? formValue.dynamicFields[key] : [];
              }
              return acc;
            }, {}))
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
              // Find the assigned user name from the users data
              const assignedUser = usersData?.data?.find(u => u._id === values.assignedTo);
              const assignedToName = assignedUser ? (assignedUser.fullName || assignedUser.name || assignedUser.username || assignedUser.email) : '';
              // Find the type of buyer name from commonApiData
              const typeOfBuyerObj = commonApiData?.typeOfBuyer?.find(t => t._id === values.typeOfBuyer);
              const typeOfBuyerName = typeOfBuyerObj ? typeOfBuyerObj.name : '';
              const leadName = values.firstName || '';
              const valuesWithNames = {
                ...values,
                assignedToName,
                leadName,
                typeOfBuyerName,
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

            handleSubmit(formData, createLead, formValue, updateLead, user, skipApi, onFormSubmit);
          }}
        >
          {({ isSubmitting }) => (
            <Card>
              <StyledForm>
              <AutoSelectDefaultLeadStatus
                isEditMode={!!formValue?._id}
              />
              <AutoSelectLeadDefaults
                isEditMode={!!formValue?._id}
                user={user}
              />
              <InputField name={"firstName"} label={"First Name"} />
              <InputField name={"lastName"} label={"Last Name"} />
              <InputField name={"email"} label={"Email"} type={"email"} />
              <InputField
                name={"leadValue"}
                label={"Lead Value"}
                type={"number"}
              />
              <SelectButton
                array={leadWeightArray}
                name={"leadWeight"}
                label={"Lead Weight"}
              />
              <InputField name={"info.mobile"} label={"Mobile"} />
              <InputField name={"info.address"} label={"Address"} isTextarea={true} />
              <InputField name={"info.city"} label={"City"} />

              <SelectButton
                array={statesInIndia}
                name={"info.state"}
                label={"State"}
              />

              <SelectButton
                array={countryArray}
                name={"info.country"}
                label={"Country"}
              />

              <div>
                <div className="flex items-center">
                  <label
                    htmlFor="typeOfBuyer"
                    className="block text-sm font-medium leading-6 text-gray-900 mr-2"
                  >
                    Type Of Buyer
                  </label>
                  <CreateInlineActionButton
                    onClick={() => setShowTypeOfBuyerModal(true)}
                    title="Create Type of Buyer"
                  >
                    +
                  </CreateInlineActionButton>
                </div>
                <SelectButtonWithId
                  required={false}
                  array={commonApiData?.typeOfBuyer}
                  name={"typeOfBuyer"}
                  label={"Type Of Buyer"}
                  hideLabel={true}
                />
                
              </div>
              <div>
                <div className="flex items-center">
                  <label
                    htmlFor="info.industryType"
                    className="block text-sm font-medium leading-6 text-gray-900 mr-2"
                  >
                    Industry Type
                  </label>
                  <CreateInlineActionButton
                    onClick={() => setShowIndustryTypeModal(true)}
                    title="Create Industry Type"
                  >
                    +
                  </CreateInlineActionButton>
                </div>
                <SelectButtonWithId
                  required={false}
                  array={commonApiData?.segment}
                  name={"info.industryType"}
                  label={"Industry Type"}
                  hideLabel={true}
                />
              
              </div>
              
              <SelectButton
                array={sourceArray}
                name={"info.source"}
                label={"Source"}
              />
              <SelectButtonWithId
                required={false}
                array={LEAD_STATUS_OPTIONS}
                name={"status"}
                label={"Status"}
              />
              {/* Assign To field - visible to all users */}
              <SelectButtonWithId
                required={false}
                array={assignToUsers}
                name={"assignedTo"}
                label={"Assign To"}
              />

              {/* Dynamic Fields Section - now inline, no heading */}
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
                  isLoading={
                    GetLeadResponse?.isLoading ||
                    GetUpdateLeadResponse?.isLoading
                  }
                  onCancel={handleCancel}
                  isUpdate={!!formValue?._id}
                />
              </div>
              </StyledForm>
            </Card>
          )}
        </Formik>
      </div>

      {/* Type Of Buyer Creation Modal */}
      <Modal
        // title="Create Type Of Buyer"
        open={showTypeOfBuyerModal}
        onCancel={handleTypeOfBuyerModalClose}
        footer={null} // Hide default footer buttons
        width={800}
        // style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <MainTypeOfBuyer performCancel={handleTypeOfBuyerModalClose} />
      </Modal>

      {/* Industry Type Creation Modal */}
      <Modal
        // title="Create Industry Type"
        open={showIndustryTypeModal}
        onCancel={handleIndustryTypeModalClose}
        footer={null} // Hide default footer buttons
        width={800}
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <MainIndustryType performCancel={handleIndustryTypeModalClose} />
      </Modal>
    </div>
  );
};

export default CreateLead;
