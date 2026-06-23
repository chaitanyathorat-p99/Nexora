import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  useCreateCompanyMutation,
  useCreateProductsMutation,
  useFetchUserQuery,
  useUpdateCompanyMutation,
  useUpdateProductMutation,
  useFetchProductTypeQuery,
} from "../../../features/allApi";
import { message, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import Dummy from "../../../atoms/input/Dummy";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import SelectButton from "../../../atoms/select/SelectButton";
import { priceTypeArray, productType } from "../../../atoms/State";
import FormButtons from "../../../atoms/button/FormButtons";
import DynamicFieldRenderer from "../../../components/dynamic-fields/DynamicFieldRenderer";
import { useFetchDynamicFieldsByModuleQuery } from "../../../features/allApi";
import { CreateFormCard, CreateFormForm } from "../../../components/forms/CreateFormShell";

const CreateProduct = ({ formValue, performCancel, lead }) => {
  const handleSubmit = (values, createLead, formValue, updateLead, user, dynamicFields) => {
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
      formData.createdBy = user?._id;
      createLead(formData);
    }
    // console.log(values)
  };
  const initialValues = {
    name: "",
    priceType: "",
    subscriptionCycle: "",
    billingCycle: "",
    price: "",
    discount: 0,
    productType: "",
    createdBy: null,
  };



  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    priceType: yup.string().required('Price Type is required'),
    subscriptionCycle: yup.string().nullable(),
    billingCycle: yup.string(),
    price: yup.number().required('Price is required').positive(),
    discount: yup.number().required('Discount is required').min(0).max(100),
    productType: yup.string().required('Product Type is required'),
    createdBy: yup.string().nullable(),
  });

  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  // Fetch dynamic fields for product module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "product" });

  const [createLead, GetLeadResponse] = useCreateProductsMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateProductMutation();
  const { data: productTypes, isLoading: loadingProductTypes } = useFetchProductTypeQuery();


  const handleCancel = () => {
    performCancel();
  };
  return (
    <div className="flex min-h-full flex-1 flex-col   ">
      <FormHeader
        title={formValue?._id ? `Update Product` : `Create Product`}
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
          initialValues={formValue?._id ? {
            ...formValue,
            ...(formValue.dynamicFields || {})
          } : initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) =>
            handleSubmit(values, createLead, formValue, updateLead, user, dynamicFields)
          }
        >
          {({ isSubmitting, errors, values, setFieldValue }) => (
            <CreateFormCard>
              <CreateFormForm>
                  <InputField name={"name"} label={"Product Name"} />
                  <div>
                    <label htmlFor="productType" className="block text-sm font-medium text-gray-700">Product Type</label>
                    <select
                      id="productType"
                      name="productType"
                      value={values.productType}
                      onChange={e => setFieldValue("productType", e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                      required
                      disabled={loadingProductTypes}
                    >
                      <option value="">Select Product Type</option>
                      {productTypes && productTypes.map(pt => (
                        <option key={pt._id} value={pt._id}>{pt.name}</option>
                      ))}
                    </select>
                  </div>
                  <SelectButton
                    array={priceTypeArray}
                    name={"priceType"}
                    label={"Price Type"}
                  />
                  {values?.priceType === "Subscription Cycle" && (
                    <>
                      <InputField
                        required={true}
                        type={"number"}
                        name={"subscriptionCycle"}
                        label={"Subscription Cycle"}
                      />
                      <InputField
                        required={true}
                        name={"billingCycle"}
                        label={"Billing Cycle"}
                      />
                    </>
                  )}
                  <InputField type={"number"} name={"price"} label={"Price"} />
                  <InputField
                    type={"number"}
                    name={"discount"}
                    label={"Discount"}
                  />


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

export default CreateProduct;
