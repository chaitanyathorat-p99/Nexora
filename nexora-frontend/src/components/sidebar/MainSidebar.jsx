import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./sideBar";
import {
  LayoutDashboard,
  Home,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
  Settings,
  ChevronDown,
  ChevronRight,
  Bot,
} from "lucide-react";
import { SidebarItem } from "./sideBar";
import { useSelector } from "react-redux";
import { checkAccess } from "../../atoms/static";
import {
  SiGoogleadsense,
  SiInstatus,
  SiArkecosystem,
  SiCriticalrole,
} from "react-icons/si";
import { BiMessageDetail } from "react-icons/bi"
import { FaTasks, FaIdeal, FaPhoneAlt, FaRegCalendarCheck, FaRegCheckCircle, FaIndustry ,FaBoxOpen, FaUserTag, FaTags, FaUsersCog, FaCog } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { hasFeature } from "../../atoms/State";

const MainSidebar = () => {
  const location = useLocation();
  // const location = window.location.pathname;
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );

  // State to manage the submenus
  const [isUserSettingOpen, setIsUserSettingOpen] = useState(false);
  const [isGeneralSettingOpen, setIsGeneralSettingOpen] = useState(false);

  // Toggle the visibility of the report submenu
  const toggleReportMenu = () => {
    setIsReportOpen((prev) => !prev);
  };

  // Toggle the visibility of the settings submenu
  const toggleSettingsMenu = () => {
    setIsSettingsOpen((prev) => !prev);
    // setIsReportOpen((prev) => !prev);
  };

  // Returns true if the user has this feature in their plan

  // Permission checks for User Setting submenu
  const canSeeUserRole = checkAccess(user, "User-Role", "read") || hasFeature(user, "User-Role");
  const canSeeSystemUser = checkAccess(user, "System-User", "read") || hasFeature(user, "System-User");
  const canSeeClientUser = checkAccess(user, "Client-User", "read") || hasFeature(user, "Client-User");
  const showUserSetting = canSeeUserRole || canSeeSystemUser || canSeeClientUser;

  // Permission checks for General Setting submenu
  const canSeeLeadStatus = checkAccess(user, "Lead-Status", "read") || hasFeature(user, "Lead-Status");
  const canSeeProductType = checkAccess(user, "Product-Type", "read") || hasFeature(user, "Product-Type");
  const canSeeIndustryType = checkAccess(user, "Industry-Type", "read") || hasFeature(user, "Industry-Type");
  const canSeeTypeOfBuyer = checkAccess(user, "Type of Buyer", "read") || hasFeature(user, "Type of Buyer");
  const showGeneralSetting = canSeeLeadStatus || canSeeProductType || canSeeIndustryType || canSeeTypeOfBuyer;

  return (
    <Sidebar>
      {/* CRM Core Modules */}
      <SidebarItem
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
        to="/dashboard"
        active={location.pathname === "/dashboard"}
      />
      {(checkAccess(user, "Lead", "read") || hasFeature(user, "Lead")) && (
        <SidebarItem
          icon={<SiGoogleadsense size={20} />}
          text="Leads"
          alert
          to="/leads"
          active={location.pathname === "/leads"}
        />
      )}
     
      {(checkAccess(user, "Meeting", "read") ||
        hasFeature(user, "Meeting")) && (
        <SidebarItem
          icon={<FaRegCalendarCheck size={20} />}
          text="Meetings"
          alert
          to="/meetings"
          active={location.pathname === "/meetings"}
        />
      )}
      {(checkAccess(user, "Call", "read") || hasFeature(user, "Call")) && (
        <SidebarItem
          icon={<FaPhoneAlt size={20} />}
          text="Calls"
          alert
          to="/calls"
          active={location.pathname === "/calls"}
        />
      )}

       {(checkAccess(user, "Task", "read") || hasFeature(user, "Task")) && (
        <SidebarItem
          icon={<FaTasks size={20} />}
          text="Tasks"
          alert
          to="/tasks"
          active={location.pathname === "/tasks"}
        />
      )}
      {(checkAccess(user, "Product", "read") ||
        hasFeature(user, "Product")) && (
        <SidebarItem
          icon={<FaBoxOpen size={20} />}
          text="Products"
          to="/products"
          active={location.pathname === "/products"}
        />
      )}

      {(checkAccess(user, "Deal", "read") || hasFeature(user, "Deal")) && (
        <SidebarItem
          icon={<FaIdeal size={20} />}
          text="Deals"
          to="/deals"
          active={location.pathname === "/deals"}
        />
      )}

      {(checkAccess(user, "TICKET", "read") || hasFeature(user, "TICKET")) && (
        <SidebarItem
          icon={<FaRegCheckCircle size={20} />}
          text="Tickets"
          to="/tickets"
          active={location.pathname === "/tickets"}
        />
      )}
      <SidebarItem
        icon={<Bot size={20} />}
        text="AI Assistant"
        to="/ai-agent"
        active={location.pathname.startsWith("/ai-agent")}
      />
      <hr />
      {/* User Setting Main Menu */}
      {showUserSetting && (
        <>
          <SidebarItem
            icon={<FaUsersCog size={20} />}
            text="User Setting"
            to="#"
            onClick={() => setIsUserSettingOpen((prev) => !prev)}
            active={isUserSettingOpen}
            iconRight={isUserSettingOpen ? <ChevronDown /> : <ChevronRight />}
          />
          {isUserSettingOpen && (
            <div className="ml-4">
              {canSeeUserRole && (
                <SidebarItem
                  icon={<SiCriticalrole size={18} />}
                  text="User Role"
                  to="/user-role"
                  active={location.pathname === "/user-role"}
                />
              )}
              {canSeeSystemUser && (
                <SidebarItem
                  icon={<SiArkecosystem size={18} />}
                  text="System User"
                  to="/system-users"
                  active={location.pathname === "/system-users"}
                />
              )}
              {/* {canSeeClientUser && (
                <SidebarItem
                  icon={<SiSuperuser size={18} />}
                  text="Client Users"
                  to="/client-users"
                  active={location.pathname === "/client-users"}
                />
              )} */}
            </div>
          )}
        </>
      )}
      {/* General Setting Main Menu */}
      {showGeneralSetting && (
        <>
          <SidebarItem
            icon={<FaCog size={20} />}
            text="General Setting"
            to="#"
            onClick={() => setIsGeneralSettingOpen((prev) => !prev)}
            active={isGeneralSettingOpen}
            iconRight={isGeneralSettingOpen ? <ChevronDown /> : <ChevronRight />}
          />
          {isGeneralSettingOpen && (
            <div className="ml-4">
              {canSeeLeadStatus && (
                <SidebarItem
                  icon={<SiInstatus size={18} />}
                  text="Lead Status"
                  to="/leads-status"
                  active={location.pathname === "/leads-status"}
                />
              )}
              {canSeeProductType && (
                <SidebarItem
                  icon={<FaTags size={18} />}
                  text="Product Types"
                  to="/product-type"
                  active={location.pathname === "/product-type"}
                />
              )}
              {canSeeIndustryType && (
                <SidebarItem
                  icon={<FaIndustry size={18} />}
                  text="Industry Types"
                  to="/industry-type"
                  active={location.pathname === "/industry-type"}
                />
              )}
              {canSeeTypeOfBuyer && (
                <SidebarItem
                  icon={<FaUserTag size={18} />}
                  text="Type Of Buyers"
                  to="/type-of-buyer"
                  active={location.pathname === "/type-of-buyer"}
                />
              )}
            </div>
          )}
        </>
      )}
    </Sidebar>
  );
};

export default MainSidebar;
