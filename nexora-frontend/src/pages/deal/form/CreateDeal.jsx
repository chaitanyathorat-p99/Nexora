import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as yup from "yup";
import {
  useCreateCompanyMutation,
  useCreateDealMutation,
  useCreateProductsMutation,
  useFetchUserQuery,
  useUpdateCompanyMutation,
  useUpdateDealMutation,
  useUpdateProductMutation,
  useGetLeadDetailsQuery
} from "../../../features/allApi";
import { Button, message, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import Dummy from "../../../atoms/input/Dummy";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import SelectButton from "../../../atoms/select/SelectButton";
import {
  currencyCodes,
  dealStagesArray,
  dealTypeArray,
  FinalTotal,
  FinalTotalDiscount,
  priceTypeArray,
  productType,
} from "../../../atoms/State";
import SelectProductDropDown from "../../../components/advanceSelections/SelectProductDropDown";
import ProductArray from "../../product/productarray/ProductArray";
import LeadPopUp from "../../lead/LeadPopUp";
import MainProduct from "../../product/form/MainProduct";
import { skipToken } from "@reduxjs/toolkit/query";
import FormButtons from '../../../atoms/button/FormButtons';
import DynamicFieldRenderer from "../../../components/dynamic-fields/DynamicFieldRenderer";
import { useFetchDynamicFieldsByModuleQuery } from "../../../features/allApi";
import { CreateFormCard, CreateFormForm } from "../../../components/forms/CreateFormShell";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const toNumberOrZero = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const normalizeDealProduct = (product) => {
  const productId = getId(product?.productId) || getId(product);
  const productType =
    typeof product?.productType === "object" && product?.productType
      ? product.productType.name || product.productType._id || ""
      : product?.productType || "";

  return {
    ...(objectIdPattern.test(productId) ? { productId } : {}),
    name: product?.name || "",
    productType,
    priceType: product?.priceType || "",
    price: toNumberOrZero(product?.price),
    discount: toNumberOrZero(product?.discount),
    quantity: toNumberOrZero(product?.quantity) || 1,
    total: toNumberOrZero(product?.total) || toNumberOrZero(product?.price) * (toNumberOrZero(product?.quantity) || 1),
  };
};

const CreateDeal = ({ formValue, performCancel: externalPerformCancel, lead_id }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  // Fetch dynamic fields for deal module
  const { data: dynamicFields, isLoading: dynamicFieldsLoading } = useFetchDynamicFieldsByModuleQuery({ moduleType: "deal" });

  const [createLead, GetLeadResponse] = useCreateDealMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateDealMutation();
  
  const performCancel = externalPerformCancel || (() => navigate("/deals"));

  const handleCancel = () => {
    navigate("/deals");
  };

  const initializeDynamicFields = () => {
    const dynamicFieldValues = {};
    if (dynamicFields && Array.isArray(dynamicFields)) {
      dynamicFields.forEach(field => {
        dynamicFieldValues[field.fieldName] = "";
      });
    }
    return dynamicFieldValues;
  };

  const initialValues = {
    dealType: "",
    dealStages: "",
    currencyType: "",
    dealValue: "",
    product: [],
    lead: lead_id || "",
    totalWithDiscount: "",
    ...initializeDynamicFields(),
  };

  const handleSubmit = (values) => {
    if (!values?.lead) {
      return message.error("Select Lead");
    }
    
    // Extract dynamic field values
    const dynamicFieldValues = {};
    if (dynamicFields && Array.isArray(dynamicFields)) {
      dynamicFields.forEach(field => {
        if (values[field.fieldName] !== undefined) {
          dynamicFieldValues[field.fieldName] = values[field.fieldName];
        }
      });
    }
    
    // Add dynamic fields to the form data
    const formData = {
      dealType: values.dealType,
      dealStages: values.dealStages,
      currencyType: values.currencyType,
      dealValue: toNumberOrZero(values.dealValue),
      product: Array.isArray(values.product)
        ? values.product.map(normalizeDealProduct)
        : [],
      lead: getId(values.lead),
      totalWithDiscount:
        values.totalWithDiscount === "" || values.totalWithDiscount === null || values.totalWithDiscount === undefined
          ? toNumberOrZero(FinalTotal(values.product)) - toNumberOrZero(FinalTotalDiscount(values.product, values?.discount || 0))
          : toNumberOrZero(values.totalWithDiscount),
      ...(Object.keys(dynamicFieldValues).length > 0 && { dynamicFields: dynamicFieldValues })
    };
    
    if (formValue?._id) {
      updateLead({ ...formData, _id: formValue._id });
    } else {
      formData.createdBy = user?._id;
      createLead(formData);
    }
  };

  const productSchema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    priceType: yup.string().required("Price type is required"),
    subscriptionCycle: yup.number(),
    billingCycle: yup.number(),
    price: yup
      .number()
      .required("Price is required")
      .positive("Price must be positive"),
    discount: yup
      .number()
      .required("Discount is required")
      .min(0, "Discount cannot be negative"),
    productType: yup.string().required("Product type is required"),
    quantity: yup
      .number()
      .required("Quantity is required")
      .positive("Quantity must be positive"),
  });

  const validationSchema = yup.object().shape({
    dealType: yup.string().required("Deal type is required"),
    dealStages: yup.string().required("Deal stages are required"),
    currencyType: yup.string().required("Currency type is required"),
    dealValue: yup
      .number()
      .required("Deal value is required")
      .positive("Deal value must be positive"),
    product: yup.array(),
    lead: yup.string().required("Lead is required"),
    totalWithDiscount: yup.number().nullable(),
  });

  const [modelShow, setModelShow] = useState(false);
  const performCancel2 = () => {
    setModelShow(false);
  };

  const [leadShow, setLeadShow] = useState(false);
  const [selectedLead, setSelectedLead] = useState(formValue?._id ? formValue.lead : lead_id || "");
  
  const getProduct = (data) => {
    console.log(data);
  };

  const {
    data: leadData,
    isLoading: isLoadingLeadData,
    isFetching: fetchingLeadData,
    error: leadDataError,
  } = useGetLeadDetailsQuery(selectedLead ? { _id: selectedLead } : skipToken, {
    skip: !selectedLead,
  });

  return (
    <div className="flex min-h-full flex-1 flex-col   ">
      <FormHeader title={formValue?._id ? `Update Deal` : `Create Deal`} />
      <EResponse
        error={GetLeadResponse?.error?.data?.message}
        Response={GetLeadResponse}
        type={"create"}
        cancel={performCancel}
        navigateTo={lead_id ? "" : "/deals"}
      />
      <EResponse
        error={GetUpdateLeadResponse?.error?.data?.message}
        Response={GetUpdateLeadResponse}
        type={"update"}
        cancel={performCancel}
        navigateTo={lead_id ? "" : "/deals"}

      />
      <div className=" sm:mx-auto w-full ">
        <Formik
          initialValues={formValue?._id ? {
            dealType: formValue.dealType || "",
            dealStages: formValue.dealStages || "",
            currencyType: formValue.currencyType || "",
            dealValue: formValue.dealValue || "",
            product: formValue.product || [],
            lead: formValue.lead || "",
            totalWithDiscount: formValue.totalWithDiscount || "",
            ...(formValue.dynamicFields || {})
          } : initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting, errors, values, setFieldValue }) => (
            <CreateFormCard>
              <CreateFormForm>
                {console.log(FinalTotal(values?.product))}

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
                  setSelectedLead={(lead) => {
                    setSelectedLead(lead);
                    setFieldValue('lead', lead);
                  }}
                  performCancel={() => setLeadShow(false)}
                  />
                )}

                <SelectButton
                  array={dealTypeArray}
                  name={"dealType"}
                  label={"Deal Type"}
                />
                <SelectButton
                  array={dealStagesArray}
                  name={"dealStages"}
                  label={"Deal Stages"}
                />
                <SelectButton
                  array={currencyCodes}
                  name={"currencyType"}
                  label={"Currency Type"}
                />

                <InputField
                  type={"number"}
                  name={"dealValue"}
                  label={"Deal Value"}
                />
                <SelectProductDropDown getProduct={getProduct} values={values} />
                <Dummy />
                <div className="sm:col-span-2" style={{ span: "4" }}>
                  <ProductArray label={"Products"} name={"product"} setModelShow={setModelShow} />
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
        {modelShow && <MainProduct performCancel={performCancel2} />}

      </div>
    </div>
  );
};

export default CreateDeal;
