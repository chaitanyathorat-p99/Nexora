import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import { message, Popconfirm, Button, Space } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import Dummy from "../../../atoms/input/Dummy";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import FormButtons from "../../../atoms/button/FormButtons";
import { useCreateLimitMutation, useUpdateLimitMutation, useFetchFeaturesMasterQuery } from "../../../features/allApi";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const CreateLimit = ({ formValue }) => {
  const [featureOptions, setFeatureOptions] = useState([]);
  
  const { data: features } = useFetchFeaturesMasterQuery({ 
    filterString: "", 
    filterObj: "" 
  });
  
  useEffect(() => {
    if (features && features.length > 0) {
      setFeatureOptions(features.map(feature => ({ 
        label: feature.name, 
        value: feature.name 
      })));
    }
  }, [features]);
  
  // Convert Map to array of key-value pairs for form
  const convertMapToArray = (featurelimit) => {
    if (!featurelimit) return [];
    // If it's already in the format we need, return it
    if (Array.isArray(featurelimit)) return featurelimit;
    
    // Handle Map or object
    const featureLimitObj = featurelimit instanceof Map ? 
      Object.fromEntries(featurelimit) : featurelimit;
    
    return Object.entries(featureLimitObj).map(([key, value]) => ({
      feature: key,
      limit: value
    }));
  };
  
  // Convert array of key-value pairs back to object for API
  const convertArrayToMap = (featurelimitArray) => {
    if (!featurelimitArray) return {};
    return featurelimitArray.reduce((obj, item) => {
      if (item.feature && item.limit) {
        obj[item.feature] = item.limit;
      }
      return obj;
    }, {});
  };
  
  const initialValues = {
    name: "",
    description: "",
    featurelimitArray: []
  };

  // Prepare initialValues with formValue if provided
  const prepareInitialValues = () => {
    if (formValue?._id) {
      return {
        name: formValue.name || "",
        description: formValue.description || "",
        featurelimitArray: convertMapToArray(formValue.featurelimit) || []
      };
    }
    return initialValues;
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Limit name is required"),
    description: yup.string(),
    featurelimitArray: yup.array().of(
      yup.object().shape({
        feature: yup.string().required("Feature is required"),
        limit: yup.string().required("Limit value is required")
      })
    )
  });
  
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  const [createLimit, createLimitResponse] = useCreateLimitMutation();
  const [updateLimit, updateLimitResponse] = useUpdateLimitMutation();

  const handleCancel = () => {
    navigate('/limits');
  };

  const handleSubmit = async (values) => {
    try {
      // Convert featurelimitArray to featurelimit object before submitting
      const submitValues = {
        ...values,
        featurelimit: convertArrayToMap(values.featurelimitArray)
      };
      delete submitValues.featurelimitArray;

      if (formValue?._id) {
        await updateLimit({ _id: formValue._id, ...submitValues }).unwrap();
        message.success("Limit updated successfully");
        navigate('/limits');
      } else {
        submitValues.createdBy = user?._id;
        await createLimit(submitValues).unwrap();
        // message.success("Limit created successfully");
        navigate('/limits');
      }
    } catch (error) {
      message.error(error?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <FormHeader title={formValue?._id ? `Update Limit` : `Create Limit`} />
      <EResponse
        error={createLimitResponse?.error?.data?.message}
        Response={createLimitResponse}
        type={"create"}
        navigateTo={'/limits'}
      />
      <EResponse
        error={updateLimitResponse?.error?.data?.message}
        Response={updateLimitResponse}
        type={"update"}
        navigateTo={'/limits'}
      />
      <div className="sm:mx-auto w-full">
        <Formik
          initialValues={prepareInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, values, touched, setFieldValue }) => (
            <Form
              className="grid grid-cols-1 gap-y-6 sm:grid-cols-2"
              style={{ gap: "1rem" }}
            >
              <InputField name={"name"} label={"Limit Name"} />
              <InputField name={"description"} label={"Description"} />
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feature Limits
                </label>
                <FieldArray name="featurelimitArray">
                  {({ remove, push }) => (
                    <div className="space-y-2">
                      {values.featurelimitArray.length > 0 &&
                        values.featurelimitArray.map((_, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1/2">
                              <Field
                                as="select"
                                name={`featurelimitArray.${index}.feature`}
                                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              >
                                <option value="">Select Feature</option>
                                {featureOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </Field>
                              {touched.featurelimitArray && 
                               touched.featurelimitArray[index] && 
                               errors.featurelimitArray && 
                               errors.featurelimitArray[index] && 
                               errors.featurelimitArray[index].feature && (
                                <div className="text-red-500 text-xs mt-1">
                                  {errors.featurelimitArray[index].feature}
                                </div>
                              )}
                            </div>
                            <div className="w-1/2">
                              <Field
                                name={`featurelimitArray.${index}.limit`}
                                type="text"
                                placeholder="Limit Value"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              {touched.featurelimitArray && 
                               touched.featurelimitArray[index] && 
                               errors.featurelimitArray && 
                               errors.featurelimitArray[index] && 
                               errors.featurelimitArray[index].limit && (
                                <div className="text-red-500 text-xs mt-1">
                                  {errors.featurelimitArray[index].limit}
                                </div>
                              )}
                            </div>
                            <MinusCircleOutlined
                              className="text-red-500 cursor-pointer"
                              onClick={() => remove(index)}
                            />
                          </div>
                        ))}
                      <Button
                        type="dashed"
                        onClick={() => push({ feature: '', limit: '' })}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Feature Limit
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>
              
              <Dummy />
              <FormButtons
                isLoading={createLimitResponse?.isLoading || updateLimitResponse?.isLoading}
                onCancel={handleCancel}
                isUpdate={!!formValue?._id}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateLimit; 