import React from "react";
import { Field } from "formik";
import InputField from "../../atoms/input/InputField";
import SelectButton from "../../atoms/select/SelectButton";
import SelectButtonWithId from "../../atoms/select/SelectButtonWithId";
import DatePickerField from "../../atoms/input/DatePickerField";
import BooleanInput from "../../atoms/input/BooleanInput";
import DynamicFieldMultiselect from "../../atoms/select/Dynmic-Feild-Multiselect";

const DynamicFieldRenderer = ({ fields = [], initialValues = {}, mode = "edit" }) => {
  // Helper to render a field based on its type
  const renderField = (field) => {
    const commonProps = {
      name: field.fieldName,
      label: field.displayName,
      required: field.isRequired,
      placeholder: field.placeholder,
    };

    // Note: Multiselect fields should be initialized as arrays in the parent component

    if (mode === "view") {
      return (
        <div key={field.fieldName} className="col-span-1">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            {field.displayName}
          </label>
          <span className="mt-1 block text-sm text-gray-900">
            {initialValues[field.fieldName] || "-"}
          </span>
        </div>
      );
    }

    switch (field.fieldType) {
      case "text":
        return (
          <InputField 
            {...commonProps}
            key={field.fieldName}
            type="text"
          />
        );
      case "number":
        return (
          <InputField 
            {...commonProps}
            key={field.fieldName}
            type="number"
          />
        );
      case "email":
        return (
          <InputField 
            {...commonProps}
            key={field.fieldName}
            type="email"
          />
        );
      case "phone":
        return (
          <InputField 
            {...commonProps}
            key={field.fieldName}
            type="tel"
          />
        );
      case "date":
        return (
          <DatePickerField 
            {...commonProps}
            key={field.fieldName}
            showTime={false}
            format="DD/MM/YYYY"
          />
        );
      case "datetime":
        return (
          <DatePickerField 
            {...commonProps}
            key={field.fieldName}
            showTime={true}
            format="DD/MM/YYYY HH:mm"
          />
        );
      case "select":
        return (
          <SelectButton 
            {...commonProps}
            key={field.fieldName}
            array={field.options || []}
          />
        );
      case "multiselect":
        return (
          <DynamicFieldMultiselect 
            {...commonProps}
            key={field.fieldName}
            options={field.options || []}
          />
        );
      case "textarea":
        return (
          <InputField 
            {...commonProps}
            key={field.fieldName}
            isTextarea={true}
          />
        );
      case "boolean":
        return (
          <BooleanInput 
            {...commonProps}
            key={field.fieldName}
          />
        );
      case "url":
        return (
          <InputField 
            {...commonProps}
            key={field.fieldName}
            type="url"
          />
        );
      case "currency":
        return (
          <InputField 
            {...commonProps}
            key={field.fieldName}
            type="number"
            prefix="$"
          />
        );
      case "percentage":
        return (
          <InputField 
            {...commonProps}
            key={field.fieldName}
            type="number"
            min={0}
            max={100}
            suffix="%"
          />
        );
      default:
        return null;
    }
  };

  return <>{fields.map(renderField)}</>;
};

export default DynamicFieldRenderer; 