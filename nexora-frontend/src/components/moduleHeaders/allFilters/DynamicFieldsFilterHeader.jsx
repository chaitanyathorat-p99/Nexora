import React from "react";
import FilterButton from "../../../atoms/button/FilterButton";
import { TagOutlined, CheckCircleOutlined, AppstoreOutlined } from "@ant-design/icons";
import SelectOneValueFilter from "../../../atoms/cards/SelectOneValueFilter";

const moduleTypeOptions = [
  { label: "Lead", value: "lead" },
  { label: "Deal", value: "deal" },
  { label: "Company", value: "company" },
  { label: "Task", value: "task" },
  { label: "Meeting", value: "meeting" },
  { label: "Call", value: "call" },
  { label: "Product", value: "product" },
  { label: "User", value: "user" },
  { label: "Ticket", value: "ticket" },
  { label: "Enquiry", value: "enquiry" },
];

const fieldTypeOptions = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Date", value: "date" },
  { label: "Datetime", value: "datetime" },
  { label: "Select", value: "select" },
  { label: "Multiselect", value: "multiselect" },
  { label: "Textarea", value: "textarea" },
  { label: "Boolean", value: "boolean" },
  { label: "URL", value: "url" },
  { label: "Currency", value: "currency" },
  { label: "Percentage", value: "percentage" },
];

const yesNoOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const DynamicFieldsFilterHeader = ({ filterUltimate, setFilterUltimate }) => {
  return (
    <>
      <FilterButton
        label="Module Type"
        icon={<AppstoreOutlined />}
        active={!!filterUltimate["moduleType"]}
        customContent={
          <SelectOneValueFilter
            array={moduleTypeOptions}
            nameKey={"moduleType"}
            label="Module Type"
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
      <FilterButton
        label="Field Type"
        icon={<TagOutlined />}
        active={!!filterUltimate["fieldType"]}
        customContent={
          <SelectOneValueFilter
            array={fieldTypeOptions}
            nameKey={"fieldType"}
            label="Field Type"
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
      <FilterButton
        label="Active"
        icon={<CheckCircleOutlined />}
        active={filterUltimate["isActive"] !== undefined}
        customContent={
          <SelectOneValueFilter
            array={yesNoOptions}
            nameKey={"isActive"}
            label="Active"
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
      <FilterButton
        label="Required"
        icon={<CheckCircleOutlined />}
        active={filterUltimate["isRequired"] !== undefined}
        customContent={
          <SelectOneValueFilter
            array={yesNoOptions}
            nameKey={"isRequired"}
            label="Required"
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
    </>
  );
};

export default DynamicFieldsFilterHeader; 