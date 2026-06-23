import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import { useCreateIndustryTypeMutation, useCreateTypeOfBuyerMutation, useUpdateIndustryTypeMutation, useUpdateTypeOfBuyerMutation } from "../../../features/allApi";
import { Popconfirm } from "antd";
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

const CreateSegment = ({ formValue, performCancel }) => {
    const initialValues = {
        name: "",
        desc: "",
    };
    const validationSchema = yup.object().shape({
        name: yup.string().required("Industry Type Name is required"),
        desc: yup.string(),
    });
    const navigate = useNavigate();
    const { isAuthenticated, userToken, loading, user } = useSelector(
        (state) => state.user
    );
    const [createLead, GetLeadResponse] = useCreateIndustryTypeMutation();
    const [updateLead, GetUpdateLeadResponse] = useUpdateIndustryTypeMutation();
    // console.log(leadObj)

    const handleCancel = () => {
        performCancel();
    };

    return (
        <div className="flex min-h-full flex-1 flex-col   ">
            <FormHeader title={formValue?._id ? `Update Industry Type` : `Create Industry Type`} />
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
                        <Form
                            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2"
                            style={{ gap: "1rem" }}
                        >
                            <InputField
                                name="name"
                                label="Industry Type"
                                placeholder="Industry Type"
                            />
                            <InputField
                                name="desc"
                                label="desc"
                                placeholder="Description"
                            />
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

export default CreateSegment;