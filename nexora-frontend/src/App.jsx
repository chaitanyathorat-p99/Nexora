import React, { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Header from "./components/navbar/Header";
import MainSidebar from "./components/sidebar/MainSidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import Error404 from "./pages/404/Error404";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import VerifyOTP from "./pages/forgot-password/VerifyOTP";
import ResetPassword from "./pages/forgot-password/ResetPassword";

import Lead from "./pages/lead/Lead";
import CreateLead from "./pages/lead/form/CreateLead";
import MainLead from "./pages/lead/form/MainLead";
import MainLeadView from "./pages/lead/view/MainLeadView";

import Meeting from "./pages/meeting/Meeting";
import MainMeeting from "./pages/meeting/form/MainMeeting";

import Call from "./pages/call/Call";

import Task from "./pages/task/Task";
import CreateTask from "./pages/task/form/CreateTask";
import MainTask from "./pages/task/form/MainTask";

import Product from "./pages/product/Product";

import AIAgent from "./pages/ai-agent/AIAgent";

import DealOverview from "./pages/deal/DealOverview";
import CreateDeal from "./pages/deal/form/CreateDeal";
import MainDeal from "./pages/deal/form/MainDeal";
import MainDealView from "./pages/deal/view/MainDealView";

import Ticket from "./pages/ticket/Ticket";
import CreateTicket from "./pages/ticket/CreateTicket";
import MainTicket from "./pages/ticket/MainTicket";

import UserRole from "./pages/user-role/UserRole";
import CreateUserRole from "./pages/user-role/form/CreateUserRole";
import MainUserRole from "./pages/user-role/form/MainUserRole";

import User from "./pages/users/User";
import MainUsers from "./pages/users/form/MainUsers";
import Register from "./pages/register/Register";
import UserDetails from "./pages/users/UserDetails";

// General Settings
import LeadStatus from "./pages/lead-status/LeadStatus";
import CreateLeadStatus from "./pages/lead-status/form/CreateLeadStatus";
import MainLeadStatus from "./pages/lead-status/form/MainLeadStatus";
import TypeOfProductType from "./pages/productType/TypeOfProductType";
import IndustryType from "./pages/industry-type/IndustryType";
import TypeOfBuyer from "./pages/typeOfBuyer/TypeOfBuyer";
import Profile from "./pages/home/profile/Profile";

import { getUser } from "./features/authfunctions/userLogin";

const MOCK_PLACEHOLDER_TOKEN = "mock-token";

function RequireAuth() {
  const { userToken, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const token = userToken || localStorage.getItem("userToken");
  const hasValidToken = Boolean(token && token !== MOCK_PLACEHOLDER_TOKEN);
  const hasUser = Boolean(localStorage.getItem("user"));

  useEffect(() => {
    if (hasValidToken && !hasUser && !loading) {
      dispatch(getUser());
    }
  }, [dispatch, hasValidToken, hasUser, loading]);

  if (!hasValidToken) return <Navigate to="/login" replace />;
  if (!hasUser) return null;
  if (loading) return null;
  return <Outlet />;
}

function PublicOnly({ children }) {
  const { userToken, isAuthenticated } = useSelector((state) => state.user);
  const token = userToken || localStorage.getItem("userToken");
  const hasValidToken = Boolean(token && token !== MOCK_PLACEHOLDER_TOKEN);

  if (isAuthenticated || hasValidToken) {
    return <Navigate to="/leads" replace />;
  }
  return children;
}

function App() {
  const location = useLocation();
  const authRoutes = new Set([
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ]);
  const isAuthRoute = authRoutes.has(location.pathname);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token === MOCK_PLACEHOLDER_TOKEN) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("subscriptionData");
      return;
    }

    if (token) {
      dispatch(getUser());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex">
      {!isAuthRoute && <MainSidebar />}
      <div className="flex-1 min-w-0 flex flex-col">
        {!isAuthRoute && <Header />}

        <main className="flex-1 min-w-0 overflow-auto">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />

            <Route
              path="/register"
              element={
                <PublicOnly>
                  <Register />
                </PublicOnly>
              }
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<RequireAuth />}>
              <Route path="/" element={<Navigate to="/leads" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Leads */}
              <Route path="/leads" element={<Lead />} />
              <Route path="/leads/create" element={<CreateLead />} />
              <Route path="/leads/create/:id" element={<MainLead />} />
              <Route path="/leads/:id" element={<MainLeadView />} />

              {/* Meetings */}
              <Route path="/meetings" element={<Meeting />} />
              <Route path="/meetings/:id" element={<MainMeeting />} />

              {/* Calls */}
              <Route path="/calls" element={<Call />} />

              {/* Tasks */}
              <Route path="/tasks" element={<Task />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              <Route path="/tasks/create/:id" element={<MainTask />} />

              {/* Products */}
              <Route path="/products" element={<Product />} />

              {/* AI Agent */}
              <Route path="/ai-agent" element={<AIAgent />} />
              <Route path="/ai-agent/:chatId" element={<AIAgent />} />

              {/* General Settings */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/leads-status" element={<LeadStatus />} />
              <Route path="/leads-status/create" element={<CreateLeadStatus />} />
              <Route path="/leads-status/create/:id" element={<MainLeadStatus />} />
              <Route path="/product-type" element={<TypeOfProductType />} />
              <Route path="/industry-type" element={<IndustryType />} />
              <Route path="/type-of-buyer" element={<TypeOfBuyer />} />

              {/* Deals */}
              <Route path="/deals" element={<DealOverview insideLead={true} />} />
              <Route path="/deals/create" element={<CreateDeal />} />
              <Route path="/deals/create/:id" element={<MainDeal />} />
              <Route path="/deals/:id" element={<MainDealView />} />

              {/* Tickets */}
              <Route path="/tickets" element={<Ticket />} />
              <Route path="/tickets/create" element={<CreateTicket />} />
              <Route path="/tickets/create/:id" element={<MainTicket />} />
              <Route path="/tickets/:id" element={<MainTicket />} />

              {/* User Settings */}
              <Route path="/user-role" element={<UserRole />} />
              <Route path="/user-role/create" element={<CreateUserRole />} />
              <Route path="/user-role/create/:id" element={<MainUserRole />} />

              <Route
                path="/system-users"
                element={<User type="System User" type_search="System" />}
              />
              <Route path="/system-users/create" element={<Register />} />
              <Route path="/system-users/create/:id" element={<MainUsers type="System User" />} />
              <Route path="/system-users/details/:id" element={<UserDetails />} />

              <Route path="*" element={<Error404 />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
