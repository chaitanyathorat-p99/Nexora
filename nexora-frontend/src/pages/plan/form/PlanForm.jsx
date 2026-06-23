import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePlanMutation, useUpdatePlanMutation, useFetchFeaturesMasterQuery, useFetchLimitsQuery } from "../../../features/allApi";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import FormHeader from "../../../components/moduleHeaders/FormHeader";
import InputField from "../../../atoms/input/InputField";
import SelectButton from "../../../atoms/select/SelectButton";
import SelectButtonWithId from "../../../atoms/select/SelectButtonWithId";
import SelectButtonWithArrayId from "../../../atoms/select/SelectButtonWithArrayId";
import FormButtons from '../../../atoms/button/FormButtons';
import EResponse from '../../../atoms/response/EResponse';
import { Card, Collapse } from "antd";
import { Select } from 'antd';

const { Panel } = Collapse;

const PlanForm = ({ formValue }) => {
  const navigate = useNavigate();
  const [selectedLimit, setSelectedLimit] = useState(null);
  const [createPlan, createResponse] = useCreatePlanMutation();
  const [updatePlan, updateResponse] = useUpdatePlanMutation();
  const { data: features, isLoading: featuresLoading } = useFetchFeaturesMasterQuery({ filterString: "", filterObj: "" });
  const { data: limits, isLoading: limitsLoading } = useFetchLimitsQuery({ filterString: "", filterObj: "" });

  useEffect(() => {
    if (formValue && limits) {
      if (formValue.limitId) {
        const selectedLimitObj = limits.find(limit => limit._id === formValue.limitId);
        if (selectedLimitObj) {
          setSelectedLimit(selectedLimitObj);
        }
      }
    }
  }, [formValue, limits]);

  const initialValues = {
    name: formValue?.name || "",
    tier: formValue?.tier || "basic",
    priceMonthly: formValue?.price?.monthly ,
    priceYearly: formValue?.price?.yearly,
    durationOptions: formValue?.durationOptions || ["monthly"],
    featuresMasterIds: formValue?.featuresMasterIds ,
    limitId: formValue?.limitId || "",
    isActive: formValue?.isActive ?? true,
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Please enter plan name"),
    tier: yup.string().required("Please select plan tier"),
    priceMonthly: yup.number().required("Please enter monthly price"),
    priceYearly: yup.number().required("Please enter yearly price"),
    durationOptions: yup.array().min(1, "Select at least one duration option"),
    featuresMasterIds: yup.array().required("Select at least one feature"),
    limitId: yup.string().required("Please select a limit"),
    isActive: yup.boolean(),
  });

  if (featuresLoading || limitsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <EResponse
        error={createResponse?.error?.data?.message || updateResponse?.error?.data?.message}
        Response={formValue?._id ? updateResponse : createResponse}
        type={formValue?._id ? "update" : "create"}
        navigateTo={"/plans"}
      />
      <FormHeader title={formValue?._id ? "Edit Plan" : "Create Plan"} />
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values) => {
            const formattedValues = {
              name: values.name,
              tier: values.tier,
              price: {
                monthly: Number(values.priceMonthly),
                yearly: Number(values.priceYearly),
              },
              durationOptions: values.durationOptions,
              featuresMasterIds: values.featuresMasterIds,
              limitId: values.limitId || undefined,
              isActive: values.isActive,
            };
            if (formValue?._id) {
              await updatePlan({ _id: formValue._id, ...formattedValues });
            } else {
              await createPlan(formattedValues);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="name" label="Name"  placeholder="Enter plan name" />
                <SelectButton
                  name="tier"
                  label="Tier"
                  array={["free", "basic", "pro", "enterprise"]}
                />
                <InputField name="priceMonthly" label="Monthly Price (₹)" type="number"  placeholder="Enter monthly price" />
                <InputField name="priceYearly" label="Yearly Price (₹)" type="number"  placeholder="Enter yearly price" />
                {/* Multi-select for durationOptions */}
                <Field name="durationOptions">
                  {({ field, form }) => (
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">Duration Options</label>
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select duration options"
                        value={field.value}
                        onChange={value => form.setFieldValue('durationOptions', value)}
                      >
                        <Select.Option value="monthly">Monthly</Select.Option>
                        <Select.Option value="yearly">Yearly</Select.Option>
                      </Select>
                      {form.touched.durationOptions && form.errors.durationOptions && (
                        <div className="text-red-600 text-sm mt-1">{form.errors.durationOptions}</div>
                      )}
                    </div>
                  )}
                </Field>
                {/* End multi-select */}
                <SelectButtonWithArrayId
                  name="featuresMasterIds"
                  label="Select Features"
                  array={features || []}
                />
                <SelectButtonWithId
                  name="limitId"
                  label="Select Predefined Limit"
                  array={limits || []}
                />
                <InputField name="isActive" label="Active" type="checkbox" />
              </div>
              {values.limitId && limits && (
                <Card size="small" title="Selected Limit Details" style={{ marginBottom: 16, marginTop: 16 }}>
                  <p><strong>Name:</strong> {limits.find(l => l._id === values.limitId)?.name}</p>
                  <p><strong>Description:</strong> {limits.find(l => l._id === values.limitId)?.description || 'N/A'}</p>
                  <Collapse ghost>
                    <Panel header="View Limit Values" key="1">
                      {limits.find(l => l._id === values.limitId)?.featurelimit &&
                        Object.entries(limits.find(l => l._id === values.limitId).featurelimit).map(([key, value]) => (
                          <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                    </Panel>
                  </Collapse>
                </Card>
              )}
              <div className="col-span-2 flex justify-end mt-6">
                <FormButtons
                  isLoading={isSubmitting || createResponse?.isLoading || updateResponse?.isLoading}
                  onCancel={() => navigate("/plans")}
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

export default PlanForm; 