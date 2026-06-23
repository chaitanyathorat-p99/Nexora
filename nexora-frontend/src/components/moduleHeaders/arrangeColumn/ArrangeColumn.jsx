import { Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { ForLead } from "../../../atoms/StaticColumnDisplay";
import { useSelector } from "react-redux";
import ArrangeArrayForm from "./ArrangeArrayForm";
import SubmitButton from "../../../atoms/button/SubmitButton";
import InputField from "../../../atoms/input/InputField";
import { useCreateColumnsMutation } from "../../../features/allApi";
import EResponse from "../../../atoms/response/EResponse";
import './arrange.css'
const handleSubmit = (values,createColumns) => {
  createColumns(values);
};
const ArrangeColumn = ({ formValue ,performCancel,title}) => {
  const { isAuthenticated, userToken, loading, user ,columns} = useSelector(
    (state) => state.user
  );
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    user: yup.string().required("Title is required"),
    columns: yup.array(),
  });

  
  const [createColumns, GetColumnsResponse] = useCreateColumnsMutation();

  return (
    <div>
       <EResponse
        error={GetColumnsResponse?.error?.data?.message}
        Response={GetColumnsResponse}
        type={"create"}
        cancel={()=>performCancel(userToken)}
      />
      <Formik
        initialValues={ ForLead(columns,user,title)}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values,createColumns)}
      >

        {({ isSubmitting, errors, values }) => (
          <Form
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-1"
            style={{ gap: "1rem" }}
          >

            <InputField  name={"name"} label={"Name"} required={true} display={"none"} />

            <ArrangeArrayForm label={"Columns"} name={"columns"} />
            <SubmitButton formValue={formValue} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ArrangeColumn;
