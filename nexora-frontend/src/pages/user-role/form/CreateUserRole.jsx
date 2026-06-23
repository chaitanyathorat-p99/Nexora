import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  useCreateUserRoleMutation,
  useFetchUserQuery,
  useUpdateUserRoleMutation,
} from "../../../features/allApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import InputField from "../../../atoms/input/InputField";
import EResponse from "../../../atoms/response/EResponse";
import PermissionsField from "../permission/PermissionsField";
import SelectButton from "../../../atoms/select/SelectButton";
import { rolesArray } from "../../../atoms/State";
import FormButtons from "../../../atoms/button/FormButtons";
const handleSubmit = (values, createLead, formValue, updateLead, user) => {
    console.log(values);
  if (formValue?._id) {
    updateLead(values);
  } else {
    
    createLead(values);
  }
  // console.log(values)
};


const CreateUserRole = ({ formValue }) => {
  const {
    data: client_user,
    isLoading: client_isLoading,
    isFetching: client_fetch,
  } = useFetchUserQuery({ type: `userType=Client` });
  const {
    data: system_user,
    isLoading: system_isLoading,
    isFetching: system_fetch,
  } = useFetchUserQuery({ type: `userType=System` });
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    isActive: yup.boolean(),
    permissions: yup
      .array()
      .of(
        yup.object().shape({
          modelName: yup.string().required("Model name is required"),
          read: yup.boolean(),
          write: yup.boolean(),
          update: yup.boolean(),
          delete: yup.boolean(),
        })
      )
      .required("Permissions are required")
      .min(1, "At least one permission is required"),
  });
  const initialValues = {
    name: "",
    isActive: true,
    permissions: [
      {
        modelName: "",
        read: false,
        write: false,
        update: false,
        delete: false,
      },
    ],
  };
  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
  const [createLead, GetLeadResponse] = useCreateUserRoleMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateUserRoleMutation();

  const handleCancel=()=>{
   navigate("/user-role")
}

  return (
    <div>
      <EResponse
        error={GetLeadResponse?.error?.data?.message}
        Response={GetLeadResponse}
        type={"create"}
        navigateTo={"/user-role"}
      />
      <EResponse
        error={GetUpdateLeadResponse?.error?.data?.message}
        Response={GetUpdateLeadResponse}
        type={"update"}
        navigateTo={"/user-role"}
      />
      <FormHeader title={`${formValue?._id?"Update":"Create"} User Role`} />

      <div className=" sm:mx-auto w-full ">
        <Formik
          initialValues={formValue?._id ? formValue : initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) =>
            handleSubmit(values, createLead, formValue, updateLead, user)
          }
        >
          {({ isSubmitting }) => (
            // <Form className="space-y-6">
            <Form
              className="grid grid-cols-1 gap-y-6 sm:grid-cols-2"
              style={{ gap: "1rem" }}
            >
              <InputField required={true} name={"name"} label={"Name"} />
              {/* <SelectButton
              required={true}
                array={rolesArray}
                name={"name"}
                label={"Name"}
              /> */}
              {/* <div className="my-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Active
                </label>
                <Field
                  name="isActive"
                  type="checkbox"
                  className="mr-2 leading-tight"
                />
                <ErrorMessage
                  name="isActive"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div> */}
              <div className="sm:col-span-2">

              <PermissionsField label="Permissions" name="permissions" allowedModules={user?.plan?.featuresMasterIds?.map(f => f.name) || []} />
              </div>
       

              {/* <Dummy /> */}
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

export default CreateUserRole;
