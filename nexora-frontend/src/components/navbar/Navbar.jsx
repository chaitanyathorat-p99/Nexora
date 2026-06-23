// Navbar.js
import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import * as RiIcons from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/userSlice";
import NotificationIcon from "../notifications/NotificationIcon";
import { use } from "react";
import { Tooltip } from 'antd';

const Nav = styled.div`
  display: flex;
  position: sticky;
  top: 0px;
  z-index: 99;
  justify-content: flex-end;
  align-items: center;
  padding: 2rem 0.5rem;
  background-color: var(--white);
  height: 40px;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
`;

const styles = {
  profileIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // marginRight: '10px',
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "#1e1d1d",
    cursor: "pointer",
    marginLeft: "1rem",
  },
};

const NavIcon = styled(NavLink)`
  position: relative;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 2rem;
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #1e1d1d;
  font-size: 1rem;
  padding: 0.5rem 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.user);
  const { isAuthenticated, userToken, loading, user } = useSelector(
    (state) => state.user
  );
  const handleLogout = () => {
    dispatch(logout());
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("userToken") : "";
  console.log(user?.role?.name);

  // Get the first letter of the user's name
  const firstLetter = (user?.name || user?.username || user?.email || 'A')
    .charAt(0)
    .toUpperCase();

  const getDisplayName = () => {
    if (!user) return "User";

    const username = (user.username || "").trim();
    const name = (user.name || "").trim();

    if (name) {
      return name;
    }

    if (username) {
      return username;
    }

    if (user.email && typeof user.email === "string") {
      return user.email.split("@")[0];
    }

    return "User";
  };

  return (
    <Nav>
      {/* {user ? (
        <NavIcon to="#">
          <FaIcons.FaBars onClick={toggleSidebar} color="white" />
        </NavIcon>
      ) : null} */}
      {/* <h1 style={{ textAlign: "center", color: "white" }}>Nexora</h1> */}
      {/* Profile Icon and NavLink - Positioned outside conditional render */}
      <Tooltip title="Profile">
        <NavLink to="/profile" style={{ textDecoration: 'none' }}>
          <div style={styles.profileIcon}>
            {firstLetter}
          </div>
        </NavLink>
      </Tooltip>

      {user ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "black",
            padding: "0.5rem 0.5rem",
          }}
        >
          {user && (
            <Tooltip title="Notifications">
              <span><NotificationIcon /></span>
            </Tooltip>
          )}

              <span style={{ margin: "0 0.5rem" }}>
                Welcome: <b>{getDisplayName()}</b>
          </span>
          <Tooltip title="Logout">
            <LogoutButton to="/login" onClick={handleLogout}>
              <RiIcons.RiLogoutBoxLine />
            </LogoutButton>
          </Tooltip>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "black",
              padding: "0.5rem 0.5rem",
            }}
          >
            <span style={{ margin: "0 0.5rem" }}>
              Welcome To <b>Nexora</b>
            </span>
          </div>
        </>
      )}
    </Nav>
  );
};

export default Navbar;
