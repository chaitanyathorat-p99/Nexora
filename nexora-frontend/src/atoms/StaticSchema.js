import * as yup from "yup";

export const meetingValidationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    dueDate: yup.date().required("Due date is required"),
    desc: yup.string().required("Description is required"),
    meetingLink: yup.string(),
    outcome: yup.string(),
    meetingNote: yup.string(),
    platForm: yup.string(),
    meetingType: yup.string(),
    meetingDone: yup.boolean(),
    lead: yup.string().nullable(),
    createdBy: yup.string().nullable(),
    assignedTo: yup.string().nullable(),
    companyMaster: yup.string().nullable(),

  });