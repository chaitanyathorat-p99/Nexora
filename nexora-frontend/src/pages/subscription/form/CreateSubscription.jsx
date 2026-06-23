import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSubscriptionMutation, useFetchUserQuery, useUpdateSubscriptionMutation, useFetchCompanyMasterQuery, useFetchPlansQuery } from "../../../features/allApi";
import dayjs from "dayjs";
import { Formik, Form } from "formik";
import * as yup from "yup";
import FormHeader from '../../../components/moduleHeaders/FormHeader';
import InputField from '../../../atoms/input/InputField';
import SelectButtonWithId from '../../../atoms/select/SelectButtonWithId';
import SelectButton from '../../../atoms/select/SelectButton';
import DatePickerField from '../../../atoms/input/DatePickerField';
import FormButtons from '../../../atoms/button/FormButtons';
import EResponse from '../../../atoms/response/EResponse';

const CreateSubscription = ({ subscription }) => {
  const navigate = useNavigate();
  const [createSubscription, createResponse] = useCreateSubscriptionMutation();
  const [updateSubscription, updateResponse] = useUpdateSubscriptionMutation();
  const { data: companies, isLoading: companiesLoading } = useFetchCompanyMasterQuery({ filterString: "", filterObj: "" });
  const { data: plans } = useFetchPlansQuery({ filterString: "", filterObj: "", page: "" });
  const { data: users, isLoading: usersLoading } = useFetchUserQuery({ type: `userType=System` });

  const initialValues = {
    company: subscription?.company || "",
    user: subscription?.user || "",
    plan: subscription?.plan || "",
    planName: subscription?.planName || "",
    status: subscription?.status || "trial",
    billingCycle: subscription?.billingCycle || "monthly",
    startDate: subscription?.startDate ? dayjs(subscription.startDate).toISOString() : "",
    endDate: subscription?.endDate ? dayjs(subscription.endDate).toISOString() : "",
    isTrial: subscription?.isTrial ?? true,
    gracePeriodEndsAt: subscription?.gracePeriodEndsAt ? dayjs(subscription.gracePeriodEndsAt).toISOString() : "",
    isAutoRenew: subscription?.isAutoRenew ?? true,
    isCancelled: subscription?.isCancelled ?? false,
  };

  const validationSchema = yup.object().shape({
    company: yup.string().required("Please select a company"),
    user: yup.string().required("Please select a user"),
    plan: yup.string().required("Please select a plan"),
    status: yup.string().required("Please select status"),
    billingCycle: yup.string().required("Please select billing cycle"),
    startDate: yup.string().required("Please select start date"),
    endDate: yup.string().required("Please select end date"),
    planName: yup.string(),
    gracePeriodEndsAt: yup.string(),
    isTrial: yup.boolean(),
    isAutoRenew: yup.boolean(),
    isCancelled: yup.boolean(),
  });

  if (companiesLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <EResponse
        error={createResponse?.error?.data?.message || updateResponse?.error?.data?.message}
        Response={subscription?._id ? updateResponse : createResponse}
        type={subscription?._id ? "update" : "create"}
        navigateTo={"/subscriptions"}
      />
      <FormHeader title={subscription?._id ? "Edit Subscription" : "Create Subscription"} />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values) => {
            const formattedValues = {
              ...values,
              startDate: values.startDate,
              endDate: values.endDate,
              gracePeriodEndsAt: values.gracePeriodEndsAt || null,
            };
            if (subscription?._id) {
              await updateSubscription({ _id: subscription._id, ...formattedValues });
            } else {
              await createSubscription(formattedValues);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectButtonWithId
                  name="company"
                  label="Company"
                  required
                  array={companies || []}
                />
                <SelectButtonWithId
                  name="user"
                  label="User"
                  required
                  array={users?.data || []}
                />
                <SelectButtonWithId
                  name="plan"
                  label="Plan"
                  required
                  array={plans?.data?.data || []}
                />
                <InputField name="planName" label="Plan Name" placeholder="Enter plan name (optional)" />
                <SelectButton
                  name="status"
                  label="Status"
                  required
                  array={["trial", "active", "past_due", "cancelled", "expired"]}
                />
                <SelectButton
                  name="billingCycle"
                  label="Billing Cycle"
                  required
                  array={["monthly", "yearly"]}
                />
                <DatePickerField
                  name="startDate"
                  label="Start Date"
                  require={true}
                  placeholder="Select start date"
                />
                <DatePickerField
                  name="endDate"
                  label="End Date"
                  require={true}
                  placeholder="Select end date"
                />
                <DatePickerField
                  name="gracePeriodEndsAt"
                  label="Grace Period Ends At"
                  placeholder="Select grace period end date"
                />
                <InputField name="isTrial" label="Trial" type="checkbox" />
                <InputField name="isAutoRenew" label="Auto Renew" type="checkbox" />
                <InputField name="isCancelled" label="Cancelled" type="checkbox" />
              </div>
              <div className="col-span-2 flex justify-end mt-6">
                <FormButtons
                  isLoading={isSubmitting || createResponse?.isLoading || updateResponse?.isLoading}
                  onCancel={() => navigate("/subscriptions")}
                  isUpdate={!!subscription?._id}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateSubscription; 