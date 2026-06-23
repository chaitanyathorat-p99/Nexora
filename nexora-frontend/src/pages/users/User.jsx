import React from "react";
import { useDeleteUserMutation, useFetchLeadQuery, useFetchUserQuery } from "../../features/allApi";
import { GiConsoleController } from "react-icons/gi";
import { Popconfirm, Tag } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  TagOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import {
  ClientUserString,
  SystemUserString,
} from "../../features/remainingSlice";
import EResponse from "../../atoms/response/EResponse";
const User = ({ type, type_search }) => {
  const modelName = `${type_search}-User`;
  const navigate = useNavigate();
  const { isAuthenticated, userToken, user } = useSelector(
    (state) => state.user
  );
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useFetchUserQuery({ type: `userType=${type_search}` });
  const [deleteTask, GetTaskResponse] = useDeleteUserMutation();

  const handleEdit = (record) => {

      navigate(`create/${record?._id}`);
 
  };
  const handleDelete = (record) => {

    deleteTask(record)
 
  };
  const columns = [
    {
      title: <span>Sr. No.</span>,
      dataIndex: "_id",
      width: "70px",
      fixed: "left",
      render: (_id, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: (
        <span>
          <UserOutlined /> Username
        </span>
      ),
      dataIndex: "username",
      key: "username",
      render: (username, record) => (
        <a 
          onClick={() => navigate(`details/${record._id}`)}
          style={{ 
            color: '#1890ff',
            cursor: 'pointer',
            '&:hover': {
              color: '#40a9ff'
            }
          }}
        >
          {username}
        </a>
      ),
    },
    {
      title: (
        <span>
          <MailOutlined /> Email
        </span>
      ),
      dataIndex: "email",
      key: "email",
    },
    {
      title: (
        <span>
          <PhoneOutlined /> Mobile No
        </span>
      ),
      dataIndex: "mobileNo",
      key: "mobileNo",
    },

    {
      title: (
        <span>
          <TagOutlined /> Status
        </span>
      ),
      dataIndex: "isActive", // Assuming isActive is a boolean field
      key: "status",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: (
        <span>
          <ClockCircleOutlined /> Created At
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Action",
      key: "edit",
      width: "120px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "5px" }}>
           
          {(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
            <EditOutlined
              className="edit-button"
              onClick={() => handleEdit(record)}
            />
          )}
          {(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
            <Popconfirm
              title="Sure To Delete?"
              onConfirm={() => handleDelete(record)}
            >
              <DeleteOutlined className="delete-button" />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    navigate("create");
  };
  const {
    system_user_filter,
    client_user_filter,
    system_user_string,
    client_user_string,
  } = useSelector((state) => state.remaining);
  console.log(type === "System User" ? system_user_string : client_user_string);
  return (
    <>
      <EResponse Response={GetTaskResponse} type={"delete"} />

      <div className="feature-table-layout">
        {type === "System User" ? (
          <ModuleHeader
            handleCreate={handleCreate}
            title={type}
            filterObj={system_user_filter}
            filterString={system_user_string}
            dispatchSearchFun={SystemUserString}
            disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
          />
        ) : (
          <ModuleHeader
            handleCreate={handleCreate}
            title={type}
            filterObj={client_user_filter}
            filterString={client_user_string}
            dispatchSearchFun={ClientUserString}
            disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
          />
        )}
        {/* <ModuleHeader
          handleCreate={handleCreate}
          title={type}
          filterObj={
            type === "System User" ? system_user_filter : client_user_filter
          }
          filterString={
            type === "System User" ? system_user_string : client_user_string
          }
          dispatchSearchFun={
            type === "System User" ? SystemUserString : ClientUserString
          }
          disabled={checkAccess(user, modelName, "write")}
        /> */}
        {data ? (
          <SimpleTable data={data?.data} columns={columns} size={"small"} />
        ) : (
          <LoadingHV />
        )}
      </div>
    </>
  );
};

export default User;
