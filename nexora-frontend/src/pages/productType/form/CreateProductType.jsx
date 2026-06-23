import React from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../../../atoms/input/InputField";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import EResponse from "../../../atoms/response/EResponse";
import { useCreateProductTypeMutation, useUpdateProductTypeMutation } from "../../../features/allApi";
import FormButtons from "../../../atoms/button/FormButtons";

const handleSubmit = (values, createProductType, formValue, updateProductType, user) => {
    if (formValue?._id) {
        updateProductType(values);
    } else {
        values.createdBy = user?._id;
        createProductType(values);
    }
};

const CreateProductType = ({ formValue, performCancel }) => {
    const initialValues = {
        name: "",
        desc: "",
    };
    const validationSchema = yup.object().shape({
        name: yup.string().required("Product Type is required"),
        desc: yup.string(),
    });
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [createProductType, GetProductTypeResponse] = useCreateProductTypeMutation();
    const [updateProductType, GetUpdateProductTypeResponse] = useUpdateProductTypeMutation();
    return (
        <div className="flex min-h-full flex-1 flex-col">
            <FormHeader title={formValue?._id ? `Update Product Type` : `Create Product Type`} />
            <EResponse
                error={GetProductTypeResponse?.error?.data?.message}
                Response={GetProductTypeResponse}
                type={"create"}
                cancel={performCancel}
            />
            <EResponse
                error={GetUpdateProductTypeResponse?.error?.data?.message}
                Response={GetUpdateProductTypeResponse}
                type={"update"}
                cancel={performCancel}
            />
            <div className="sm:mx-auto w-full">
                <Formik
                    initialValues={formValue?._id ? formValue : initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) =>
                        handleSubmit(values, createProductType, formValue, updateProductType, user)
                    }
                >
                    {({ isSubmitting }) => (
                        <Form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2" style={{ gap: "1rem" }}>
                            <InputField
                                name="name"
                                label="Product Type"
                                placeholder="Product Type"
                            />
                            <InputField
                                name="desc"
                                label="Description"
                                placeholder="Description"
                            />
                            <div className="col-span-2 flex justify-end mt-6">
                                <FormButtons
                                    isLoading={GetProductTypeResponse?.isLoading || GetUpdateProductTypeResponse?.isLoading}
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

export default CreateProductType; 