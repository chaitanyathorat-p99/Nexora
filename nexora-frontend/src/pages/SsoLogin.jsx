import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../components/common/api";

export default function SsoLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Call your backend to verify the token and get user info
      axios
        .post(`${url}/auth/verify`, { token }) // Adjust backend URL as needed
        .then((res) => {
          // Save user/session info as needed
          const { user, subscriptions, subscriptionStatus } = res?.data?.data;

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userToken", token); // Store the JWT token for auth
          localStorage.setItem("subscriptionData", JSON.stringify({ subscriptions, subscriptionStatus })); // Store subscription data

          // localStorage.setItem("isAuthenticated", "true"); // Set auth flag
          // Optionally, set a cookie/session for CRM
          window.location.href = "/dashboard"; // Force reload so auth logic sees localStorage
        })
        .catch(() => {
          alert("SSO failed. Please login manually.");
          navigate("/login");
        });
    } else {
      alert("No SSO token found.");
      navigate("/dashboard");
    }
  }, [navigate]);

  return <div>Signing you in...</div>;
}
