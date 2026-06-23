import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  useCreateCompanyMutation,
  useCreateRatingMutation,
  useFetchUserQuery,
  useUpdateCompanyMutation,
  useUpdateRatingMutation,
} from "../../../features/allApi";
import { message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import Dummy from "../../../atoms/input/Dummy";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import SelectButton from "../../../atoms/select/SelectButton";
import {
  addOrSubArray,
  betweenArray,
  leadObj,
  sourceArray,
  statesInIndia,
} from "../../../atoms/State";
import SelectKeyButton from "../../../atoms/select/SelectKeyButton";
import TagsInput from "../../../atoms/input/TagsInput";
import MultiSelectDropdown from "../../../atoms/select/MultiSelectDropdown";
import MultiSelectStatus from "../../../atoms/select/MultiSelectStatus";
import RenderFieldComponent from "../components/RenderFieldComponent";
import FormButtons from '../../../atoms/button/FormButtons';
const handleSubmit = (values, createLead, formValue, updateLead, user) => {
  if (formValue?._id) {
    console.log(values);
    updateLead(values);
  } else {
    values.createdBy = user?._id;
    console.log(values);
    createLead(values);
  }
  // console.log(values)
};
const CreateRating = ({ formValue, performCancel, lead }) => {
  const initialValues = {
    companyMaster: null,
    createdBy: null,

    field: "",

    betweenValue: "",
    addOrSub: "Add",
    compareTo: [],
    weight: "",
  };

  const validationSchema = yup.object().shape({
    field: yup.string().required("Field is required"),
    betweenValue: yup.string().required("Between Value is required"),
    addOrSub: yup.string().required("Between Value is required"),
    weight: yup.string().required("Weight is required"),
    compareTo: yup.array().of(yup.string()),

    companyMaster: yup.string().nullable(),
    createdBy: yup.string().nullable(),
  });

  const navigate = useNavigate();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  const [createLead, GetLeadResponse] = useCreateRatingMutation();
  const [updateLead, GetUpdateLeadResponse] = useUpdateRatingMutation();
  console.log(leadObj)
  return (
    <div className="flex min-h-full flex-1 flex-col   ">
      <FormHeader title={formValue?._id ? `Update Rating` : `Create Rating`} />
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
          initialValues={formValue?._id ? formValue : initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) =>
            handleSubmit(values, createLead, formValue, updateLead, user)
          }
        >
          {({ isSubmitting, errors, values }) => (
            // <Form className="space-y-6">
            <Form
              className="grid grid-cols-1 gap-y-6 sm:grid-cols-2"
              style={{ gap: "1rem" }}
            >
              <SelectKeyButton array={leadObj} name={"field"} label={"Field"} />
              <SelectButton
                array={betweenArray}
                name={"betweenValue"}
                label={"Between Value"}
              />
              <RenderFieldComponent values={values} />

              <SelectButton
                array={addOrSubArray}
                name={"addOrSub"}
                label={"Add or Sub"}
              />

              <InputField type={"number"} name={"weight"} label={"Weight"} />

              <Dummy />
              <div className="col-span-2 flex justify-end mt-6">
                <FormButtons
                  isLoading={GetLeadResponse?.isLoading || GetUpdateLeadResponse?.isLoading}
                  onCancel={performCancel}
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

export default CreateRating;
