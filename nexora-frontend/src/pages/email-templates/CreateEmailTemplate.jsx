import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateEmailTemplateMutation, useUpdateEmailTemplateMutation } from "../../features/allApi";
import FormHeader from "../../components/moduleHeaders/FormHeader";
import FormikRichTextEditor from "../../atoms/input/FormikRichTextEditor";
import FormButtons from "../../atoms/button/FormButtons";
import InputField from "../../atoms/input/InputField";
import SelectButton from "../../atoms/select/SelectButton";
import EResponse from "../../atoms/response/EResponse";

const TEMPLATE_TYPES = {
  SUBSCRIPTION: 'subscription_expiration',
  LEAD: 'lead_creation',
  CALL: 'call_creation',
  MEETING: 'meeting_creation',
  TICKET: 'ticket_creation',
  TASK: 'task_notification',
};

const TEMPLATE_VARIABLES = {
  [TEMPLATE_TYPES.SUBSCRIPTION]: {
    variables: ['userName', 'companyName', 'expirationDate', 'daysRemaining'],
    description: 'Available variables: {{userName}}, {{companyName}}, {{expirationDate}}, {{daysRemaining}}'
  },
  [TEMPLATE_TYPES.LEAD]: {
    variables: [
      "subject",
      "createdBy",
      "assignedTo",
      "email",
    ],
    description:
      "Available variables: {{subject}}, {{createdBy}}, {{assignedTo}}, {{email}}",
  },
  [TEMPLATE_TYPES.CALL]: {
    variables: [
      "callerName",
      "phoneNumber",
      "callDuration",
      "callDate",
      "callStatus",
    ],
    description:
      "Available variables: {{callerName}}, {{phoneNumber}}, {{callDuration}}, {{callDate}}, {{callStatus}}",
  },
  [TEMPLATE_TYPES.TICKET]: {
    variables: [
      "subject",
      "description",
      "createdBy",
      "assignedTo",
      "ticketId",
    ],
    description:
      "Available variables: {{subject}}, {{description}}, {{createdBy}}, {{assignedTo}}, {{ticketId}}",
  },
  [TEMPLATE_TYPES.MEETING]: {
    variables: ["subject", "description", "createdBy", "dueDate", "assignedTo"],
    description:
      "Available variables: {{subject}}, {{description}},{{dueDate}}, {{createdBy}}, {{assignedTo}}",
  },
};



const CreateEmailTemplate = ({ formValue }) => {
  const navigate = useNavigate();
  const [createEmailTemplate, createResponse] = useCreateEmailTemplateMutation();
  const [updateEmailTemplate, updateResponse] = useUpdateEmailTemplateMutation();

  const initialValues = formValue || {
    name: "",
    subject: "",
    body: "",
    type: TEMPLATE_TYPES.SUBSCRIPTION,
    isActive: true,
    daysBeforeExpiration: 7,
    settings: {
      sendToAdmin: true,
      sendToUser: true,
      ccEmails: [],
      bccEmails: [],
    },
  };

  const validationSchema = Yup.object().shape({
  name: Yup.string().required("Template name is required"),
  subject: Yup.string(),
  body: Yup.string(),
  type: Yup.string(),
  daysBeforeExpiration: Yup.number().nullable()
    
});

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = { ...values };
      if (formValue?._id) {
        await updateEmailTemplate({
          id: formValue._id,
          ...dataToSend,
        }).unwrap();
      } else {
        await createEmailTemplate(dataToSend).unwrap();
      }
      navigate("/email-templates");
    } catch (error) {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <EResponse
        error={createResponse?.error?.data?.message || updateResponse?.error?.data?.message}
        Response={formValue?._id ? updateResponse : createResponse}
        type={formValue?._id ? "update" : "create"}
        navigateTo={"/email-templates"}
      />
      <FormHeader
        title={formValue ? "Edit Email Template" : "Create Email Template"}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField name="name" label="Template Name"  placeholder="Enter template name" />
              <SelectButton
                name="type"
                label="Template Type"
                array={Object.values(TEMPLATE_TYPES)}
                displayNames={["Subscription Expiration", "Lead Notification", "Call Notification", "Meeting Notification", "Ticket Creation Notification", "Task Notification"]}
              />
              {values.type !== TEMPLATE_TYPES.TASK && (
                <>
                  <InputField name="subject" label="Email Subject" required placeholder="Enter email subject" />
                  {values.type === TEMPLATE_TYPES.SUBSCRIPTION && (
                    <InputField name="daysBeforeExpiration" label="Days Before Expiration" type="number"  min={1} />
                  )}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">Email Body</label>
                    <FormikRichTextEditor
                      name="body"
                      extra={TEMPLATE_VARIABLES[values.type]?.description}
                      
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-end gap-8">
                    <div className="flex-1">
                      <InputField
                        name="settings.ccEmails"
                        label="CC Emails"
                        placeholder="Comma separated emails"
                        parse={(val) => val.split(",").map(email => email.trim())}
                      />
                    </div>
                    <div className="flex gap-8 items-center mb-2">
                      <InputField
                        name="settings.sendToUser"
                        label="Send to User"
                        type="checkbox"
                      />
                      <InputField
                        name="settings.sendToAdmin"
                        label="Send to Admin"
                        type="checkbox"
                      />
                    </div>
                  </div>
                </>
              )}
              <InputField name="isActive" label="Active" type="checkbox" />
            </div>
            <div className="col-span-2 flex justify-end mt-6">
              <FormButtons
                isLoading={isSubmitting}
                onCancel={() => navigate("/email-templates")}
                isUpdate={!!formValue}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateEmailTemplate; 