import React, { useEffect, useState } from "react";
import KsLogo from "../../assets/logo.png";
// import { userLogin } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getUser, userLogin } from "../../features/authfunctions/userLogin";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { url } from "../../components/common/api";

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [isPollingGoogleScript, setIsPollingGoogleScript] = useState(false);

  const initialValues = {
    username: "",
    password: "",
  };

  const userSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const handleFormSubmit = (values) => {
    dispatch(userLogin(values));
    console.log(values);
    // setSubmitting(true);
  };

  const handleCredentialResponse = async (response) => {
    // Handle the ID token received from Google
    if (response.credential) {
      try {
        setError("");
        setGoogleLoading(true);

        // Decode the ID token to get user info
        const idToken = response.credential;
        const [header, payload, signature] = idToken.split(".");
        const decodedPayload = JSON.parse(atob(payload));

        const userData = {
          id_token: idToken,
          name: decodedPayload.name,
          email: decodedPayload.email,
          picture: decodedPayload.picture,
        };

        // Try login-only endpoint first; fallback to signup+login endpoint.
        let backendResponse;
        try {
          backendResponse = await axios.post(
            `${url}/auth/google-login`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
        } catch (loginErr) {
          const status = loginErr?.response?.status;
          const serverMessage = String(loginErr?.response?.data?.message || "").toLowerCase();

          // If user doesn't exist yet, use create-or-login endpoint.
          if (status === 404 || serverMessage.includes("sign up") || serverMessage.includes("not found")) {
            backendResponse = await axios.post(
              `${url}/auth/google-auth`,
              userData,
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );
          } else {
            throw loginErr;
          }
        }

        const loginPayload = backendResponse?.data?.data || backendResponse?.data;

        if (!loginPayload?.accessToken || !loginPayload?.user) {
          throw new Error("Invalid Google login response from server");
        }

        const { accessToken, refreshToken, user } = loginPayload;

        // Store tokens and user data
        localStorage.setItem("userToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken || "");
        localStorage.setItem("user", JSON.stringify(user));

        // Rehydrate Redux auth state before routing to protected pages.
        await dispatch(getUser()).unwrap();

        message.success(`Welcome, ${user.name}!`);
        navigate("/dashboard");
      } catch (err) {
        console.error("Google login error:", err);
        setError(
          err.response?.data?.message ||
            "Google sign-in failed. Please try again."
        );
        message.error(err.response?.data?.message || "Google sign-in failed");
      } finally {
        setGoogleLoading(false);
      }
    }
  };

  const initializeGoogleAuth = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // Replace the client ID in initializeGoogleAuth
      window.google.accounts.id.initialize({
        client_id:"748664710229-fg02ban512nnusjjalrq77g3foc3nts2.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        cancel_on_tap_outside: false,
      });

      // Render a Google button into a hidden div
      // We will trigger its click programmatically
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          type: "standard",
          size: "large",
          width: "300",
          theme: "outline",
          text: "signin_with",
          shape: "rectangular",
          locale: "en",
        }
      );

      setIsGoogleScriptLoaded(true);
    } else {
      console.error("Google Identity Services script not loaded.");
      setError("Failed to load Google Sign-In services.");
    }
  };

  // const handleGoogleLogin = () => {
  //   if (isGoogleScriptLoaded) {
  //     // Trigger a click on the hidden Google button
  //     const googleButton = document.getElementById("google-signin-button");
  //     if (googleButton) {
  //       googleButton.click();
  //     } else {
  //       setError("Google Sign-In button not found.");
  //     }
  //   } else {
  //     setError("Google Sign-In is not ready yet. Please try again.");
  //   }
  // };

  useEffect(() => {
    if (!loading && userToken && user?._id && isAuthenticated) {
      navigate("/leads");
    }
  }, [user, loading, isAuthenticated, userToken]);

  // Load Google Identity Services API
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Poll for window.google.accounts.id to be available
        const pollGoogleScript = () => {
          if (window.google && window.google.accounts && window.google.accounts.id) {
            setIsGoogleScriptLoaded(true);
            initializeGoogleAuth();
            setIsPollingGoogleScript(false);
          } else {
            // Continue polling if not ready, for up to 5 seconds
            if (isPollingGoogleScript) { // Check state to prevent multiple polling loops
               setTimeout(pollGoogleScript, 100); // Poll every 100ms
            }
          }
        };

        if (!isPollingGoogleScript) {
           setIsPollingGoogleScript(true);
           pollGoogleScript();
        }
      };
      script.onerror = () => {
        setIsGoogleScriptLoaded(false);
        setIsPollingGoogleScript(false);
        console.error("Failed to load Google Identity Services script.");
        setError("Failed to load Google Sign-In services.");
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();

    // Cleanup function
    return () => {
      const script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <>
      <div className="flex min-h-[80vh] flex-1 flex-col justify-center items-center">
        <h2 className="mt-10 text-center text-3xl font-semibold leading-9 tracking-tight text-gray-900">
          Nexora
        </h2>
        <div className=" px-6  w-[32rem] rounded-lg py-6 lg:px-8  shadow dark:border dark:bg-gray-lightest backdrop-blur-sm hover:backdrop-blur-lg dark:border-gray-200">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
            className="mx-auto h-10 w-auto"
            src={KsLogo}
            alt="Your Company"
          /> */}
            <h2 className="mt-10 text-center text-2xl font-medium leading-9 tracking-tight text-gray-900">
              Sign In
            </h2>
          </div>

          <div className="mt-10 py-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <Formik
              initialValues={initialValues}
              validationSchema={userSchema}
              onSubmit={handleFormSubmit}
            >
              {() => (
                <Form className="space-y-6">
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
                      className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                    <div className="text-sm">
                      <span
                        onClick={() => navigate('/forgot-password')}
                        className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                      >
                        Forgot password?
                      </span>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/*
                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={googleLoading || !isGoogleScriptLoaded}
                      className="flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible::outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                      {googleLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                              <path
                                fill="#4285F4"
                                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                              />
                              <path
                                fill="#34A853"
                                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                              />
                              <path
                                fill="#EA4335"
                                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                              />
                            </g>
                          </svg>
                          Sign in with Google
                        </>
                      )}
                    </button>
                  </div>
                  */}

                  {error && (
                    <div className="text-red-600 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="text-sm text-center">
                    <span className="text-gray-600">Don’t have an account? </span>
                    <span
                      onClick={() => navigate("/register")}
                      className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                    >
                      Register
                    </span>
                  </div>

                  {/* Hidden div for Google Sign-In button rendering */}
                  <div className="flex justify-center">
                  <div
                    id="google-signin-button"
                    // style={{ display: "none" }}
                  ></div>
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

export default Login;
