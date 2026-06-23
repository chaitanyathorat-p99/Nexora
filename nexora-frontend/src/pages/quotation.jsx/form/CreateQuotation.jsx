import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as yup from "yup";
import {
  useCreateDealMutation,
  useCreateQuotationMutation,
  useUpdateDealMutation,
  useUpdateQuotationMutation,
} from "../../../features/allApi";
import { Button, message, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import Dummy from "../../../atoms/input/Dummy";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import SelectButton from "../../../atoms/select/SelectButton";
import { QuotationStage } from "../../../atoms/State";
import ProductArray from "../../product/productarray/ProductArray";
import MainProduct from "../../product/form/MainProduct";
import SelectProductDropDown from "../../../components/advanceSelections/SelectProductDropDown";
import RichTextEditor from "../../../atoms/input/RichTextEditor";
import FormButtons from "../../../atoms/button/FormButtons";
import DynamicFieldRenderer from "../../../components/dynamic-fields/DynamicFieldRenderer";
import { useFetchDynamicFieldsByModuleQuery } from "../../../features/allApi";

const CreateQuotation = ({ formValue, performCancel, deal_id,lead }) => {
  const handleSubmit = (
    values,
    createLead,
    formValue,
    updateLead,
    user,
    revision,
    dynamicFields
  ) => {
    // Ensure deal is a string (deal ID)
    if (values.deal && typeof values.deal === "object" && (values.deal._id || values.deal.id)) {
      values.deal = values.deal._id || values.deal.id;
    }
    
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
    
    if (formValue?._id && !revision) {
      updateLead(formData);
    } else {
      formData.createdBy = user?._id;
      delete formData?._id;
      createLead(formData);
    }
  };

  console.log("formValue", formValue?.deal?.product);
  const initialValues = {
    name: "",
    title: "",
    intro: "",
    scope: "",
    termsAndCondition: "",
    createdBy: null,
    stage: "New",
    deal:
      deal_id?._id ||
      (typeof formValue?.deal === "string"
        ? formValue?.deal
        : formValue?.deal?._id),
    lead: deal_id?.lead?._id || formValue?.deal?.lead || lead,
    product: [],
    discount: 0,
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    title: yup.string().required("Title is required"),
    termsAndCondition: yup.string(),
    scope: yup.string(),
    intro: yup.string(),
    stage: yup.string().required("Stage is required"),
    discount: yup.number(),
    product: yup.array(),
    deal: yup.string().nullable(),
    lead: yup.string().nullable(),
    createdBy: yup.string().nullable(),
  });
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  // Fetch dynamic fields for quotation module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "quotation" });

  const [createLead, GetLeadResponse] = useCreateQuotationMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateQuotationMutation();
  const [modelShow, setModelShow] = useState(false);
  const performCancel2 = () => {
    setModelShow(false);
  };
  const getProduct = (data) => {
    console.log(data);
  };

  const handleCancel = () => {
    performCancel();
  };
  return (
    <div className="flex min-h-full flex-1 flex-col   ">
      <FormHeader
        title={
          formValue?._id
            ? `Update Quotation ${formValue?.revisionNo}`
            : `Create Quotation`
        }
      />
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
          initialValues={
            formValue?._id
              ? { 
                  ...formValue, 
                  ...(formValue.dynamicFields || {}),
                  product: Array.isArray(formValue.product) ? formValue.product : [] 
                }
              : initialValues
          }
          validationSchema={validationSchema}
          onSubmit={(values) =>
            handleSubmit(values, createLead, formValue, updateLead, user, false, dynamicFields)
          }
        >
          {({ isSubmitting, errors, values }) => (
            <>
              <Form

              >
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2"
                  style={{ gap: "1rem" }}>
                  {console.log(errors)}
                  <InputField name={"title"} label={"Title"} required={true} />
                  {/* <InputField name={"quotationNo"} label={"Quotation No"} required={true} /> */}
                  <InputField name={"intro"} label={"Intro"} />
                  <InputField required={true} name={"name"} label={"Name"} />


                  <RichTextEditor
                    span={2}
                    isTextarea={true}
                    name={"scope"}
                    label={"Scope"}
                  />
                  <RichTextEditor
                    span={2}
                    isTextarea={true}
                    name={"termsAndCondition"}
                    label={"Terms And Condition"}
                  />
                  <SelectButton
                    array={QuotationStage}
                    name={"stage"}
                    label={"Stages"}
                  />
                  <InputField
                    type={"number"}
                    name={"discount"}
                    label={"Discount"}
                  />

                  <SelectProductDropDown getProduct={getProduct} values={values} />

                  <div className="sm:col-span-2" style={{ span: "4" }}>
                    <ProductArray
                      label={"Products"}
                      name={"product"}
                      setModelShow={setModelShow}
                    />
                  </div>

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
                </div>
                <div className="col-span-2 flex justify-end mt-6">
                  <FormButtons
                    isLoading={GetLeadResponse?.isLoading || GetUpdateLeadResponse?.isLoading}
                    onCancel={handleCancel}
                    isUpdate={!!formValue?._id}
                  />
                </div>
              </Form>

            </>
          )}
        </Formik>
      </div>
      {modelShow && <MainProduct performCancel={performCancel2} />}
    </div>
  );
};

export default CreateQuotation;
