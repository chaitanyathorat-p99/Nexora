import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Tag, Button, message, Upload, Space, Popconfirm, Select, Alert } from "antd";
import {
	useCreateTicketMutation,
	useUpdateTicketMutation,
	useFetchUserQuery,
  useUploadSingleFilesMutation,
} from "../../features/allApi";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import FormHeader from "../../components/moduleHeaders/FormHeader";
import InputField from "../../atoms/input/InputField";
import DatePickerField from "../../atoms/input/DatePickerField";
import EResponse from "../../atoms/response/EResponse";
import FormButtons from "../../atoms/button/FormButtons";
import { useSelector } from "react-redux";
import moment from "moment";
import MultipleFileUpload from "../../atoms/button/MultipleFileUpload";
import DynamicFieldRenderer from "../../components/dynamic-fields/DynamicFieldRenderer";
import { useFetchDynamicFieldsByModuleQuery } from "../../features/allApi";
import { CreateFormCard, CreateFormForm } from "../../components/forms/CreateFormShell";

// Custom select field component for objects with label/value
const SelectField = ({ name, label, options, required }) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label || "Label"}
      </label>
      <Field as="select" id={name} name={name} required={required} className="block w-full">
        <option value="">Select {label}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
};

const CreateTicket = ({ formData }) => {
	const navigate = useNavigate();
  const [createTicket, createResponse] = useCreateTicketMutation();
  const [updateTicket, updateResponse] = useUpdateTicketMutation();
  const [uploadFile, uploadResponse] = useUploadSingleFilesMutation();
	const { data: usersData } = useFetchUserQuery({ type: "userType=System" }); // Fetch agents (system users)
  const { user } = useSelector((state) => state.user);

  // Fetch dynamic fields for ticket module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "ticket" });

  // State for API errors
  const [apiError, setApiError] = useState(null);

  // State for tags input
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = React.useRef(null);

  // State for file uploads
  const [attachedFiles, setAttachedFiles] = useState(
    formData?.attachments || []
  );

  // State for SLA due date
  const [slaDueDate, setSlaDueDate] = useState(null);
  const [priorityChanged, setPriorityChanged] = useState(false);
  const [formPriority, setFormPriority] = useState("");
  const [formikValues, setFormikValues] = useState(null);

  const validationSchema = yup.object().shape({
    subject: yup.string().required("Subject is required"),
    description: yup.string().required("Description is required").max(1000, "Description must be less than 1000 characters"),
    status: yup.string().required("Status is required").oneOf(["open", "in_progress", "resolved", "closed"], "Invalid status"),
    priority: yup.string().required("Priority is required").oneOf(["low", "medium", "high", "urgent"], "Invalid priority"),
    category: yup.string().required("Category is required").oneOf(["question", "problem"], "Invalid category"),
    assignedTo: yup.string().required("Assigned To is required"),
    slaDue: yup.date().nullable(),
    companyMaster:yup.string()
  });

  const initialValues = {
    subject: "",
    description: "",
    status: "open",
    priority: "medium",
    category: "problem",
    assignedTo: "",
    slaDue: null,
  };

  const normalizeTicketStatus = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return "open";
    if (normalized === "in progress") return "in_progress";
    if (normalized === "in_progress") return "in_progress";
    if (normalized === "open" || normalized === "resolved" || normalized === "closed") return normalized;
    return "open";
  };

  const normalizeTicketPriority = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return "medium";
    if (normalized === "urgent" || normalized === "high" || normalized === "medium" || normalized === "low") return normalized;
    return "medium";
  };

  const normalizeTicketCategory = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return "problem";
    if (normalized === "question" || normalized === "problem") return normalized;
    return "problem";
  };

	useEffect(() => {
		if (formData) {
      // Set tags from formData if available
      if (formData.tags) {
        setTags(formData.tags);
      }

      // Set attachedFiles from attachments if available
      if (formData.attachments && formData.attachments.length > 0) {
        // Make sure attachments have the correct format
        const formattedAttachments = formData.attachments.map(attachment => {
          // If it's already an object with the right structure, use it as is
          if (typeof attachment === 'object' && attachment.url) {
            return attachment;
          }
          // If it's a string URL, convert it to the proper format
          if (typeof attachment === 'string') {
            return {
              filename: attachment.split('/').pop(),
              url: attachment,
              uploadedAt: new Date()
            };
          }
          return attachment;
        });
        setAttachedFiles(formattedAttachments);
      }

      // Set slaDue if available
      if (formData.slaDue) {
        setSlaDueDate(formData.slaDue);
      }

      if (formData.priority) {
        setFormPriority(formData.priority);
      }
    }
  }, [formData]);

  // Monitor API responses for errors
  useEffect(() => {
    if (createResponse.error) {
      const errorMessage = createResponse.error.data?.message || 'Error creating ticket';
      setApiError(errorMessage);
    } else if (updateResponse.error) {
      const errorMessage = updateResponse.error.data?.message || 'Error updating ticket';
      setApiError(errorMessage);
    } else if (uploadResponse.error) {
      const errorMessage = uploadResponse.error.data?.message || 'Error uploading files';
      setApiError(errorMessage);
    } else {
      setApiError(null);
    }
  }, [createResponse.error, updateResponse.error, uploadResponse.error]);

  // Update SLA due date when priority changes
  useEffect(() => {
    if (formikValues && formikValues.priority !== formPriority) {
      setFormPriority(formikValues.priority);
      setPriorityChanged(true);
      const newSlaDue = calculateSlaDue(formikValues.priority);
      setSlaDueDate(newSlaDue);
    }
  }, [formikValues, formPriority]);

  // Calculate SLA due date based on priority
  const calculateSlaDue = (priority) => {
    const now = new Date();
    switch (priority) {
      case "urgent":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day
      case "high":
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
      case "medium":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      case "low":
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  };

  // Handle tag input display
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  // Update the handleFileUpload function to safely handle attachments
  const handleFileUpload = (fileObjects) => {
    console.log('Received files from uploader:', fileObjects);
    
    // Convert to the proper format expected by the backend
    const formattedFiles = fileObjects.map(file => {
      // If it's already in the correct format, just use it
      if (typeof file === 'object' && file.url && file.filename) {
        return file;
      }
      
      // Handle string file URLs
      if (typeof file === 'string') {
        return {
          filename: file.split('/').pop(),
          url: file,
          uploadedAt: new Date()
        };
      }
      
      // Handle other object formats
      return {
        filename: file.key ? file.key.split('/').pop() : 
                  (file.location ? file.location.split('/').pop() : 
                  (file.url ? file.url.split('/').pop() : 'unnamed-file')),
        url: file.location || file.url || '',
        uploadedAt: new Date()
      };
    });
    
    console.log('Formatted attachments:', formattedFiles);
    setAttachedFiles(formattedFiles.filter(file => file.url)); // Filter out any without URLs
  };

  const handleSubmit = async (values) => {
    setApiError(null); // Clear any previous errors
    
    try {
      console.log('Submitting with values:', values);
      console.log('Attachments:', attachedFiles);
      
      // Extract dynamic field values
      const dynamicFieldValues = {};
      if (dynamicFields) {
        dynamicFields.forEach(field => {
          if (values[field.fieldName] !== undefined) {
            dynamicFieldValues[field.fieldName] = values[field.fieldName];
          }
        });
      }
      
      // Calculate SLA due date if priority has changed or it's a new ticket
      let slaDueValue = values.slaDue;
      if (priorityChanged || !formData?._id) {
        slaDueValue = calculateSlaDue(values.priority).toISOString();
      }
      
      // Make sure user ID exists before submitting
      if (!user || !user._id) {
        setApiError('User information missing. Please log in again.');
        return;
      }
      
      // Ensure all attachments have the proper format
      const formattedAttachments = attachedFiles.map(attachment => {
        if (typeof attachment === 'string') {
          return {
            filename: attachment.split('/').pop(),
            url: attachment,
            uploadedAt: new Date()
          };
        }
        return attachment;
      });
      
      // Handle assignedTo field correctly - ensure we only pass the ID, not the entire object
      let assignedToValue = null;
      if (values.assignedTo) {
        if (typeof values.assignedTo === 'string' && values.assignedTo.trim() !== '') {
          assignedToValue = values.assignedTo;
        } else if (typeof values.assignedTo === 'object' && values.assignedTo._id) {
          assignedToValue = values.assignedTo._id;
        } else {
          setApiError('Invalid user format. Please select a user again.');
          return;
        }
      }
      
      // Prepare ticket data
      const ticketData = {
        ...values,
        status: normalizeTicketStatus(values.status),
        priority: normalizeTicketPriority(values.priority),
        category: normalizeTicketCategory(values.category),
        slaDue: slaDueValue,
        assignedTo: assignedToValue, // Fixed assignedTo handling
        tags: tags,
        attachments: formattedAttachments,
        createdBy: user._id,
        companyMaster:user?.companyMaster?._id,
        dynamicFields: dynamicFieldValues
      };
      
      console.log('Final ticket data:', ticketData);
      
      // Validation checks
      if (!ticketData.subject || !ticketData.description) {
        setApiError('Subject and description are required');
        return;
      }
      
			if (formData?._id) {
				// Update existing ticket
        const response = await updateTicket({ _id: formData._id, ...ticketData }).unwrap();
        console.log('Update response:', response);
        if (response) {
				message.success("Ticket updated successfully");
          navigate("/tickets");
        }
			} else {
				// Create new ticket
        const response = await createTicket(ticketData).unwrap();
        console.log('Create response:', response);
        if (response) {
				// message.success("Ticket created successfully");
			navigate("/tickets");
        }
      }
		} catch (error) {
      console.error('API error:', error);
      const errorMessage = error.data?.message || 'An error occurred while saving the ticket';
      message.error(errorMessage);
      setApiError(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/tickets");
  };

  // Prepare status options
  const statusOptions = [
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  // Prepare priority options
  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  // Prepare category options
  const categoryOptions = [
    { label: "Question", value: "question" },
    { label: "Problem", value: "problem" },
  ];

  // Prepare agents options
  const agentOptions =
    usersData?.data?.map((user) => ({
      label: user.username,
      value: user._id,
    })) || [];

	return (
    <div>
      <EResponse
        Response={createResponse}
        type={"create"}
        navigateTo={"/tickets"}
      />
      <EResponse
        Response={updateResponse}
        type={"update"}
        navigateTo={"/tickets"}
      />
      <FormHeader title={formData?._id ? "Update Ticket" : "Create Ticket"} />

      {apiError && (
        <Alert
          message="Error"
          description={apiError}
          type="error"
          showIcon
          closable
          className="mb-4"
          onClose={() => setApiError(null)}
        />
      )}

      <div className="sm:mx-auto w-full">
        <Formik
          initialValues={formData?._id ? {
            ...formData,
            ...(formData.dynamicFields || {}),
            status: normalizeTicketStatus(formData.status),
            priority: normalizeTicketPriority(formData.priority),
            category: normalizeTicketCategory(formData.category),
            // Ensure assignedTo is properly handled - extract only the ID (support string IDs too)
            assignedTo:
              formData.assignedTo && typeof formData.assignedTo === 'object' && formData.assignedTo._id
                ? formData.assignedTo._id
                : typeof formData.assignedTo === 'string'
                  ? formData.assignedTo
                  : '',
            slaDue: formData.slaDue ? formData.slaDue : null,
          } : initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, values, setFieldValue, handleChange }) => {
            // Store values in state for use in useEffect, but avoid direct state updates in render
            // This avoids the infinite loop
            React.useEffect(() => {
              setFormikValues(values);
              
              // Update SLA if priority changes
              if (values.priority !== formPriority) {
                const newSlaDue = calculateSlaDue(values.priority);
                setFieldValue("slaDue", newSlaDue.toISOString());
              }
            }, [values.priority, setFieldValue]);
            
            return (
                    <CreateFormCard>
                      <CreateFormForm>
                  <InputField  name="subject" label="Subject" />

                  <SelectField
                    options={categoryOptions}
				name="category"
                    label="Category"
                    required={true}
                  />

                  <SelectField
                    options={statusOptions}
				name="status"
                    label="Status"
                    required={true}
                  />

                  <SelectField
                    options={priorityOptions}
				name="priority"
                    label="Priority"
                    required={true}
                  />

                  <SelectField
                    options={agentOptions}
                    name="assignedTo"
                    label="Assigned Agent"
                  />

                  <DatePickerField
                    require={true}
                    label="SLA Due Date"
                    name="slaDue"
                  />

                  <InputField
                    span={2}
                    isTextarea={true}
                    // required={true}
                    name="description"
                    label="Description"
                  />

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="mt-1">
                      <Space size={[0, 8]} wrap className="mb-2">
                        {tags.map((tag) => (
                          <Tag
                            key={tag}
                            closable
                            onClose={(e) => {
                              e.preventDefault();
                              handleClose(tag);
                            }}
                          >
                            {tag}
                          </Tag>
                        ))}
                        {inputVisible ? (
                          <input
                            ref={inputRef}
                            type="text"
                            className="border rounded px-2 py-1 text-sm"
                            size="small"
                            style={{ width: 78 }}
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleInputConfirm();
                              }
                            }}
                          />
                        ) : (
                          <Tag
                            onClick={showInput}
                            className="cursor-pointer"
                            style={{
                              background: "#fff",
                              borderStyle: "dashed",
                            }}
                          >
                            <PlusOutlined /> New Tag
                          </Tag>
                        )}
                      </Space>
                    </div>
                  </div>

                  <MultipleFileUpload
                    name="attachments"
                    label="Upload Files"
                    handleChange={handleChange}
                    values={values}
                    onFileUpload={handleFileUpload} // Pass the file upload handler
                  />

                  {/* Dynamic Fields Section */}
                  {dynamicFields && dynamicFields.length > 0 && (
                    <>
                      <DynamicFieldRenderer 
                        fields={dynamicFields}
                        initialValues={formData?._id ? formData : {}}
                        mode="edit"
                      />
                    </>
                  )}
                <div className="col-span-2 flex justify-end mt-8 gap-3">
                  <FormButtons
                    isLoading={createResponse?.isLoading || updateResponse?.isLoading}
                    onCancel={handleCancel}
                    isUpdate={!!formData?._id}
                  />
                </div>
              </CreateFormForm>
            </CreateFormCard>
            );
          }}
        </Formik>
      </div>
    </div>
	);
};

export default CreateTicket;
