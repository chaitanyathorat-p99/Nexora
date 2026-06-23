import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import {
  useCreateLeadStatusMutation,
  useUpdateLeadStatusMutation,
} from "../../../features/allApi";
import { message, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import BooleanInput from "../../../atoms/input/BooleanInput";
import FormButtons from "../../../atoms/button/FormButtons";

const CreateLeadStatus = ({ formValue }) => {
  const initialValues = {
    name: "",
    description: "",
    place: "",
    reason: false,
  };

  


  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    place: yup
      .number()
      .typeError("Place must be a number")
      .required("Place is required"),
    // companyMaster:yup.string().required("company is required")
  });

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  console.log("user",user) 

  const [createLead, GetLeadResponse] = useCreateLeadStatusMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateLeadStatusMutation();

  useEffect(() => {
    if (GetLeadResponse?.isSuccess) {
      message.success("Lead Status Created");
      navigate("/leads-status");
    }
    if (GetLeadResponse?.isError) {
      message.error(GetLeadResponse?.error?.data?.message || "Creation failed");
    }
  }, [GetLeadResponse]);

  useEffect(() => {
    if (GetUpdateLeadResponse?.isSuccess) {
      message.success("Lead Status Updated");
      navigate("/leads-status");
    }
    if (GetUpdateLeadResponse?.isError) {
      message.error(
        GetUpdateLeadResponse?.error?.data?.message || "Update failed"
      );
    }
  }, [GetUpdateLeadResponse]);

  const handleCancel = () => {
    navigate("/leads-status");
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      // Keep payload types consistent for backend validation/indexing.
      place: Number(values.place),
    };

    if (formValue?._id) {
      await updateLead(payload);
    } else {
      // Backend reads company/user from JWT and sets scope server-side.
      await createLead(payload);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {formValue?._id ? "Update Lead Status" : "Create Lead Status"}
        </h2>
      </div>

      <div className="sm:mx-auto w-full px-4">
        <Formik
          initialValues={formValue?._id ? formValue : initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField  name="name" label="Name" />
              <InputField  name="description" label="Description" />
              <InputField
                type="number"
                name="place"
                label="Place"
              />
              <BooleanInput name="reason" label="Reason" />

              {/* Submit and Cancel Buttons */}
              <div className="col-span-2 flex justify-end mt-6">
                <FormButtons
                  isLoading={GetLeadResponse?.isLoading || GetUpdateLeadResponse?.isLoading}
                  onCancel={handleCancel}
                  isUpdate={!!formValue?._id}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateLeadStatus;
