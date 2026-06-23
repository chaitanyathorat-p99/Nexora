import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { message, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import Dummy from "../../../atoms/input/Dummy";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import FormButtons from "../../../atoms/button/FormButtons";
import { useCreateFeatureMasterMutation, useUpdateFeatureMasterMutation } from "../../../features/allApi";

const CreateFeatureMaster = ({ formValue }) => {
  const initialValues = {
    name: "",
    description: "",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Feature name is required"),
    description: yup.string(),
  });
  
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  const [createFeature, createFeatureResponse] = useCreateFeatureMasterMutation();
  const [updateFeature, updateFeatureResponse] = useUpdateFeatureMasterMutation();

  const handleCancel = () => {
    navigate('/features');
  };

  const handleSubmit = async (values) => {
    try {
      if (formValue?._id) {
        const result = await updateFeature({ _id: formValue._id, ...values }).unwrap();
        // message.success("Feature updated successfully");
        navigate('/features');
      } else {
        values.createdBy = user?._id;
        await createFeature(values).unwrap();
        // message.success("Feature created successfully");
        navigate('/features');
      }
    } catch (error) {
      message.error(error?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <FormHeader title={formValue?._id ? `Update Feature` : `Create Feature`} />
      <EResponse
        error={createFeatureResponse?.error?.data?.message}
        Response={createFeatureResponse}
        type={"create"}
        navigateTo={'/features'}
      />
      <EResponse
        error={updateFeatureResponse?.error?.data?.message}
        Response={updateFeatureResponse}
        type={"update"}
        navigateTo={'/features'}
      />
      <div className="sm:mx-auto w-full">
        <Formik
          initialValues={formValue?._id ? formValue : initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form
              className="grid grid-cols-1 gap-y-6 sm:grid-cols-2"
              style={{ gap: "1rem" }}
            >
              <InputField name={"name"} label={"Feature Name"} />
              <InputField name={"description"} label={"Description"} />
              <Dummy />
              <FormButtons
                isLoading={createFeatureResponse?.isLoading || updateFeatureResponse?.isLoading}
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

export default CreateFeatureMaster;

