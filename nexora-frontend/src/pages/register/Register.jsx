// Login.jsx
import React, { useState } from "react";
import KsLogo from "../../assets/logo.png";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../features/allApi";
import EResponse from "../../atoms/response/EResponse";
import InputField from "../../atoms/input/InputField";
import { message } from "antd";
import SelectButtonWithId from "../../atoms/select/SelectButtonWithId";
import Dummy from "../../atoms/input/Dummy";
import { useSelector } from "react-redux";
import FormButtons from '../../atoms/button/FormButtons';
import { useLocation, useNavigate } from "react-router-dom";

const ROLE_OPTIONS = [
  { _id: "employee", name: "Employee" },
  { _id: "admin", name: "Admin" },
  { _id: "super_admin", name: "Super Admin" },
];

const handleFormSubmit = ({
  values,
  formData,
  passChange,
  createUser,
  updateUser,
  user,
}) => {
  // setTimeout(() => {
  //   console.log(JSON.stringify(values, null, 2));
  //   setSubmitting(false);
  // }, 400);
  if (!values?.companyMaster?.length > 0) {
    values.companyMaster = null;
  }
 
  if (values.password !== values.cpassword) {
    return message.error("Password dont match");
  }

  if (formData?._id) {
    if (!passChange) {
      delete values.password;
      delete values.cpassword;
    }
    updateUser(values);
  } else {
    createUser({
      username: values.username,
      fullName: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.cpassword,
      role: values.role,
      phone: values.mobileNo,
    });
  }
};
const Register = ({ formData }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const location = useLocation();

  const { isAuthenticated, userToken, user } = useSelector(
    (state) => state.user
  );
  const handleUserTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected Role:", selectedRole);
  };
  
  const initialValues = {
    username: "",
    name: "",
    mobileNo: "",
    email: "",
    role: "",
    userType: "System",
    companyMaster: null,
    // profile_pic: null,
    password: "",
    cpassword: "",
  };

  const userSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    name: yup.string().required("Full Name is required"),
    mobileNo: yup.string().required("Mobile No. is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    role: yup.string().required("Role is required"),
    // userType: yup.string().required("User Type is required"),
    // companyMaster: yup.string().nullable(),
    // profile_pic: yup.mixed(),
    password: yup.string(),
    cpassword: yup.string(),
    isEmailVerified:yup.boolean()
  });
  const [createUser, GetUserResponse] = useCreateUserMutation();
  const [updateUser, GetUpdateUserResponse] = useUpdateUserMutation();
  const [passChange, setPassChange] = useState(false);

  const navigate = useNavigate();
  const handlcancel=()=>{
    navigate("/system-users")
  }
  const successRedirect = location.pathname.startsWith("/system-users") ? "/system-users" : "/login";
  return (
    <>
      <EResponse
        error={GetUserResponse?.error?.data?.message}
        Response={GetUserResponse}
        type={"create"}
        navigateTo={successRedirect}
      />
      <EResponse
        error={GetUpdateUserResponse?.error?.data?.message}
        Response={GetUpdateUserResponse}
        type={"update"}
        navigateTo={"/system-users"}
      />
      <div className="flex min-h-[80vh] flex-1 flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold leading-9 tracking-tight text-gray-900">
          Nexora
        </h2>

        <div className="mt-6 px-6 w-full max-w-3xl rounded-lg py-6 lg:px-8 shadow dark:border dark:bg-gray-lightest backdrop-blur-sm hover:backdrop-blur-lg dark:border-gray-200">
          <div className="sm:mx-auto sm:w-full">
            <h2 className="text-center text-2xl font-medium leading-9 tracking-tight text-gray-900">
              Register your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full">
            <Formik
              initialValues={formData?._id ? formData : initialValues}
              validationSchema={userSchema}
              onSubmit={(values) =>
                handleFormSubmit({
                  values,
                  formData,
                  createUser,
                  updateUser,
                  passChange,
                  user,
                })
              }
            >
              {({ isSubmitting, setFieldValue, errors }) => (
                <Form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {console.log(errors)}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    // required
                    className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Full Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    // required
                    className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobileNo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mobile No.
                  </label>
                  <Field
                    id="mobileNo"
                    name="mobileNo"
                    type="text"
                    autoComplete="mobileNo"
                    // required
                    className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="mobileNo"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    // required
                    className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <SelectButtonWithId
                  array={ROLE_OPTIONS}
                  name={"role"}
                  label={"Role"}
                />

                {/* <div>
                  <label
                    htmlFor="userType"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    User Type
                  </label>
                  <Field
                    as="select"
                    id="userType"
                    name="userType"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select User Type</option>
                    {userType.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="userType"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div> */}
                {/* <div>
                  <label
                    htmlFor="profile_pic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Profile Picture
                  </label>
                  <input
                    id="profile_pic"
                    name="profile_pic"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      setFieldValue(
                        "profile_pic",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                  <ErrorMessage
                    name="profile_pic"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div> */}
                {formData?._id ? (
                  <>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setPassChange(!passChange);
                        }}
                        disabled={false}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Chnage Password
                      </button>
                    </div>
                    <Dummy />
                  </>
                ) : null}
                {passChange || !formData?._id ? (
                  <>
                    <InputField
                      required={true}
                      type={"password"}
                      name={"password"}
                      label={"Password"}
                    />
                    <InputField
                      required={true}
                      type={"password"}
                      name={"cpassword"}
                      label={"Confirm Password"}
                    />
                  </>
                ) : null}

                <div className="col-span-1 sm:col-span-2 flex justify-end mt-2">
                  <FormButtons
                    isLoading={GetUserResponse?.isLoading || GetUpdateUserResponse?.isLoading}
                    onCancel={handlcancel}
                    isUpdate={!!formData?._id}
                  />
                </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
