import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  useCreateDynamicFieldMutation,
  useUpdateDynamicFieldMutation,
} from "../../../features/allApi";
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Space,
  Switch,
  Alert,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import EResponse from "../../../atoms/response/EResponse";
import { useSelector } from "react-redux";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import InputField from "../../../atoms/input/InputField";
import CustomSelect from "../../../atoms/select/CustomSelect";
import FormButtons from "../../../atoms/button/FormButtons";
import FormHeader from "../../../components/moduleHeaders/FormHeader";

const { Title } = Typography;

const moduleTypeOptions = [
  "Lead",
  "Deal", 
  "Company",
  "Task",
  "Meeting",
  "Call",
  "Product",
  "User",
  "Ticket",
  "Enquiry",
];

const fieldTypeOptions = [
  "Text",
  "Number",
  "Email",
  "Phone",
  "Date",
  "Datetime",
  "Select (Single)",
  "Select (Multiple)",
  "Text Area",
  "Boolean (Yes/No)",
  "URL",
  "Currency",
  "Percentage",
];

// Mapping for backend values
const fieldTypeMapping = {
  "Text": "text",
  "Number": "number",
  "Email": "email",
  "Phone": "phone",
  "Date": "date",
  "Datetime": "datetime",
  "Select (Single)": "select",
  "Select (Multiple)": "multiselect",
  "Text Area": "textarea",
  "Boolean (Yes/No)": "boolean",
  "URL": "url",
  "Currency": "currency",
  "Percentage": "percentage",
};

const moduleTypeMapping = {
  "Lead": "lead",
  "Deal": "deal",
  "Company": "company",
  "Task": "task",
  "Meeting": "meeting",
  "Call": "call",
  "Product": "product",
  "User": "user",
  "Ticket": "ticket",
  "Enquiry": "enquiry",
};

const MainDynamicField = ({ formValue }) => {
  const navigate = useNavigate();
  const [createField, createResponse] = useCreateDynamicFieldMutation();
  const [updateField, updateResponse] = useUpdateDynamicFieldMutation();
  const { user } = useSelector((state) => state.user);
  const [showOptions, setShowOptions] = useState(false);

  // Formik initial values
  const initialValues = {
    fieldName: "",
    displayName: "",
    fieldType: "Text",
    moduleType: "Lead",
    isRequired: false,
    isActive: true,
    order: 0,
    options: [],
    defaultValue: "",
    placeholder: "",
    description: "",
    maxLength: 255,
    minLength: 0,
    validation: "",
    isUnique: false,
    isSearchable: false,
    isFilterable: false,
    isExportable: false,
    ...(formValue ? {
      ...formValue,
      fieldType: Object.keys(fieldTypeMapping).find(key => fieldTypeMapping[key] === formValue.fieldType) || formValue.fieldType,
      moduleType: Object.keys(moduleTypeMapping).find(key => moduleTypeMapping[key] === formValue.moduleType) || formValue.moduleType,
    } : {}),
  };

  // Yup validation schema
  const validationSchema = yup.object().shape({
    fieldName: yup
      .string()
      .required("Field name is required")
      .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, "Field name must start with a letter or underscore and contain only letters, numbers, and underscores"),
    displayName: yup.string().required("Display name is required"),
    fieldType: yup.string().required("Field type is required"),
    moduleType: yup.string().required("Module type is required"),
    options: yup.array().when("fieldType", {
      is: (val) => val === "Select (Single)" || val === "Select (Multiple)",
      then: yup.array().of(yup.string().required("Option is required")).min(1, "At least one option is required"),
      otherwise: yup.array().notRequired(),
    }),
    minLength: yup.number().min(0, "Min length must be 0 or greater"),
    maxLength: yup.number().min(1, "Max length must be 1 or greater"),
    order: yup.number().min(0, "Order must be 0 or greater"),
  });

  // Handle form submit
  const handleSubmit = (values) => {
    const fieldData = { 
      ...values,
      fieldType: fieldTypeMapping[values.fieldType] || values.fieldType,
      moduleType: moduleTypeMapping[values.moduleType] || values.moduleType,
    };
    if (formValue && formValue._id) {
      updateField({ ...fieldData, _id: formValue._id });
    } else {
      createField(fieldData);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/dynamic-fields");
  };

  // Show options for select/multiselect
  useEffect(() => {
    if (formValue && (formValue.fieldType === "select" || formValue.fieldType === "multiselect" || 
        formValue.fieldType === "Select (Single)" || formValue.fieldType === "Select (Multiple)")) {
      setShowOptions(true);
    }
  }, [formValue]);

  useEffect(() => {
    if (createResponse.isSuccess) {
      message.success("Dynamic field created successfully!");
      navigate("/dynamic-fields");
    }
    if (updateResponse.isSuccess) {
      message.success("Dynamic field updated successfully!");
      navigate("/dynamic-fields");
    }
  }, [createResponse.isSuccess, updateResponse.isSuccess, navigate]);

  return (
    <div>
      <EResponse response={createResponse} />
      <EResponse response={updateResponse} />
      <FormHeader title={formValue && formValue._id ? "Edit Dynamic Field" : "Create Dynamic Field"} />
     
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2" style={{ gap: "1rem" }}>
              <InputField name="fieldName" label="Field Name" required />
              <InputField name="displayName" label="Display Name" required />
              <CustomSelect
                name="fieldType"
                label="Field Type"
                options={fieldTypeOptions}
                required
                value={values.fieldType}
                onChange={(val) => {
                  setFieldValue("fieldType", val);
                  const shouldShowOptions = val === "Select (Single)" || val === "Select (Multiple)";
                  setShowOptions(shouldShowOptions);
                  if (shouldShowOptions) {
                    setFieldValue("options", []);
                  }
                }}
              />
              <CustomSelect
                name="moduleType"
                label="Module Type"
                options={moduleTypeOptions}
                required
                value={values.moduleType}
                onChange={(val) => setFieldValue("moduleType", val)}
              />
                              {showOptions && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Options <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2 mb-3">
                    {values.options && values.options.length > 0 && values.options.map((opt, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <InputField
                          name={`options.${idx}`}
                          label={null}
                          required
                          placeholder="Enter option"
                          style={{ flex: 1 }}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => {
                            const newOptions = [...values.options];
                            newOptions.splice(idx, 1);
                            setFieldValue("options", newOptions);
                          }}
                          title="Remove option"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    type="dashed"
                    onClick={() => setFieldValue("options", [...(values.options || []), ""])}
                    icon={<PlusOutlined />}
                    style={{ width: "100%" }}
                  >
                    Add Option
                  </Button>
                  <ErrorMessage name="options" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              )}
              <InputField name="defaultValue" label="Default Value" />
              <InputField name="placeholder" label="Placeholder" />
              <InputField name="description" label="Description" isTextarea />
              <InputField name="minLength" label="Min Length" type="number" />
              <InputField name="maxLength" label="Max Length" type="number" />
              <InputField name="order" label="Order" type="number" />
              <div className="col-span-2">
                <Divider>Field Settings</Divider>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Required</label>
                <Switch
                  checked={values.isRequired}
                  onChange={(checked) => setFieldValue("isRequired", checked)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Active</label>
                <Switch
                  checked={values.isActive}
                  onChange={(checked) => setFieldValue("isActive", checked)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Unique</label>
                <Switch
                  checked={values.isUnique}
                  onChange={(checked) => setFieldValue("isUnique", checked)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Searchable</label>
                <Switch
                  checked={values.isSearchable}
                  onChange={(checked) => setFieldValue("isSearchable", checked)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Filterable</label>
                <Switch
                  checked={values.isFilterable}
                  onChange={(checked) => setFieldValue("isFilterable", checked)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Exportable</label>
                <Switch
                  checked={values.isExportable}
                  onChange={(checked) => setFieldValue("isExportable", checked)}
                />
              </div>
              <InputField name="validation" label="Custom Validation (JSON)" isTextarea />
              <div className="col-span-2 flex justify-end mt-6">
                <FormButtons
                  isLoading={createResponse.isLoading || updateResponse.isLoading}
                  isUpdate={!!formValue?._id}
                  onCancel={handleCancel}
                />
              </div>
            </Form>
          )}
        </Formik>
    </div>
  );
};

export default MainDynamicField; 